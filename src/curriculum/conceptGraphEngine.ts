// src/curriculum/conceptGraphEngine.ts
/**
 * Concept Constellation Graph Engine (Inspired by Logseq's local in-memory Datalog & AST graph)
 * Zero external dependencies.
 *
 * Traverses Curriculum Stock Numbers (CSN), canonical URNs, and prerequisite edges.
 * Performs fast topological lookups, diagnostic remediation routes, and graph rendering coordinates.
 */

import { ALL_CURRICULUM_ROUTES, CurriculumRouteNode, resolveCurriculumRoute } from './curriculumMesh';
import { getAllProgressRecords, StudentRecord } from '../services/dbStore';

export interface ConceptGraphNode {
  id: string; // CSN or URN
  csn: string;
  urn: string;
  stageId: string;
  stageTitle: string;
  subjectId: string;
  subjectTitle: string;
  topicId: string;
  topicTitle: string;
  axiom: string;
  cognitiveTrap: string;
  path: string;
  prerequisites: string[]; // List of CSNs or topicIds required before this
  unlocks: string[]; // List of CSNs or topicIds unlocked by this
  tier: number; // 1 (Foundational), 2 (Intermediate), 3 (Advanced Mastery)
  // Dynamic student runtime metrics
  masteryScore?: number; // 0 to 100%
  attempts?: number;
  trapTriggered?: boolean;
  status: 'locked' | 'available' | 'in_progress' | 'mastered' | 'remediation_needed';
}

export interface ConceptGraphEdge {
  from: string; // source CSN
  to: string; // target CSN
  relation: 'prerequisite' | 'enhances' | 'sacramental_progression';
  isActive: boolean;
}

export interface DiagnosticRemediationRoute {
  failedConcept: ConceptGraphNode;
  recommendedPrerequisite: ConceptGraphNode | null;
  remedialAxiom: string;
  socraticPivot: string;
  remedialPath: string;
  reason: string;
}

// -------------------------------------------------------------
// Curated Invariant Prerequisite Map (Domain Pedagogy Rules)
// -------------------------------------------------------------
const EXPLICIT_PREREQUISITE_RULES: Record<string, string[]> = {
  // KS1 English
  'capital-letters-stops': ['phonics-simple-sentences'],
  'story-sequencing': ['capital-letters-stops'],

  // KS2 Math
  'fractions': ['multiplication-division'],
  'decimals': ['fractions'],
  'percentages': ['decimals', 'fractions'],
  'ratio-and-proportion': ['fractions', 'multiplication-division'],
  'angles-and-triangles': ['2d-and-3d-shapes'],
  'perimeter-and-area': ['multiplication-division'],

  // KS2 Science
  'circuits-and-conductors': ['states-of-matter'],
  'forces-and-magnets': ['states-of-matter'],
  'light-and-shadows': ['forces-and-magnets'],
  'evolution-and-inheritance': ['living-things-habitats'],

  // Catholic Religious Education (Sacramental Progression & Theology)
  'first-reconciliation': ['sacrament-of-baptism'],
  'liturgy-of-the-word': ['first-reconciliation'],
  'the-last-supper': ['liturgy-of-the-word'],
  'first-holy-communion': ['the-last-supper', 'first-reconciliation'],
  'order-of-the-mass': ['first-holy-communion'],
  'sacrament-of-confirmation': ['first-holy-communion', 'sacrament-of-baptism'],
  'paschal-mystery': ['sacrament-of-confirmation'],
  'catholic-social-teaching': ['paschal-mystery'],
  'catholic-sources-of-authority': ['catholic-social-teaching'],
  'catholic-eschatology': ['catholic-sources-of-authority', 'paschal-mystery'],

  // KS3 / KS4 Sciences
  'chemical-reactions': ['atoms-and-elements'],
  'periodic-table': ['atoms-and-elements'],
  'cell-biology': ['living-things-habitats'],
  'photosynthesis': ['cell-biology'],
  'forces-motion': ['forces-and-magnets'],
  'energy-transfer': ['forces-motion'],
};

// -------------------------------------------------------------
// In-Memory Graph Index
// -------------------------------------------------------------
class ConceptGraphEngineSingleton {
  private nodeMap = new Map<string, ConceptGraphNode>();
  private edges: ConceptGraphEdge[] = [];
  private isInitialized = false;

