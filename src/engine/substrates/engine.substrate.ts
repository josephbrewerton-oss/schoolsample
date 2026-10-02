// Auto-generated Domain Substrate: ENGINE
export const ENGINE_AST_STRING = ";; Domain AST Manifest: engine\n(:domain-substrate :engine\n  (:symbol \"generateContextualFallback\" :from \"engine/EdgeCognitiveEngine.ts\" :kind :function :return \"string\" :params ((:param \"topicKey\" :type \"string\") (:param \"isQuiz\" :type \"boolean\")))\n  (:symbol \"runLocalInference\" :from \"engine/EdgeCognitiveEngine.ts\" :kind :function :return \"Promise<string>\" :params ((:param \"prompt\" :type \"string\") (:param \"systemPrompt\" :type \"string\") (:param \"topicKey\" :type \"string\")))\n  (:symbol \"ParsedAstNode\" :from \"engine/EdgeCognitiveEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"EngineExecutionResult\" :from \"engine/EdgeCognitiveEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"AstParser\" :from \"engine/EdgeCognitiveEngine.ts\" :kind :class :return \"typeof AstParser\" :params ())\n  (:symbol \"InitProgressReport\" :from \"engine/EdgeCognitiveEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"MemoryGuardStatus\" :from \"engine/EdgeCognitiveEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"EdgeCognitiveEngine\" :from \"engine/EdgeCognitiveEngine.ts\" :kind :class :return \"typeof EdgeCognitiveEngine\" :params ())\n  (:symbol \"edgeCognitiveEngine\" :from \"engine/EdgeCognitiveEngine.ts\" :kind :const :return \"EdgeCognitiveEngine\" :params ())\n  (:symbol \"hasUserGrantedAiConsent\" :from \"engine/aicaller.ts\" :kind :function :return \"boolean\" :params ())\n  (:symbol \"setUserAiConsent\" :from \"engine/aicaller.ts\" :kind :function :return \"void\" :params ((:param \"granted\" :type \"boolean\")))\n  (:symbol \"AiInferenceOptions\" :from \"engine/aicaller.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ModelAvailability\" :from \"engine/aicaller.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CONSENT_STORAGE_KEY\" :from \"engine/aicaller.ts\" :kind :const :return \"\"ai_model_download_consent\"\" :params ())\n  (:symbol \"aiCaller\" :from \"engine/aicaller.ts\" :kind :const :return \"AiRuntimeCaller\" :params ())\n  (:symbol \"parseAST\" :from \"engine/ast-loader.ts\" :kind :function :return \"ASTNode\" :params ((:param \"source\" :type \"string\")))\n  (:symbol \"resolveTopicAST\" :from \"engine/ast-loader.ts\" :kind :function :return \"Promise<{ raw: string; ast: ASTNode; }>\" :params ((:param \"stage\" :type \"OakStage\") (:param \"subject\" :type \"OakSubject\") (:param \"topic\" :type \"OakTopic\")))\n  (:symbol \"ASTNode\" :from \"engine/ast-loader.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"RawASTQuestion\" :from \"engine/astGovernor.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"MathCheckupResult\" :from \"engine/astGovernor.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"GovernedQuestion\" :from \"engine/astGovernor.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ASTFlowGovernor\" :from \"engine/astGovernor.ts\" :kind :class :return \"typeof ASTFlowGovernor\" :params ())\n  (:symbol \"compileAstNode\" :from \"engine/astHydrator.ts\" :kind :function :return \"Promise<CurriculumAstNode>\" :params ((:param \"stage\" :type \"string\") (:param \"subject\" :type \"string\") (:param \"topic\" :type \"string\") (:param \"rawAiOutput\" :type \"{ axiom?: string; trap?: string; hook?: string; guidedStep?: string; prompt?: string; }\")))\n  (:symbol \"CurriculumAstNode\" :from \"engine/astHydrator.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"FOLDER_MANIFEST\" :from \"engine/engine.ts\" :kind :const :return \"{ readonly folder: \"src/engine\"; readonly timestamp: 1787937755193; readonly totalModules: 6; readonly exports: readonly [{ readonly name: \"ASTNode\"; readonly isType: true; readonly sourceFile: \"ast-loader\"; }, ... 15 more ..., { ...; }]; }\" :params ())\n  (:symbol \"FolderExportNames\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"parseAST\" :from \"engine/engine.ts\" :kind :function :return \"ASTNode\" :params ((:param \"source\" :type \"string\")))\n  (:symbol \"resolveTopicAST\" :from \"engine/engine.ts\" :kind :function :return \"Promise<{ raw: string; ast: ASTNode; }>\" :params ((:param \"stage\" :type \"OakStage\") (:param \"subject\" :type \"OakSubject\") (:param \"topic\" :type \"OakTopic\")))\n  (:symbol \"ASTNode\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"RawASTQuestion\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"MathCheckupResult\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"GovernedQuestion\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ASTFlowGovernor\" :from \"engine/engine.ts\" :kind :class :return \"typeof ASTFlowGovernor\" :params ())\n  (:symbol \"generateContextualFallback\" :from \"engine/engine.ts\" :kind :function :return \"string\" :params ((:param \"topicKey\" :type \"string\") (:param \"isQuiz\" :type \"boolean\")))\n  (:symbol \"runLocalInference\" :from \"engine/engine.ts\" :kind :function :return \"Promise<string>\" :params ((:param \"prompt\" :type \"string\") (:param \"systemPrompt\" :type \"string\") (:param \"topicKey\" :type \"string\")))\n  (:symbol \"ParsedAstNode\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"EngineExecutionResult\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"AstParser\" :from \"engine/engine.ts\" :kind :class :return \"typeof AstParser\" :params ())\n  (:symbol \"InitProgressReport\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"MemoryGuardStatus\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"EdgeCognitiveEngine\" :from \"engine/engine.ts\" :kind :class :return \"typeof EdgeCognitiveEngine\" :params ())\n  (:symbol \"edgeCognitiveEngine\" :from \"engine/engine.ts\" :kind :const :return \"EdgeCognitiveEngine\" :params ())\n  (:symbol \"GenerationRequest\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LessonViewContent\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"EngineResult\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"EngineFlow\" :from \"engine/engine.ts\" :kind :class :return \"typeof EngineFlow\" :params ())\n  (:symbol \"getSavedLanguage\" :from \"engine/engine.ts\" :kind :function :return \"string\" :params ())\n  (:symbol \"getLanguagePracticeMode\" :from \"engine/engine.ts\" :kind :function :return \"boolean\" :params ())\n  (:symbol \"setLanguagePracticeMode\" :from \"engine/engine.ts\" :kind :function :return \"void\" :params ((:param \"enabled\" :type \"boolean\")))\n  (:symbol \"listenToLanguagePracticeMode\" :from \"engine/engine.ts\" :kind :function :return \"() => void\" :params ((:param \"callback\" :type \"(enabled: boolean) => void\")))\n  (:symbol \"getSpeechSpeed\" :from \"engine/engine.ts\" :kind :function :return \"number\" :params ())\n  (:symbol \"setSpeechSpeed\" :from \"engine/engine.ts\" :kind :function :return \"void\" :params ((:param \"speed\" :type \"number\")))\n  (:symbol \"listenToSpeechSpeed\" :from \"engine/engine.ts\" :kind :function :return \"() => void\" :params ((:param \"callback\" :type \"(speed: number) => void\")))\n  (:symbol \"setSavedLanguage\" :from \"engine/engine.ts\" :kind :function :return \"void\" :params ((:param \"langCode\" :type \"string\")))\n  (:symbol \"listenToLanguageChange\" :from \"engine/engine.ts\" :kind :function :return \"() => void\" :params ((:param \"callback\" :type \"(lang: string) => void\")))\n  (:symbol \"LanguageSelector\" :from \"engine/engine.ts\" :kind :function :return \"any\" :params ((:param \"__0\" :type \"{ currentLang?: string; onSelect?: (langCode: string) => void; compact?: boolean; }\")))\n  (:symbol \"SupportedLanguage\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SUPPORTED_LANGUAGES\" :from \"engine/engine.ts\" :kind :const :return \"Record<string, SupportedLanguage>\" :params ())\n  (:symbol \"DEFAULT_LANGUAGE\" :from \"engine/engine.ts\" :kind :const :return \"SupportedLanguage\" :params ())\n  (:symbol \"PORTAL_LANG_STORAGE_KEY\" :from \"engine/engine.ts\" :kind :const :return \"\"portal_language\"\" :params ())\n  (:symbol \"PORTAL_PRACTICE_MODE_STORAGE_KEY\" :from \"engine/engine.ts\" :kind :const :return \"\"portal_language_practice_mode\"\" :params ())\n  (:symbol \"PORTAL_SPEECH_SPEED_STORAGE_KEY\" :from \"engine/engine.ts\" :kind :const :return \"\"portal_speech_speed\"\" :params ())\n  (:symbol \"PromptInferenceParams\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"PromptASTPreParser\" :from \"engine/engine.ts\" :kind :class :return \"typeof PromptASTPreParser\" :params ())\n  (:symbol \"GenerationRequest\" :from \"engine/engineflow.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LessonViewContent\" :from \"engine/engineflow.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"EngineResult\" :from \"engine/engineflow.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"EngineFlow\" :from \"engine/engineflow.ts\" :kind :class :return \"typeof EngineFlow\" :params ())\n  (:symbol \"invokeSubstrate\" :from \"engine/fastEndpoint.ts\" :kind :function :return \"Promise<T>\" :params ((:param \"symbolName\" :type \"string\") (:param \"args\" :type \"any[]\")))\n  (:symbol \"dispatch\" :from \"engine/hypercall.ts\" :kind :function :return \"Promise<HyperNodeResult<any>>\" :params ((:param \"targetOrMessage\" :type \"string | HyperMessage<any>\") (:param \"maybeMessage\" :type \"HyperMessage<any>\")))\n  (:symbol \"HyperMessage\" :from \"engine/hypercall.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"HyperNodeResult\" :from \"engine/hypercall.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"setHypercallDispatcher\" :from \"engine/hypervisor.ts\" :kind :function :return \"void\" :params ((:param \"fn\" :type \"HypercallDispatcher\")))\n  (:symbol \"HypercallDispatcher\" :from \"engine/hypervisor.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"GuestVMState\" :from \"engine/hypervisor.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"HypervisorMetrics\" :from \"engine/hypervisor.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"RuleAuditResult\" :from \"engine/hypervisor.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"HypervisorInferenceRequest\" :from \"engine/hypervisor.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"HypervisorInferenceResult\" :from \"engine/hypervisor.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"HypervisorHost\" :from \"engine/hypervisor.ts\" :kind :class :return \"typeof HypervisorHost\" :params ())\n  (:symbol \"hypervisor\" :from \"engine/hypervisor.ts\" :kind :const :return \"HypervisorHost\" :params ())\n  (:symbol \"PedagogicalStage\" :from \"engine/lessonSequencer.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LessonProgressState\" :from \"engine/lessonSequencer.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SequencedQuestionTemplate\" :from \"engine/lessonSequencer.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LessonSequencer\" :from \"engine/lessonSequencer.ts\" :kind :class :return \"typeof LessonSequencer\" :params ())\n  (:symbol \"GeneratedMathQuestion\" :from \"engine/mathQuestionGenerator.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"MathQuestionGenerator\" :from \"engine/mathQuestionGenerator.ts\" :kind :class :return \"typeof MathQuestionGenerator\" :params ())\n  (:symbol \"MindSpaceCoordinates\" :from \"engine/mindSpaceEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CognitiveDistractorVector\" :from \"engine/mindSpaceEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"QuestionMindSpace\" :from \"engine/mindSpaceEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"MindSpaceEngine\" :from \"engine/mindSpaceEngine.ts\" :kind :class :return \"typeof MindSpaceEngine\" :params ())\n  (:symbol \"getSavedLanguage\" :from \"engine/operational-language.tsx\" :kind :function :return \"string\" :params ())\n  (:symbol \"getLanguagePracticeMode\" :from \"engine/operational-language.tsx\" :kind :function :return \"boolean\" :params ())\n  (:symbol \"setLanguagePracticeMode\" :from \"engine/operational-language.tsx\" :kind :function :return \"void\" :params ((:param \"enabled\" :type \"boolean\")))\n  (:symbol \"listenToLanguagePracticeMode\" :from \"engine/operational-language.tsx\" :kind :function :return \"() => void\" :params ((:param \"callback\" :type \"(enabled: boolean) => void\")))\n  (:symbol \"getSpeechSpeed\" :from \"engine/operational-language.tsx\" :kind :function :return \"number\" :params ())\n  (:symbol \"setSpeechSpeed\" :from \"engine/operational-language.tsx\" :kind :function :return \"void\" :params ((:param \"speed\" :type \"number\")))\n  (:symbol \"listenToSpeechSpeed\" :from \"engine/operational-language.tsx\" :kind :function :return \"() => void\" :params ((:param \"callback\" :type \"(speed: number) => void\")))\n  (:symbol \"setSavedLanguage\" :from \"engine/operational-language.tsx\" :kind :function :return \"void\" :params ((:param \"langCode\" :type \"string\")))\n  (:symbol \"listenToLanguageChange\" :from \"engine/operational-language.tsx\" :kind :function :return \"() => void\" :params ((:param \"callback\" :type \"(lang: string) => void\")))\n  (:symbol \"LanguageSelector\" :from \"engine/operational-language.tsx\" :kind :function :return \"any\" :params ((:param \"__0\" :type \"{ currentLang?: string; onSelect?: (langCode: string) => void; compact?: boolean; }\")))\n  (:symbol \"SupportedLanguage\" :from \"engine/operational-language.tsx\" :kind :const :return \"any\" :params ())\n  (:symbol \"SUPPORTED_LANGUAGES\" :from \"engine/operational-language.tsx\" :kind :const :return \"Record<string, SupportedLanguage>\" :params ())\n  (:symbol \"DEFAULT_LANGUAGE\" :from \"engine/operational-language.tsx\" :kind :const :return \"SupportedLanguage\" :params ())\n  (:symbol \"PORTAL_LANG_STORAGE_KEY\" :from \"engine/operational-language.tsx\" :kind :const :return \"\"portal_language\"\" :params ())\n  (:symbol \"PORTAL_PRACTICE_MODE_STORAGE_KEY\" :from \"engine/operational-language.tsx\" :kind :const :return \"\"portal_language_practice_mode\"\" :params ())\n  (:symbol \"PORTAL_SPEECH_SPEED_STORAGE_KEY\" :from \"engine/operational-language.tsx\" :kind :const :return \"\"portal_speech_speed\"\" :params ())\n  (:symbol \"PRNG\" :from \"engine/prng.ts\" :kind :class :return \"typeof PRNG\" :params ())\n  (:symbol \"playKeyframeChime\" :from \"engine/proceduralAudio.ts\" :kind :function :return \"void\" :params ((:param \"keyframeIndex\" :type \"number\") (:param \"volume\" :type \"number\")))\n  (:symbol \"playSliceCutSound\" :from \"engine/proceduralAudio.ts\" :kind :function :return \"void\" :params ((:param \"volume\" :type \"number\")))\n  (:symbol \"playCelestialHum\" :from \"engine/proceduralAudio.ts\" :kind :function :return \"void\" :params ((:param \"volume\" :type \"number\")))\n  (:symbol \"playProofResolvedChord\" :from \"engine/proceduralAudio.ts\" :kind :function :return \"void\" :params ((:param \"volume\" :type \"number\")))\n  (:symbol \"PromptInferenceParams\" :from \"engine/promptAstparser.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"PromptASTPreParser\" :from \"engine/promptAstparser.ts\" :kind :class :return \"typeof PromptASTPreParser\" :params ())\n  (:symbol \"calculateByteLength\" :from \"engine/seedInflationEngine.ts\" :kind :function :return \"number\" :params ((:param \"str\" :type \"string\")))\n  (:symbol \"inflateKnowledgeSeed\" :from \"engine/seedInflationEngine.ts\" :kind :function :return \"InflatedLessonExperience\" :params ((:param \"seedKey\" :type \"string\")))\n  (:symbol \"MisconceptionProfile\" :from \"engine/seedInflationEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ProceduralQuestionVariant\" :from \"engine/seedInflationEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ASTKnowledgeSeed\" :from \"engine/seedInflationEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"InflationTelemetry\" :from \"engine/seedInflationEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"InflatedLessonExperience\" :from \"engine/seedInflationEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"COMPRESSED_KNOWLEDGE_SEEDS\" :from \"engine/seedInflationEngine.ts\" :kind :const :return \"Record<string, ASTKnowledgeSeed>\" :params ())\n  (:symbol \"generateOfflineSocraticAnswer\" :from \"engine/socraticOfflineBrain.ts\" :kind :function :return \"string\" :params ((:param \"ctx\" :type \"SocraticQueryContext\")))\n  (:symbol \"SocraticQueryContext\" :from \"engine/socraticOfflineBrain.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CoordinateAttempt\" :from \"engine/trajectoryEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CognitiveTrajectoryState\" :from \"engine/trajectoryEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"TrajectoryEngine\" :from \"engine/trajectoryEngine.ts\" :kind :class :return \"typeof TrajectoryEngine\" :params ())\n  (:symbol \"translateText\" :from \"engine/translationService.ts\" :kind :function :return \"Promise<string>\" :params ((:param \"text\" :type \"string\") (:param \"targetLang\" :type \"string\") (:param \"sourceLang\" :type \"string\")))\n  (:symbol \"translateQuestionData\" :from \"engine/translationService.ts\" :kind :function :return \"Promise<{ prompt: string; displayOptions: string[]; hint?: string; explanation?: string; misconceptions?: string[]; socraticFollowUp?: string; }>\" :params ((:param \"question\" :type \"{ prompt: string; displayOptions: string[]; hint?: string; explanation?: string; misconceptions?: string[]; socraticFollowUp?: string; }\") (:param \"targetLang\" :type \"string\")))\n  (:symbol \"translateLessonData\" :from \"engine/translationService.ts\" :kind :function :return \"Promise<{ title: string; axiom: string; trap: string; hook: string; guidedStep: string; socraticCheck: string; fullText?: string; }>\" :params ((:param \"lesson\" :type \"{ title: string; axiom: string; trap: string; hook: string; guidedStep: string; socraticCheck: string; fullText?: string; }\") (:param \"targetLang\" :type \"string\")))\n  (:symbol \"speakInLanguage\" :from \"engine/translationService.ts\" :kind :function :return \"void\" :params ((:param \"text\" :type \"string\") (:param \"langCode\" :type \"string\") (:param \"options\" :type \"{ rate?: number; onEnd?: () => void; onError?: () => void; onBoundary?: (charIndex: number) => void; }\")))\n  (:symbol \"speakBilingual\" :from \"engine/translationService.ts\" :kind :function :return \"() => void\" :params ((:param \"primaryText\" :type \"string\") (:param \"primaryLang\" :type \"string\") (:param \"secondaryText\" :type \"string\") (:param \"secondaryLang\" :type \"string\") (:param \"options\" :type \"{ rate?: number; pauseMs?: number; onPhaseChange?: (phase: \"primary\" | \"secondary\" | \"idle\") => void; onEnd?: () => void; }\")))\n  (:symbol \"cancelSpeech\" :from \"engine/translationService.ts\" :kind :function :return \"void\" :params ())\n  (:symbol \"OFFLINE_LEXICON\" :from \"engine/translationService.ts\" :kind :const :return \"Record<string, Record<string, string>>\" :params ())\n  (:symbol \"translatePageDOM\" :from \"engine/universalDomTranslator.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"targetLang\" :type \"string\")))\n  (:symbol \"restorePageDOM\" :from \"engine/universalDomTranslator.ts\" :kind :function :return \"void\" :params ())\n  (:symbol \"enableUniversalObserver\" :from \"engine/universalDomTranslator.ts\" :kind :function :return \"void\" :params ((:param \"targetLang\" :type \"string\")))\n  (:symbol \"speakCurrentPage\" :from \"engine/universalDomTranslator.ts\" :kind :function :return \"void\" :params ((:param \"targetLang\" :type \"string\")))\n  (:symbol \"UNIVERSAL_UI_LEXICON\" :from \"engine/universalDomTranslator.ts\" :kind :const :return \"Record<string, Record<string, string>>\" :params ())\n)\n";
export const ENGINE_EXPORT_CATALOG = [
  {
    "name": "generateContextualFallback",
    "kind": "function",
    "returnType": "string",
    "params": [
      {
        "name": "topicKey",
        "type": "string"
      },
      {
        "name": "isQuiz",
        "type": "boolean"
      }
    ],
    "sourceFile": "EdgeCognitiveEngine.ts",
    "relPath": "engine/EdgeCognitiveEngine.ts"
  },
  {
    "name": "runLocalInference",
    "kind": "function",
    "returnType": "Promise<string>",
    "params": [
      {
        "name": "prompt",
        "type": "string"
      },
      {
        "name": "systemPrompt",
        "type": "string"
      },
      {
        "name": "topicKey",
        "type": "string"
      }
    ],
    "sourceFile": "EdgeCognitiveEngine.ts",
    "relPath": "engine/EdgeCognitiveEngine.ts"
  },
  {
    "name": "ParsedAstNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "EdgeCognitiveEngine.ts",
    "relPath": "engine/EdgeCognitiveEngine.ts"
  },
  {
    "name": "EngineExecutionResult",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "EdgeCognitiveEngine.ts",
    "relPath": "engine/EdgeCognitiveEngine.ts"
  },
  {
    "name": "AstParser",
    "kind": "class",
    "returnType": "typeof AstParser",
    "params": [],
    "sourceFile": "EdgeCognitiveEngine.ts",
    "relPath": "engine/EdgeCognitiveEngine.ts"
  },
  {
    "name": "InitProgressReport",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "EdgeCognitiveEngine.ts",
    "relPath": "engine/EdgeCognitiveEngine.ts"
  },
  {
    "name": "MemoryGuardStatus",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "EdgeCognitiveEngine.ts",
    "relPath": "engine/EdgeCognitiveEngine.ts"
  },
  {
    "name": "EdgeCognitiveEngine",
    "kind": "class",
    "returnType": "typeof EdgeCognitiveEngine",
    "params": [],
    "sourceFile": "EdgeCognitiveEngine.ts",
    "relPath": "engine/EdgeCognitiveEngine.ts"
  },
  {
    "name": "edgeCognitiveEngine",
    "kind": "const",
    "returnType": "EdgeCognitiveEngine",
    "params": [],
    "sourceFile": "EdgeCognitiveEngine.ts",
    "relPath": "engine/EdgeCognitiveEngine.ts"
  },
  {
    "name": "hasUserGrantedAiConsent",
    "kind": "function",
    "returnType": "boolean",
    "params": [],
    "sourceFile": "aicaller.ts",
    "relPath": "engine/aicaller.ts"
  },
  {
    "name": "setUserAiConsent",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "granted",
        "type": "boolean"
      }
    ],
    "sourceFile": "aicaller.ts",
    "relPath": "engine/aicaller.ts"
  },
  {
    "name": "AiInferenceOptions",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "aicaller.ts",
    "relPath": "engine/aicaller.ts"
  },
  {
    "name": "ModelAvailability",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "aicaller.ts",
    "relPath": "engine/aicaller.ts"
  },
  {
    "name": "CONSENT_STORAGE_KEY",
    "kind": "const",
    "returnType": "\"ai_model_download_consent\"",
    "params": [],
    "sourceFile": "aicaller.ts",
    "relPath": "engine/aicaller.ts"
  },
  {
    "name": "aiCaller",
    "kind": "const",
    "returnType": "AiRuntimeCaller",
    "params": [],
    "sourceFile": "aicaller.ts",
    "relPath": "engine/aicaller.ts"
  },
  {
    "name": "parseAST",
    "kind": "function",
    "returnType": "ASTNode",
    "params": [
      {
        "name": "source",
        "type": "string"
      }
    ],
    "sourceFile": "ast-loader.ts",
    "relPath": "engine/ast-loader.ts"
  },
  {
    "name": "resolveTopicAST",
    "kind": "function",
    "returnType": "Promise<{ raw: string; ast: ASTNode; }>",
    "params": [
      {
        "name": "stage",
        "type": "OakStage"
      },
      {
        "name": "subject",
        "type": "OakSubject"
      },
      {
        "name": "topic",
        "type": "OakTopic"
      }
    ],
    "sourceFile": "ast-loader.ts",
    "relPath": "engine/ast-loader.ts"
  },
  {
    "name": "ASTNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "ast-loader.ts",
    "relPath": "engine/ast-loader.ts"
  },
  {
    "name": "RawASTQuestion",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "astGovernor.ts",
    "relPath": "engine/astGovernor.ts"
  },
  {
    "name": "MathCheckupResult",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "astGovernor.ts",
    "relPath": "engine/astGovernor.ts"
  },
  {
    "name": "GovernedQuestion",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "astGovernor.ts",
    "relPath": "engine/astGovernor.ts"
  },
  {
    "name": "ASTFlowGovernor",
    "kind": "class",
    "returnType": "typeof ASTFlowGovernor",
    "params": [],
    "sourceFile": "astGovernor.ts",
    "relPath": "engine/astGovernor.ts"
  },
  {
    "name": "compileAstNode",
    "kind": "function",
    "returnType": "Promise<CurriculumAstNode>",
    "params": [
      {
        "name": "stage",
        "type": "string"
      },
      {
        "name": "subject",
        "type": "string"
      },
      {
        "name": "topic",
        "type": "string"
      },
      {
        "name": "rawAiOutput",
        "type": "{ axiom?: string; trap?: string; hook?: string; guidedStep?: string; prompt?: string; }"
      }
    ],
    "sourceFile": "astHydrator.ts",
    "relPath": "engine/astHydrator.ts"
  },
  {
    "name": "CurriculumAstNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "astHydrator.ts",
    "relPath": "engine/astHydrator.ts"
  },
  {
    "name": "FOLDER_MANIFEST",
    "kind": "const",
    "returnType": "{ readonly folder: \"src/engine\"; readonly timestamp: 1787937755193; readonly totalModules: 6; readonly exports: readonly [{ readonly name: \"ASTNode\"; readonly isType: true; readonly sourceFile: \"ast-loader\"; }, ... 15 more ..., { ...; }]; }",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "FolderExportNames",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "parseAST",
    "kind": "function",
    "returnType": "ASTNode",
    "params": [
      {
        "name": "source",
        "type": "string"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "resolveTopicAST",
    "kind": "function",
    "returnType": "Promise<{ raw: string; ast: ASTNode; }>",
    "params": [
      {
        "name": "stage",
        "type": "OakStage"
      },
      {
        "name": "subject",
        "type": "OakSubject"
      },
      {
        "name": "topic",
        "type": "OakTopic"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "ASTNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "RawASTQuestion",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "MathCheckupResult",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "GovernedQuestion",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "ASTFlowGovernor",
    "kind": "class",
    "returnType": "typeof ASTFlowGovernor",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "generateContextualFallback",
    "kind": "function",
    "returnType": "string",
    "params": [
      {
        "name": "topicKey",
        "type": "string"
      },
      {
        "name": "isQuiz",
        "type": "boolean"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "runLocalInference",
    "kind": "function",
    "returnType": "Promise<string>",
    "params": [
      {
        "name": "prompt",
        "type": "string"
      },
      {
        "name": "systemPrompt",
        "type": "string"
      },
      {
        "name": "topicKey",
        "type": "string"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "ParsedAstNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "EngineExecutionResult",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "AstParser",
    "kind": "class",
    "returnType": "typeof AstParser",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "InitProgressReport",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "MemoryGuardStatus",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "EdgeCognitiveEngine",
    "kind": "class",
    "returnType": "typeof EdgeCognitiveEngine",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "edgeCognitiveEngine",
    "kind": "const",
    "returnType": "EdgeCognitiveEngine",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "GenerationRequest",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "LessonViewContent",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "EngineResult",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "EngineFlow",
    "kind": "class",
    "returnType": "typeof EngineFlow",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "getSavedLanguage",
    "kind": "function",
    "returnType": "string",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "getLanguagePracticeMode",
    "kind": "function",
    "returnType": "boolean",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "setLanguagePracticeMode",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "enabled",
        "type": "boolean"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "listenToLanguagePracticeMode",
    "kind": "function",
    "returnType": "() => void",
    "params": [
      {
        "name": "callback",
        "type": "(enabled: boolean) => void"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "getSpeechSpeed",
    "kind": "function",
    "returnType": "number",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "setSpeechSpeed",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "speed",
        "type": "number"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "listenToSpeechSpeed",
    "kind": "function",
    "returnType": "() => void",
    "params": [
      {
        "name": "callback",
        "type": "(speed: number) => void"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "setSavedLanguage",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "langCode",
        "type": "string"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "listenToLanguageChange",
    "kind": "function",
    "returnType": "() => void",
    "params": [
      {
        "name": "callback",
        "type": "(lang: string) => void"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "LanguageSelector",
    "kind": "function",
    "returnType": "any",
    "params": [
      {
        "name": "__0",
        "type": "{ currentLang?: string; onSelect?: (langCode: string) => void; compact?: boolean; }"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "SupportedLanguage",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "SUPPORTED_LANGUAGES",
    "kind": "const",
    "returnType": "Record<string, SupportedLanguage>",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "DEFAULT_LANGUAGE",
    "kind": "const",
    "returnType": "SupportedLanguage",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "PORTAL_LANG_STORAGE_KEY",
    "kind": "const",
    "returnType": "\"portal_language\"",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "PORTAL_PRACTICE_MODE_STORAGE_KEY",
    "kind": "const",
    "returnType": "\"portal_language_practice_mode\"",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "PORTAL_SPEECH_SPEED_STORAGE_KEY",
    "kind": "const",
    "returnType": "\"portal_speech_speed\"",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "PromptInferenceParams",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "PromptASTPreParser",
    "kind": "class",
    "returnType": "typeof PromptASTPreParser",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "engine/engine.ts"
  },
  {
    "name": "GenerationRequest",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engineflow.ts",
    "relPath": "engine/engineflow.ts"
  },
  {
    "name": "LessonViewContent",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engineflow.ts",
    "relPath": "engine/engineflow.ts"
  },
  {
    "name": "EngineResult",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engineflow.ts",
    "relPath": "engine/engineflow.ts"
  },
  {
    "name": "EngineFlow",
    "kind": "class",
    "returnType": "typeof EngineFlow",
    "params": [],
    "sourceFile": "engineflow.ts",
    "relPath": "engine/engineflow.ts"
  },
  {
    "name": "invokeSubstrate",
    "kind": "function",
    "returnType": "Promise<T>",
    "params": [
      {
        "name": "symbolName",
        "type": "string"
      },
      {
        "name": "args",
        "type": "any[]"
      }
    ],
    "sourceFile": "fastEndpoint.ts",
    "relPath": "engine/fastEndpoint.ts"
  },
  {
    "name": "dispatch",
    "kind": "function",
    "returnType": "Promise<HyperNodeResult<any>>",
    "params": [
      {
        "name": "targetOrMessage",
        "type": "string | HyperMessage<any>"
      },
      {
        "name": "maybeMessage",
        "type": "HyperMessage<any>"
      }
    ],
    "sourceFile": "hypercall.ts",
    "relPath": "engine/hypercall.ts"
  },
  {
    "name": "HyperMessage",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "hypercall.ts",
    "relPath": "engine/hypercall.ts"
  },
  {
    "name": "HyperNodeResult",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "hypercall.ts",
    "relPath": "engine/hypercall.ts"
  },
  {
    "name": "setHypercallDispatcher",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "fn",
        "type": "HypercallDispatcher"
      }
    ],
    "sourceFile": "hypervisor.ts",
    "relPath": "engine/hypervisor.ts"
  },
  {
    "name": "HypercallDispatcher",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "hypervisor.ts",
    "relPath": "engine/hypervisor.ts"
  },
  {
    "name": "GuestVMState",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "hypervisor.ts",
    "relPath": "engine/hypervisor.ts"
  },
  {
    "name": "HypervisorMetrics",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "hypervisor.ts",
    "relPath": "engine/hypervisor.ts"
  },
  {
    "name": "RuleAuditResult",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "hypervisor.ts",
    "relPath": "engine/hypervisor.ts"
  },
  {
    "name": "HypervisorInferenceRequest",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "hypervisor.ts",
    "relPath": "engine/hypervisor.ts"
  },
  {
    "name": "HypervisorInferenceResult",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "hypervisor.ts",
    "relPath": "engine/hypervisor.ts"
  },
  {
    "name": "HypervisorHost",
    "kind": "class",
    "returnType": "typeof HypervisorHost",
    "params": [],
    "sourceFile": "hypervisor.ts",
    "relPath": "engine/hypervisor.ts"
  },
  {
    "name": "hypervisor",
    "kind": "const",
    "returnType": "HypervisorHost",
    "params": [],
    "sourceFile": "hypervisor.ts",
    "relPath": "engine/hypervisor.ts"
  },
  {
    "name": "PedagogicalStage",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "lessonSequencer.ts",
    "relPath": "engine/lessonSequencer.ts"
  },
  {
    "name": "LessonProgressState",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "lessonSequencer.ts",
    "relPath": "engine/lessonSequencer.ts"
  },
  {
    "name": "SequencedQuestionTemplate",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "lessonSequencer.ts",
    "relPath": "engine/lessonSequencer.ts"
  },
  {
    "name": "LessonSequencer",
    "kind": "class",
    "returnType": "typeof LessonSequencer",
    "params": [],
    "sourceFile": "lessonSequencer.ts",
    "relPath": "engine/lessonSequencer.ts"
  },
  {
    "name": "GeneratedMathQuestion",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "mathQuestionGenerator.ts",
    "relPath": "engine/mathQuestionGenerator.ts"
  },
  {
    "name": "MathQuestionGenerator",
    "kind": "class",
    "returnType": "typeof MathQuestionGenerator",
    "params": [],
    "sourceFile": "mathQuestionGenerator.ts",
    "relPath": "engine/mathQuestionGenerator.ts"
  },
  {
    "name": "MindSpaceCoordinates",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "mindSpaceEngine.ts",
    "relPath": "engine/mindSpaceEngine.ts"
  },
  {
    "name": "CognitiveDistractorVector",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "mindSpaceEngine.ts",
    "relPath": "engine/mindSpaceEngine.ts"
  },
  {
    "name": "QuestionMindSpace",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "mindSpaceEngine.ts",
    "relPath": "engine/mindSpaceEngine.ts"
  },
  {
    "name": "MindSpaceEngine",
    "kind": "class",
    "returnType": "typeof MindSpaceEngine",
    "params": [],
    "sourceFile": "mindSpaceEngine.ts",
    "relPath": "engine/mindSpaceEngine.ts"
  },
  {
    "name": "getSavedLanguage",
    "kind": "function",
    "returnType": "string",
    "params": [],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "getLanguagePracticeMode",
    "kind": "function",
    "returnType": "boolean",
    "params": [],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "setLanguagePracticeMode",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "enabled",
        "type": "boolean"
      }
    ],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "listenToLanguagePracticeMode",
    "kind": "function",
    "returnType": "() => void",
    "params": [
      {
        "name": "callback",
        "type": "(enabled: boolean) => void"
      }
    ],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "getSpeechSpeed",
    "kind": "function",
    "returnType": "number",
    "params": [],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "setSpeechSpeed",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "speed",
        "type": "number"
      }
    ],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "listenToSpeechSpeed",
    "kind": "function",
    "returnType": "() => void",
    "params": [
      {
        "name": "callback",
        "type": "(speed: number) => void"
      }
    ],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "setSavedLanguage",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "langCode",
        "type": "string"
      }
    ],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "listenToLanguageChange",
    "kind": "function",
    "returnType": "() => void",
    "params": [
      {
        "name": "callback",
        "type": "(lang: string) => void"
      }
    ],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "LanguageSelector",
    "kind": "function",
    "returnType": "any",
    "params": [
      {
        "name": "__0",
        "type": "{ currentLang?: string; onSelect?: (langCode: string) => void; compact?: boolean; }"
      }
    ],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "SupportedLanguage",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "SUPPORTED_LANGUAGES",
    "kind": "const",
    "returnType": "Record<string, SupportedLanguage>",
    "params": [],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "DEFAULT_LANGUAGE",
    "kind": "const",
    "returnType": "SupportedLanguage",
    "params": [],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "PORTAL_LANG_STORAGE_KEY",
    "kind": "const",
    "returnType": "\"portal_language\"",
    "params": [],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "PORTAL_PRACTICE_MODE_STORAGE_KEY",
    "kind": "const",
    "returnType": "\"portal_language_practice_mode\"",
    "params": [],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "PORTAL_SPEECH_SPEED_STORAGE_KEY",
    "kind": "const",
    "returnType": "\"portal_speech_speed\"",
    "params": [],
    "sourceFile": "operational-language.tsx",
    "relPath": "engine/operational-language.tsx"
  },
  {
    "name": "PRNG",
    "kind": "class",
    "returnType": "typeof PRNG",
    "params": [],
    "sourceFile": "prng.ts",
    "relPath": "engine/prng.ts"
  },
  {
    "name": "playKeyframeChime",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "keyframeIndex",
        "type": "number"
      },
      {
        "name": "volume",
        "type": "number"
      }
    ],
    "sourceFile": "proceduralAudio.ts",
    "relPath": "engine/proceduralAudio.ts"
  },
  {
    "name": "playSliceCutSound",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "volume",
        "type": "number"
      }
    ],
    "sourceFile": "proceduralAudio.ts",
    "relPath": "engine/proceduralAudio.ts"
  },
  {
    "name": "playCelestialHum",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "volume",
        "type": "number"
      }
    ],
    "sourceFile": "proceduralAudio.ts",
    "relPath": "engine/proceduralAudio.ts"
  },
  {
    "name": "playProofResolvedChord",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "volume",
        "type": "number"
      }
    ],
    "sourceFile": "proceduralAudio.ts",
    "relPath": "engine/proceduralAudio.ts"
  },
  {
    "name": "PromptInferenceParams",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "promptAstparser.ts",
    "relPath": "engine/promptAstparser.ts"
  },
  {
    "name": "PromptASTPreParser",
    "kind": "class",
    "returnType": "typeof PromptASTPreParser",
    "params": [],
    "sourceFile": "promptAstparser.ts",
    "relPath": "engine/promptAstparser.ts"
  },
  {
    "name": "calculateByteLength",
    "kind": "function",
    "returnType": "number",
    "params": [
      {
        "name": "str",
        "type": "string"
      }
    ],
    "sourceFile": "seedInflationEngine.ts",
    "relPath": "engine/seedInflationEngine.ts"
  },
  {
    "name": "inflateKnowledgeSeed",
    "kind": "function",
    "returnType": "InflatedLessonExperience",
    "params": [
      {
        "name": "seedKey",
        "type": "string"
      }
    ],
    "sourceFile": "seedInflationEngine.ts",
    "relPath": "engine/seedInflationEngine.ts"
  },
  {
    "name": "MisconceptionProfile",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "seedInflationEngine.ts",
    "relPath": "engine/seedInflationEngine.ts"
  },
  {
    "name": "ProceduralQuestionVariant",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "seedInflationEngine.ts",
    "relPath": "engine/seedInflationEngine.ts"
  },
  {
    "name": "ASTKnowledgeSeed",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "seedInflationEngine.ts",
    "relPath": "engine/seedInflationEngine.ts"
  },
  {
    "name": "InflationTelemetry",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "seedInflationEngine.ts",
    "relPath": "engine/seedInflationEngine.ts"
  },
  {
    "name": "InflatedLessonExperience",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "seedInflationEngine.ts",
    "relPath": "engine/seedInflationEngine.ts"
  },
  {
    "name": "COMPRESSED_KNOWLEDGE_SEEDS",
    "kind": "const",
    "returnType": "Record<string, ASTKnowledgeSeed>",
    "params": [],
    "sourceFile": "seedInflationEngine.ts",
    "relPath": "engine/seedInflationEngine.ts"
  },
  {
    "name": "generateOfflineSocraticAnswer",
    "kind": "function",
    "returnType": "string",
    "params": [
      {
        "name": "ctx",
        "type": "SocraticQueryContext"
      }
    ],
    "sourceFile": "socraticOfflineBrain.ts",
    "relPath": "engine/socraticOfflineBrain.ts"
  },
  {
    "name": "SocraticQueryContext",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "socraticOfflineBrain.ts",
    "relPath": "engine/socraticOfflineBrain.ts"
  },
  {
    "name": "CoordinateAttempt",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "trajectoryEngine.ts",
    "relPath": "engine/trajectoryEngine.ts"
  },
  {
    "name": "CognitiveTrajectoryState",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "trajectoryEngine.ts",
    "relPath": "engine/trajectoryEngine.ts"
  },
  {
    "name": "TrajectoryEngine",
    "kind": "class",
    "returnType": "typeof TrajectoryEngine",
    "params": [],
    "sourceFile": "trajectoryEngine.ts",
    "relPath": "engine/trajectoryEngine.ts"
  },
  {
    "name": "translateText",
    "kind": "function",
    "returnType": "Promise<string>",
    "params": [
      {
        "name": "text",
        "type": "string"
      },
      {
        "name": "targetLang",
        "type": "string"
      },
      {
        "name": "sourceLang",
        "type": "string"
      }
    ],
    "sourceFile": "translationService.ts",
    "relPath": "engine/translationService.ts"
  },
  {
    "name": "translateQuestionData",
    "kind": "function",
    "returnType": "Promise<{ prompt: string; displayOptions: string[]; hint?: string; explanation?: string; misconceptions?: string[]; socraticFollowUp?: string; }>",
    "params": [
      {
        "name": "question",
        "type": "{ prompt: string; displayOptions: string[]; hint?: string; explanation?: string; misconceptions?: string[]; socraticFollowUp?: string; }"
      },
      {
        "name": "targetLang",
        "type": "string"
      }
    ],
    "sourceFile": "translationService.ts",
    "relPath": "engine/translationService.ts"
  },
  {
    "name": "translateLessonData",
    "kind": "function",
    "returnType": "Promise<{ title: string; axiom: string; trap: string; hook: string; guidedStep: string; socraticCheck: string; fullText?: string; }>",
    "params": [
      {
        "name": "lesson",
        "type": "{ title: string; axiom: string; trap: string; hook: string; guidedStep: string; socraticCheck: string; fullText?: string; }"
      },
      {
        "name": "targetLang",
        "type": "string"
      }
    ],
    "sourceFile": "translationService.ts",
    "relPath": "engine/translationService.ts"
  },
  {
    "name": "speakInLanguage",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "text",
        "type": "string"
      },
      {
        "name": "langCode",
        "type": "string"
      },
      {
        "name": "options",
        "type": "{ rate?: number; onEnd?: () => void; onError?: () => void; onBoundary?: (charIndex: number) => void; }"
      }
    ],
    "sourceFile": "translationService.ts",
    "relPath": "engine/translationService.ts"
  },
  {
    "name": "speakBilingual",
    "kind": "function",
    "returnType": "() => void",
    "params": [
      {
        "name": "primaryText",
        "type": "string"
      },
      {
        "name": "primaryLang",
        "type": "string"
      },
      {
        "name": "secondaryText",
        "type": "string"
      },
      {
        "name": "secondaryLang",
        "type": "string"
      },
      {
        "name": "options",
        "type": "{ rate?: number; pauseMs?: number; onPhaseChange?: (phase: \"primary\" | \"secondary\" | \"idle\") => void; onEnd?: () => void; }"
      }
    ],
    "sourceFile": "translationService.ts",
    "relPath": "engine/translationService.ts"
  },
  {
    "name": "cancelSpeech",
    "kind": "function",
    "returnType": "void",
    "params": [],
    "sourceFile": "translationService.ts",
    "relPath": "engine/translationService.ts"
  },
  {
    "name": "OFFLINE_LEXICON",
    "kind": "const",
    "returnType": "Record<string, Record<string, string>>",
    "params": [],
    "sourceFile": "translationService.ts",
    "relPath": "engine/translationService.ts"
  },
  {
    "name": "translatePageDOM",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [
      {
        "name": "targetLang",
        "type": "string"
      }
    ],
    "sourceFile": "universalDomTranslator.ts",
    "relPath": "engine/universalDomTranslator.ts"
  },
  {
    "name": "restorePageDOM",
    "kind": "function",
    "returnType": "void",
    "params": [],
    "sourceFile": "universalDomTranslator.ts",
    "relPath": "engine/universalDomTranslator.ts"
  },
  {
    "name": "enableUniversalObserver",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "targetLang",
        "type": "string"
      }
    ],
    "sourceFile": "universalDomTranslator.ts",
    "relPath": "engine/universalDomTranslator.ts"
  },
  {
    "name": "speakCurrentPage",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "targetLang",
        "type": "string"
      }
    ],
    "sourceFile": "universalDomTranslator.ts",
    "relPath": "engine/universalDomTranslator.ts"
  },
  {
    "name": "UNIVERSAL_UI_LEXICON",
    "kind": "const",
    "returnType": "Record<string, Record<string, string>>",
    "params": [],
    "sourceFile": "universalDomTranslator.ts",
    "relPath": "engine/universalDomTranslator.ts"
  }
] as const;