  public init(): void {
    if (this.isInitialized) return;

    // 1. Convert all ALL_CURRICULUM_ROUTES into ConceptGraphNodes
    for (const route of ALL_CURRICULUM_ROUTES) {
      const topicNorm = route.topicId.toLowerCase().replace(/[^a-z0-9-]/g, '');
      const rawPrereqs = EXPLICIT_PREREQUISITE_RULES[topicNorm] || EXPLICIT_PREREQUISITE_RULES[route.topicId] || [];

      // Determine pedagogical tier
      let tier = 1;
      if (route.stageId === 'ks3') tier = 2;
      else if (route.stageId === 'ks4') tier = 3;
      else if (rawPrereqs.length > 0) tier = 2;

      const node: ConceptGraphNode = {
        id: route.csn || route.urn,
        csn: route.csn,
        urn: route.urn,
        stageId: route.stageId,
        stageTitle: route.stageTitle,
        subjectId: route.subjectId,
        subjectTitle: route.subjectTitle,
        topicId: route.topicId,
        topicTitle: route.topicTitle,
        axiom: route.axiom,
        cognitiveTrap: route.cognitiveTrap,
        path: route.path,
        prerequisites: [],
        unlocks: [],
        tier,
        status: 'available',
      };

      this.nodeMap.set(node.csn, node);
      this.nodeMap.set(node.urn, node);
      this.nodeMap.set(node.topicId, node);
      this.nodeMap.set(`${node.stageId}:${node.topicId}`, node);
    }

    // 2. Synthesize bi-directional edges and prerequisites
    for (const [targetTopic, prereqTopics] of Object.entries(EXPLICIT_PREREQUISITE_RULES)) {
      const targetNode = this.findNode(targetTopic);
      if (!targetNode) continue;

      for (const pTopic of prereqTopics) {
        const sourceNode = this.findNode(pTopic);
        if (!sourceNode) continue;

        if (!targetNode.prerequisites.includes(sourceNode.csn)) {
          targetNode.prerequisites.push(sourceNode.csn);
        }
        if (!sourceNode.unlocks.includes(targetNode.csn)) {
          sourceNode.unlocks.push(targetNode.csn);
        }

        const isSacramental =
          targetNode.subjectId.includes('religious') ||
          sourceNode.subjectId.includes('religious') ||
          targetNode.subjectId.includes('catholic');

        this.edges.push({
          from: sourceNode.csn,
          to: targetNode.csn,
          relation: isSacramental ? 'sacramental_progression' : 'prerequisite',
          isActive: false,
        });
      }
    }

    this.isInitialized = true;
  }

  public findNode(idOrKey: string): ConceptGraphNode | null {
    if (!idOrKey) return null;
    return (
      this.nodeMap.get(idOrKey) ||
      this.nodeMap.get(idOrKey.toUpperCase()) ||
      this.nodeMap.get(idOrKey.toLowerCase()) ||
      null
    );
  }

  public getAllNodes(): ConceptGraphNode[] {
    this.init();
    // Return unique nodes by CSN
    const unique = new Map<string, ConceptGraphNode>();
    for (const n of this.nodeMap.values()) {
      if (!unique.has(n.csn)) {
        unique.set(n.csn, n);
      }
    }
    return Array.from(unique.values());
  }

  public getAllEdges(): ConceptGraphEdge[] {
    this.init();
    return this.edges;
  }

  /**
   * Evaluates the graph against student's IndexedDB history in real-time.
   * Computes mastery scores, unlocked states, and triggers for diagnostic remediation.
   */
  public async computeDynamicState(cohortCode = 'default'): Promise<{
    nodes: ConceptGraphNode[];
    edges: ConceptGraphEdge[];
    remediations: DiagnosticRemediationRoute[];
  }> {
    this.init();
    const records: StudentRecord[] = await getAllProgressRecords();
    const relevantRecords = cohortCode === 'all' ? records : records.filter((r) => !r.cohortCode || r.cohortCode === cohortCode || cohortCode === 'default');

    // Aggregate attempts and successes per topic
    const topicStats = new Map<string, { total: number; correct: number; traps: number }>();

    for (const r of relevantRecords) {
      const top = (r.topicId || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
      const existing = topicStats.get(top) || { total: 0, correct: 0, traps: 0 };
      existing.total += 1;
      if (r.isCorrect) {
        existing.correct += 1;
      } else {
        existing.traps += 1;
      }
      topicStats.set(top, existing);
    }

    const allNodes = this.getAllNodes();
    const remediations: DiagnosticRemediationRoute[] = [];

    // First pass: Calculate mastery score and identify traps
    for (const node of allNodes) {
      const normTop = node.topicId.toLowerCase().replace(/[^a-z0-9-]/g, '');
      const stats = topicStats.get(normTop) || topicStats.get(node.topicId) || { total: 0, correct: 0, traps: 0 };

      node.attempts = stats.total;
      node.masteryScore = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      node.trapTriggered = stats.traps >= 2 && node.masteryScore < 60;

      // Status determination
      if (node.masteryScore >= 80 && stats.total >= 2) {
        node.status = 'mastered';
      } else if (node.trapTriggered) {
        node.status = 'remediation_needed';
      } else if (stats.total > 0) {
        node.status = 'in_progress';
      } else {
        node.status = 'available';
      }
    }

    // Second pass: Prerequisite gating & Remediation routing
    for (const node of allNodes) {
      if (node.status === 'remediation_needed') {
        // Find most fundamental unmastered prerequisite
        let recommendedPrereq: ConceptGraphNode | null = null;
        for (const pCsn of node.prerequisites) {
          const pNode = this.findNode(pCsn);
          if (pNode && pNode.status !== 'mastered') {
            recommendedPrereq = pNode;
            break;
          }
        }

        remediations.push({
          failedConcept: node,
          recommendedPrerequisite: recommendedPrereq,
          remedialAxiom: recommendedPrereq ? recommendedPrereq.axiom : node.axiom,
          socraticPivot: node.cognitiveTrap
            ? `Common pitfall detected: ${node.cognitiveTrap}. Let's revisit foundational principles.`
            : `Let's reinforce the core axiom: ${node.axiom}`,
          remedialPath: recommendedPrereq ? `/practice-lab?topic=${encodeURIComponent(recommendedPrereq.topicId)}` : `/practice-lab?topic=${encodeURIComponent(node.topicId)}`,
          reason: recommendedPrereq
            ? `Prerequisite [${recommendedPrereq.topicTitle}] requires reinforcement before mastering [${node.topicTitle}].`
            : `Cognitive trap triggered on [${node.topicTitle}]. Scaffolded practice recommended.`,
        });
      }

      // Check if prerequisites lock this node
      if (node.status === 'available' && node.prerequisites.length > 0) {
        const hasUnmasteredPrereqs = node.prerequisites.some((pCsn) => {
          const pNode = this.findNode(pCsn);
          return pNode && pNode.status !== 'mastered' && pNode.status !== 'in_progress';
        });
        if (hasUnmasteredPrereqs) {
          node.status = 'locked';
        }
      }
    }

    // Activate edges where both ends are in progress or mastered
    const updatedEdges = this.edges.map((e) => {
      const fromNode = this.findNode(e.from);
      const toNode = this.findNode(e.to);
      const isActive =
        Boolean(fromNode && toNode) &&
        (fromNode!.status === 'mastered' || fromNode!.status === 'in_progress');
      return { ...e, isActive };
    });

    return {
      nodes: allNodes,
      edges: updatedEdges,
      remediations,
    };
  }

  /**
   * Logseq-style Datalog-like query evaluator:
   * Finds concepts matching expressive structural constraints.
   */
  public query(criteria: {
    stageId?: string;
    subjectId?: string;
    status?: ConceptGraphNode['status'];
    hasPrerequisites?: boolean;
    search?: string;
  }): ConceptGraphNode[] {
    this.init();
    return this.getAllNodes().filter((n) => {
      if (criteria.stageId && n.stageId !== criteria.stageId) return false;
      if (criteria.subjectId && n.subjectId !== criteria.subjectId) return false;
      if (criteria.status && n.status !== criteria.status) return false;
      if (criteria.hasPrerequisites !== undefined) {
        if (criteria.hasPrerequisites && n.prerequisites.length === 0) return false;
        if (!criteria.hasPrerequisites && n.prerequisites.length > 0) return false;
      }
      if (criteria.search) {
        const q = criteria.search.toLowerCase();
        return (
          n.topicTitle.toLowerCase().includes(q) ||
          n.csn.toLowerCase().includes(q) ||
          n.axiom.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }
}

export const ConceptGraphEngine = new ConceptGraphEngineSingleton();
