// Auto-generated Global AST Substrate Manifest
export const ROOT_AST_STRING = ";; Collated Root AST Manifest\n(:root-substrate\n  (:symbol \"CurriculumSelector\" :from \"components/CurriculumSelector.tsx\" :kind :const :return \"React.FC<Props>\" :params ())\n  (:symbol \"default\" :from \"components/CurriculumSelector.tsx\" :kind :const :return \"React.FC<Props>\" :params ())\n  (:symbol \"default\" :from \"components/DynamicLessonViewer.tsx\" :kind :function :return \"React.JSX.Element\" :params ((:param \"__0\" :type \"EngineProps\")))\n  (:symbol \"default\" :from \"components/InteractiveEdgeSandbox.tsx\" :kind :function :return \"any\" :params ((:param \"props\" :type \"SandboxProps\")))\n  (:symbol \"TuringTutor\" :from \"components/NanoAssistantPanel.tsx\" :kind :function :return \"any\" :params ((:param \"__0\" :type \"TuringTutorProps\")))\n  (:symbol \"default\" :from \"components/NanoAssistantPanel.tsx\" :kind :const :return \"any\" :params ((:param \"__0\" :type \"TuringTutorProps\")))\n  (:symbol \"default\" :from \"components/NeuralLabCanvas.tsx\" :kind :function :return \"any\" :params ((:param \"__0\" :type \"NeuralLabCanvasProps\")))\n  (:symbol \"QuestionCard\" :from \"components/QuestionCard.tsx\" :kind :const :return \"React.FC<Props>\" :params ())\n  (:symbol \"default\" :from \"components/SExprViewRenderer.tsx\" :kind :function :return \"any\" :params ((:param \"__0\" :type \"Props\")))\n  (:symbol \"SettingsModal\" :from \"components/SettingsModal.tsx\" :kind :const :return \"React.FC<SettingsModalProps>\" :params ())\n  (:symbol \"FlowCurriculumState\" :from \"components/componentsFlow.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"NanoSessionConfig\" :from \"components/componentsFlow.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"GroundedContextResult\" :from \"components/componentsFlow.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ComponentsFlow\" :from \"components/componentsFlow.ts\" :kind :class :return \"typeof ComponentsFlow\" :params ())\n  (:symbol \"FOLDER_MANIFEST\" :from \"components/engine.ts\" :kind :const :return \"{ readonly folder: \"src/components\"; readonly timestamp: 1787937755135; readonly totalModules: 9; readonly exports: readonly [{ readonly name: \"FlowCurriculumState\"; readonly isType: true; readonly sourceFile: \"componentsFlow\"; }, ... 10 more ..., { ...; }]; }\" :params ())\n  (:symbol \"FolderExportNames\" :from \"components/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"FlowCurriculumState\" :from \"components/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"NanoSessionConfig\" :from \"components/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"GroundedContextResult\" :from \"components/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ComponentsFlow\" :from \"components/engine.ts\" :kind :class :return \"typeof ComponentsFlow\" :params ())\n  (:symbol \"CurriculumSelector\" :from \"components/engine.ts\" :kind :const :return \"React.FC<Props>\" :params ())\n  (:symbol \"TuringTutor\" :from \"components/engine.ts\" :kind :function :return \"any\" :params ((:param \"__0\" :type \"TuringTutorProps\")))\n  (:symbol \"QuestionCard\" :from \"components/engine.ts\" :kind :const :return \"React.FC<Props>\" :params ())\n  (:symbol \"SettingsModal\" :from \"components/engine.ts\" :kind :const :return \"React.FC<SettingsModalProps>\" :params ())\n  (:symbol \"adaptOakStage\" :from \"curriculum/curriculumAdapter.ts\" :kind :function :return \"StandardStage\" :params ((:param \"stage\" :type \"any\")))\n  (:symbol \"StandardTopic\" :from \"curriculum/curriculumAdapter.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"StandardSubject\" :from \"curriculum/curriculumAdapter.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"StandardStage\" :from \"curriculum/curriculumAdapter.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"FOLDER_MANIFEST\" :from \"curriculum/engine.ts\" :kind :const :return \"{ readonly folder: \"src/curriculum\"; readonly timestamp: 1787937755228; readonly totalModules: 2; readonly exports: readonly [{ readonly name: \"StandardTopic\"; readonly isType: true; readonly sourceFile: \"curriculumAdapter\"; }, ... 8 more ..., { ...; }]; }\" :params ())\n  (:symbol \"FolderExportNames\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"adaptOakStage\" :from \"curriculum/engine.ts\" :kind :function :return \"StandardStage\" :params ((:param \"stage\" :type \"any\")))\n  (:symbol \"StandardTopic\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"StandardSubject\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"StandardStage\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OakTopic\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OakSubject\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OakStage\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OAK_CURRICULUM_CATALOGUE\" :from \"curriculum/engine.ts\" :kind :const :return \"Record<string, OakStage>\" :params ())\n  (:symbol \"OakCatalogue\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"DEFAULT_OAK_CATALOGUE\" :from \"curriculum/engine.ts\" :kind :const :return \"OakCatalogue\" :params ())\n  (:symbol \"getActiveCurriculum\" :from \"curriculum/index.ts\" :kind :function :return \"CurriculumPackage\" :params ((:param \"id\" :type \"string\")))\n  (:symbol \"dispatchAstIntent\" :from \"curriculum/index.ts\" :kind :function :return \"T\" :params ((:param \"symbolName\" :type \"string\") (:param \"args\" :type \"any[]\")))\n  (:symbol \"CurriculumPackage\" :from \"curriculum/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CurriculumRegistry\" :from \"curriculum/index.ts\" :kind :const :return \"Record<string, CurriculumPackage>\" :params ())\n  (:symbol \"generateCurriculumAst\" :from \"curriculum/mineCurriculumAst.ts\" :kind :function :return \"void\" :params ((:param \"dirPath\" :type \"string\") (:param \"outputPath\" :type \"string\")))\n  (:symbol \"OakTopic\" :from \"curriculum/oakCatalogue.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OakSubject\" :from \"curriculum/oakCatalogue.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OakStage\" :from \"curriculum/oakCatalogue.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OAK_CURRICULUM_CATALOGUE\" :from \"curriculum/oakCatalogue.ts\" :kind :const :return \"Record<string, OakStage>\" :params ())\n  (:symbol \"OakCatalogue\" :from \"curriculum/oakCatalogue.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"DEFAULT_OAK_CATALOGUE\" :from \"curriculum/oakCatalogue.ts\" :kind :const :return \"OakCatalogue\" :params ())\n  (:symbol \"getActiveCurriculumTree\" :from \"data/curriculumRegistry.ts\" :kind :function :return \"Record<string, StandardStage>\" :params ((:param \"providerKey\" :type \"CurriculumProviderKey\")))\n  (:symbol \"CurriculumProviderKey\" :from \"data/curriculumRegistry.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CURRICULUM_PROVIDERS\" :from \"data/curriculumRegistry.ts\" :kind :const :return \"Record<CurriculumProviderKey, () => Record<string, StandardStage>>\" :params ())\n  (:symbol \"OakLessonSeed\" :from \"data/oakCurriculumSeeds.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OAK_CURRICULUM_SEEDS\" :from \"data/oakCurriculumSeeds.ts\" :kind :const :return \"Record<string, OakLessonSeed>\" :params ())\n  (:symbol \"runLocalInference\" :from \"engine/EdgeCognitiveEngine.tsx\" :kind :function :return \"Promise<string>\" :params ((:param \"prompt\" :type \"string\") (:param \"systemPrompt\" :type \"string\") (:param \"topicKey\" :type \"string\")))\n  (:symbol \"default\" :from \"engine/EdgeCognitiveEngine.tsx\" :kind :function :return \"any\" :params ((:param \"__0\" :type \"{ runtimeConfig?: any; }\")))\n  (:symbol \"AiInferenceOptions\" :from \"engine/aicaller.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ModelAvailability\" :from \"engine/aicaller.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"aiCaller\" :from \"engine/aicaller.ts\" :kind :const :return \"AiRuntimeCaller\" :params ())\n  (:symbol \"parseAST\" :from \"engine/ast-loader.ts\" :kind :function :return \"ASTNode\" :params ((:param \"source\" :type \"string\")))\n  (:symbol \"resolveTopicAST\" :from \"engine/ast-loader.ts\" :kind :function :return \"Promise<{ raw: string; ast: ASTNode; }>\" :params ((:param \"stage\" :type \"OakStage\") (:param \"subject\" :type \"OakSubject\") (:param \"topic\" :type \"OakTopic\")))\n  (:symbol \"ASTNode\" :from \"engine/ast-loader.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"RawASTQuestion\" :from \"engine/astGovernor.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"GovernedQuestion\" :from \"engine/astGovernor.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ASTFlowGovernor\" :from \"engine/astGovernor.ts\" :kind :class :return \"typeof ASTFlowGovernor\" :params ())\n  (:symbol \"compileAstNode\" :from \"engine/astHydrator.ts\" :kind :function :return \"Promise<CurriculumAstNode>\" :params ((:param \"stage\" :type \"string\") (:param \"subject\" :type \"string\") (:param \"topic\" :type \"string\") (:param \"rawAiOutput\" :type \"{ axiom?: string; trap?: string; hook?: string; guidedStep?: string; prompt?: string; }\")))\n  (:symbol \"CurriculumAstNode\" :from \"engine/astHydrator.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"FOLDER_MANIFEST\" :from \"engine/engine.ts\" :kind :const :return \"{ readonly folder: \"src/engine\"; readonly timestamp: 1787937755193; readonly totalModules: 6; readonly exports: readonly [{ readonly name: \"ASTNode\"; readonly isType: true; readonly sourceFile: \"ast-loader\"; }, ... 15 more ..., { ...; }]; }\" :params ())\n  (:symbol \"FolderExportNames\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"parseAST\" :from \"engine/engine.ts\" :kind :function :return \"ASTNode\" :params ((:param \"source\" :type \"string\")))\n  (:symbol \"resolveTopicAST\" :from \"engine/engine.ts\" :kind :function :return \"Promise<{ raw: string; ast: ASTNode; }>\" :params ((:param \"stage\" :type \"OakStage\") (:param \"subject\" :type \"OakSubject\") (:param \"topic\" :type \"OakTopic\")))\n  (:symbol \"ASTNode\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"RawASTQuestion\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"GovernedQuestion\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ASTFlowGovernor\" :from \"engine/engine.ts\" :kind :class :return \"typeof ASTFlowGovernor\" :params ())\n  (:symbol \"runLocalInference\" :from \"engine/engine.ts\" :kind :function :return \"Promise<string>\" :params ((:param \"prompt\" :type \"string\") (:param \"systemPrompt\" :type \"string\") (:param \"topicKey\" :type \"string\")))\n  (:symbol \"GenerationRequest\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LessonViewContent\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"EngineResult\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"EngineFlow\" :from \"engine/engine.ts\" :kind :class :return \"typeof EngineFlow\" :params ())\n  (:symbol \"LanguageSelector\" :from \"engine/engine.ts\" :kind :function :return \"any\" :params ((:param \"__0\" :type \"{ currentLang: string; onSelect: (langCode: string) => void; }\")))\n  (:symbol \"SupportedLanguage\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SUPPORTED_LANGUAGES\" :from \"engine/engine.ts\" :kind :const :return \"Record<string, SupportedLanguage>\" :params ())\n  (:symbol \"DEFAULT_LANGUAGE\" :from \"engine/engine.ts\" :kind :const :return \"SupportedLanguage\" :params ())\n  (:symbol \"PromptInferenceParams\" :from \"engine/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"PromptASTPreParser\" :from \"engine/engine.ts\" :kind :class :return \"typeof PromptASTPreParser\" :params ())\n  (:symbol \"GenerationRequest\" :from \"engine/engineflow.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LessonViewContent\" :from \"engine/engineflow.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"EngineResult\" :from \"engine/engineflow.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"EngineFlow\" :from \"engine/engineflow.ts\" :kind :class :return \"typeof EngineFlow\" :params ())\n  (:symbol \"invokeSubstrate\" :from \"engine/fastEndpoint.ts\" :kind :function :return \"Promise<T>\" :params ((:param \"symbolName\" :type \"string\") (:param \"args\" :type \"any[]\")))\n  (:symbol \"dispatch\" :from \"engine/hypercall.ts\" :kind :function :return \"Promise<HyperNodeResult<any>>\" :params ((:param \"target\" :type \"string\") (:param \"message\" :type \"HyperMessage<any>\")))\n  (:symbol \"HyperMessage\" :from \"engine/hypercall.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"HyperNodeResult\" :from \"engine/hypercall.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LanguageSelector\" :from \"engine/operational-language.tsx\" :kind :function :return \"any\" :params ((:param \"__0\" :type \"{ currentLang: string; onSelect: (langCode: string) => void; }\")))\n  (:symbol \"SupportedLanguage\" :from \"engine/operational-language.tsx\" :kind :const :return \"any\" :params ())\n  (:symbol \"SUPPORTED_LANGUAGES\" :from \"engine/operational-language.tsx\" :kind :const :return \"Record<string, SupportedLanguage>\" :params ())\n  (:symbol \"DEFAULT_LANGUAGE\" :from \"engine/operational-language.tsx\" :kind :const :return \"SupportedLanguage\" :params ())\n  (:symbol \"PromptInferenceParams\" :from \"engine/promptAstparser.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"PromptASTPreParser\" :from \"engine/promptAstparser.ts\" :kind :class :return \"typeof PromptASTPreParser\" :params ())\n  (:symbol \"ROOT_AST_STRING\" :from \"engine/rootSubstrate.generated.ts\" :kind :const :return \"\";; Collated Root AST Manifest\\n(:root-substrate\\n  (:symbol \\\"CurriculumSelector\\\" :from \\\"components/CurriculumSelector.tsx\\\" :kind :const :return \\\"React.FC<Props>\\\" :params ())\\n  (:symbol \\\"default\\\" :from \\\"components/CurriculumSelector.tsx\\\" :kind :const :return \\\"React.FC<Props>\\\" :params ())\\n  (:symbol \\\"d...\" :params ())\n  (:symbol \"ROOT_EXPORT_CATALOG\" :from \"engine/rootSubstrate.generated.ts\" :kind :const :return \"readonly [{ readonly name: \"CurriculumSelector\"; readonly kind: \"const\"; readonly returnType: \"React.FC<Props>\"; readonly params: readonly []; readonly sourceFile: \"CurriculumSelector.tsx\"; readonly relPath: \"components/CurriculumSelector.tsx\"; }, ... 192 more ..., { ...; }]\" :params ())\n  (:symbol \"FOLDER_MANIFEST\" :from \"hooks/engine.ts\" :kind :const :return \"{ readonly folder: \"src/hooks\"; readonly timestamp: 1787937755214; readonly totalModules: 4; readonly exports: readonly [{ readonly name: \"HOOKS_MANIFEST\"; readonly isType: false; readonly sourceFile: \"hookengine\"; }, ... 4 more ..., { ...; }]; }\" :params ())\n  (:symbol \"FolderExportNames\" :from \"hooks/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"HOOKS_MANIFEST\" :from \"hooks/engine.ts\" :kind :const :return \"{ readonly folder: \"src/hooks\"; readonly timestamp: number; readonly capabilities: readonly [{ readonly name: \"useCurriculumStandard\"; readonly type: \"state-syncer\"; readonly description: \"Cross-tab local storage state for UK Oak vs International\"; }, { ...; }, { ...; }]; }\" :params ())\n  (:symbol \"useCurriculumStandard\" :from \"hooks/engine.ts\" :kind :function :return \"[CurriculumProviderKey, (val: CurriculumProviderKey) => void]\" :params ())\n  (:symbol \"useWebRTCNeuralBus\" :from \"hooks/engine.ts\" :kind :function :return \"{ isReady: boolean; status: string; sendIntent: (keyStage: string, subject: string, unit: string, ksId?: string, subId?: string, unitId?: string, curriculum?: string) => boolean; }\" :params ((:param \"onQuestionReady\" :type \"(payload: QuestionPayload) => void\")))\n  (:symbol \"QuestionPayload\" :from \"hooks/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"useKnowledgeStage\" :from \"hooks/engine.ts\" :kind :function :return \"{ activeProps: Record<string, any>; isReady: boolean; }\" :params ((:param \"keyStage\" :type \"string\") (:param \"subject\" :type \"string\") (:param \"fallbackRegistry\" :type \"any\")))\n  (:symbol \"StagePayload\" :from \"hooks/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"HOOKS_MANIFEST\" :from \"hooks/hookengine.ts\" :kind :const :return \"{ readonly folder: \"src/hooks\"; readonly timestamp: number; readonly capabilities: readonly [{ readonly name: \"useCurriculumStandard\"; readonly type: \"state-syncer\"; readonly description: \"Cross-tab local storage state for UK Oak vs International\"; }, { ...; }, { ...; }]; }\" :params ())\n  (:symbol \"useCurriculumStandard\" :from \"hooks/hookengine.ts\" :kind :function :return \"[CurriculumProviderKey, (val: CurriculumProviderKey) => void]\" :params ())\n  (:symbol \"useWebRTCNeuralBus\" :from \"hooks/hookengine.ts\" :kind :function :return \"{ isReady: boolean; status: string; sendIntent: (keyStage: string, subject: string, unit: string, ksId?: string, subId?: string, unitId?: string, curriculum?: string) => boolean; }\" :params ((:param \"onQuestionReady\" :type \"(payload: QuestionPayload) => void\")))\n  (:symbol \"QuestionPayload\" :from \"hooks/hookengine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"useCurriculumStandard\" :from \"hooks/useCurriculumStandard.ts\" :kind :function :return \"[CurriculumProviderKey, (val: CurriculumProviderKey) => void]\" :params ())\n  (:symbol \"useKnowledgeStage\" :from \"hooks/useKnowledgestage.ts\" :kind :function :return \"{ activeProps: Record<string, any>; isReady: boolean; }\" :params ((:param \"keyStage\" :type \"string\") (:param \"subject\" :type \"string\") (:param \"fallbackRegistry\" :type \"any\")))\n  (:symbol \"StagePayload\" :from \"hooks/useKnowledgestage.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"useWebRTCNeuralBus\" :from \"hooks/useWebRTCNeuralBus.ts\" :kind :function :return \"{ isReady: boolean; status: string; sendIntent: (keyStage: string, subject: string, unit: string, ksId?: string, subId?: string, unitId?: string, curriculum?: string) => boolean; }\" :params ((:param \"onQuestionReady\" :type \"(payload: QuestionPayload) => void\")))\n  (:symbol \"QuestionPayload\" :from \"hooks/useWebRTCNeuralBus.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"initCurriculumDB\" :from \"lib/browser-rag.ts\" :kind :function :return \"Promise<IDBDatabase>\" :params ())\n  (:symbol \"syncCurriculumIndex\" :from \"lib/browser-rag.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"db\" :type \"IDBDatabase\")))\n  (:symbol \"searchCurriculum\" :from \"lib/browser-rag.ts\" :kind :function :return \"Promise<RAGMatch[]>\" :params ((:param \"db\" :type \"IDBDatabase\") (:param \"query\" :type \"string\") (:param \"topK\" :type \"number\")))\n  (:symbol \"getLessonManifest\" :from \"lib/browser-rag.ts\" :kind :function :return \"Promise<any>\" :params ((:param \"db\" :type \"IDBDatabase\") (:param \"id\" :type \"string\") (:param \"manifestPath\" :type \"string\")))\n  (:symbol \"RAGMatch\" :from \"lib/browser-rag.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"FOLDER_MANIFEST\" :from \"lib/engine.ts\" :kind :const :return \"{ readonly folder: \"src/lib\"; readonly timestamp: 1787937755144; readonly totalModules: 1; readonly exports: readonly [{ readonly name: \"RAGMatch\"; readonly isType: true; readonly sourceFile: \"browser-rag\"; }, { ...; }, { ...; }, { ...; }, { ...; }]; }\" :params ())\n  (:symbol \"FolderExportNames\" :from \"lib/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"initCurriculumDB\" :from \"lib/engine.ts\" :kind :function :return \"Promise<IDBDatabase>\" :params ())\n  (:symbol \"syncCurriculumIndex\" :from \"lib/engine.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"db\" :type \"IDBDatabase\")))\n  (:symbol \"searchCurriculum\" :from \"lib/engine.ts\" :kind :function :return \"Promise<RAGMatch[]>\" :params ((:param \"db\" :type \"IDBDatabase\") (:param \"query\" :type \"string\") (:param \"topK\" :type \"number\")))\n  (:symbol \"getLessonManifest\" :from \"lib/engine.ts\" :kind :function :return \"Promise<any>\" :params ((:param \"db\" :type \"IDBDatabase\") (:param \"id\" :type \"string\") (:param \"manifestPath\" :type \"string\")))\n  (:symbol \"RAGMatch\" :from \"lib/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"COMMUNION_MANIFEST\" :from \"manifests/communion.ts\" :kind :const :return \"DomainManifest\" :params ())\n  (:symbol \"SCHOOL_MANIFEST\" :from \"manifests/school.ts\" :kind :const :return \"DomainManifest\" :params ())\n  (:symbol \"VFS_CURRICULUM_SEEDS\" :from \"manifests/vfsSeedModules.ts\" :kind :const :return \"Record<string, string>\" :params ())\n  (:symbol \"default\" :from \"pages/index.tsx\" :kind :function :return \"any\" :params ())\n  (:symbol \"default\" :from \"pages/learning-zone.tsx\" :kind :function :return \"any\" :params ())\n  (:symbol \"LessonViewContent\" :from \"pages/learning-zone.tsx\" :kind :const :return \"any\" :params ())\n  (:symbol \"default\" :from \"pages/practice-lab.tsx\" :kind :function :return \"any\" :params ())\n  (:symbol \"default\" :from \"pages/settings.tsx\" :kind :function :return \"any\" :params ())\n  (:symbol \"getRuleSet\" :from \"rules/index.ts\" :kind :function :return \"RulePackage\" :params ((:param \"name\" :type \"string\")))\n  (:symbol \"RulePackage\" :from \"rules/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"RulesRegistry\" :from \"rules/index.ts\" :kind :const :return \"Record<string, RulePackage>\" :params ())\n  (:symbol \"openLocalDB\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<IDBDatabase>\" :params ())\n  (:symbol \"getBufferedLesson\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<CachedLessonRecord>\" :params ((:param \"key\" :type \"string\")))\n  (:symbol \"putBufferedLesson\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"lesson\" :type \"CachedLessonRecord\")))\n  (:symbol \"saveManifest\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"manifest\" :type \"DomainManifest\")))\n  (:symbol \"getManifest\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<DomainManifest>\" :params ((:param \"domainId\" :type \"string\")))\n  (:symbol \"logProgress\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"record\" :type \"StudentRecord\")))\n  (:symbol \"getTuringDiagnosticSummary\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<{ accuracy: number; commonErrors: string[]; }>\" :params ((:param \"topicId\" :type \"string\")))\n  (:symbol \"saveTopicAdapter\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"adapter\" :type \"TopicAdapterRecord\")))\n  (:symbol \"getTopicAdapter\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<TopicAdapterRecord>\" :params ((:param \"topicKey\" :type \"string\")))\n  (:symbol \"bootstrapTopicAdapters\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ())\n  (:symbol \"saveVerifiedAST\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"topicKey\" :type \"string\") (:param \"rawAST\" :type \"string\")))\n  (:symbol \"getBufferedQuestion\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<string>\" :params ((:param \"topicKey\" :type \"string\")))\n  (:symbol \"checkAndReplenishBuffer\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"topicKey\" :type \"string\") (:param \"minThreshold\" :type \"number\") (:param \"triggerWorker\" :type \"(key: string) => Promise<void>\")))\n  (:symbol \"getRandomCachedAST\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<string>\" :params ((:param \"topicKey\" :type \"string\")))\n  (:symbol \"saveVfsView\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"path\" :type \"string\") (:param \"content\" :type \"string\")))\n  (:symbol \"getVfsView\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<string>\" :params ((:param \"path\" :type \"string\")))\n  (:symbol \"bootstrapVfsViews\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"defaultViews\" :type \"Record<string, string>\")))\n  (:symbol \"purgeInactiveManifests\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"activeDomainId\" :type \"string\") (:param \"preservedDomains\" :type \"string[]\")))\n  (:symbol \"STORE_VIEWS\" :from \"services/dbStore.ts\" :kind :const :return \"\"vfs_views\"\" :params ())\n  (:symbol \"StudentRecord\" :from \"services/dbStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"VfsViewRecord\" :from \"services/dbStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"TopicAdapterRecord\" :from \"services/dbStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CachedASTRecord\" :from \"services/dbStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CachedLessonRecord\" :from \"services/dbStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"getDB\" :from \"services/dbStore.ts\" :kind :const :return \"Promise<IDBDatabase>\" :params ())\n  (:symbol \"DEFAULT_TOPIC_ADAPTERS\" :from \"services/dbStore.ts\" :kind :const :return \"TopicAdapterRecord[]\" :params ())\n  (:symbol \"openJotterDB\" :from \"services/jotter-db.ts\" :kind :function :return \"Promise<IDBDatabase>\" :params ())\n  (:symbol \"appendJotter\" :from \"services/jotter-db.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"entry\" :type \"Omit<JotterEntry, \"timestamp\">\")))\n  (:symbol \"getRecentJotterEntries\" :from \"services/jotter-db.ts\" :kind :function :return \"Promise<JotterEntry[]>\" :params ((:param \"sessionId\" :type \"string\") (:param \"limit\" :type \"number\")))\n  (:symbol \"JotterEntry\" :from \"services/jotter-db.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"default\" :from \"theme/PwaReloadPopup/index.tsx\" :kind :function :return \"any\" :params ())\n  (:symbol \"default\" :from \"theme/root.tsx\" :kind :function :return \"React.JSX.Element\" :params ((:param \"__0\" :type \"{ children: React.ReactNode; }\")))\n  (:symbol \"SemanticRule\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"Challenge\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"Cohort\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"TutorPersona\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"DomainManifest\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LearningStream\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CatalogItem\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"StreamCategory\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"MasterCatalog\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SExprAtom\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SExprNode\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SExprAST\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"extractQuestionFromAst\" :from \"utils/astQuestionExtractor.ts\" :kind :function :return \"ExtractedQuestion\" :params ((:param \"rawLisp\" :type \"string\")))\n  (:symbol \"ExtractedQuestion\" :from \"utils/astQuestionExtractor.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"Channel\" :from \"utils/channelBus.ts\" :kind :class :return \"typeof Channel\" :params ())\n  (:symbol \"Channels\" :from \"utils/channelBus.ts\" :kind :const :return \"{ UI_ACTIONS: Channel<{ action: string; payload: any; }>; AI_DIAGNOSTICS: Channel<{ studentId: string; challengeId: string; answer: string; isCorrect: boolean; }>; PROGRESS_LOG: Channel<...>; }\" :params ())\n  (:symbol \"generateSessionReport\" :from \"utils/sessionReporter.ts\" :kind :function :return \"Promise<SessionReportSummary>\" :params ((:param \"sessionId\" :type \"string\")))\n  (:symbol \"downloadReportAsHtml\" :from \"utils/sessionReporter.ts\" :kind :function :return \"void\" :params ((:param \"summary\" :type \"SessionReportSummary\")))\n  (:symbol \"SessionReportSummary\" :from \"utils/sessionReporter.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"parseSExpr\" :from \"utils/sexprParser.ts\" :kind :function :return \"SExprAST\" :params ((:param \"input\" :type \"string\")))\n)\n";
export const ROOT_EXPORT_CATALOG = [
  {
    "name": "CurriculumSelector",
    "kind": "const",
    "returnType": "React.FC<Props>",
    "params": [],
    "sourceFile": "CurriculumSelector.tsx",
    "relPath": "components/CurriculumSelector.tsx"
  },
  {
    "name": "default",
    "kind": "const",
    "returnType": "React.FC<Props>",
    "params": [],
    "sourceFile": "CurriculumSelector.tsx",
    "relPath": "components/CurriculumSelector.tsx"
  },
  {
    "name": "default",
    "kind": "function",
    "returnType": "React.JSX.Element",
    "params": [
      {
        "name": "__0",
        "type": "EngineProps"
      }
    ],
    "sourceFile": "DynamicLessonViewer.tsx",
    "relPath": "components/DynamicLessonViewer.tsx"
  },
  {
    "name": "default",
    "kind": "function",
    "returnType": "any",
    "params": [
      {
        "name": "props",
        "type": "SandboxProps"
      }
    ],
    "sourceFile": "InteractiveEdgeSandbox.tsx",
    "relPath": "components/InteractiveEdgeSandbox.tsx"
  },
  {
    "name": "TuringTutor",
    "kind": "function",
    "returnType": "any",
    "params": [
      {
        "name": "__0",
        "type": "TuringTutorProps"
      }
    ],
    "sourceFile": "NanoAssistantPanel.tsx",
    "relPath": "components/NanoAssistantPanel.tsx"
  },
  {
    "name": "default",
    "kind": "const",
    "returnType": "any",
    "params": [
      {
        "name": "__0",
        "type": "TuringTutorProps"
      }
    ],
    "sourceFile": "NanoAssistantPanel.tsx",
    "relPath": "components/NanoAssistantPanel.tsx"
  },
  {
    "name": "default",
    "kind": "function",
    "returnType": "any",
    "params": [
      {
        "name": "__0",
        "type": "NeuralLabCanvasProps"
      }
    ],
    "sourceFile": "NeuralLabCanvas.tsx",
    "relPath": "components/NeuralLabCanvas.tsx"
  },
  {
    "name": "QuestionCard",
    "kind": "const",
    "returnType": "React.FC<Props>",
    "params": [],
    "sourceFile": "QuestionCard.tsx",
    "relPath": "components/QuestionCard.tsx"
  },
  {
    "name": "default",
    "kind": "function",
    "returnType": "any",
    "params": [
      {
        "name": "__0",
        "type": "Props"
      }
    ],
    "sourceFile": "SExprViewRenderer.tsx",
    "relPath": "components/SExprViewRenderer.tsx"
  },
  {
    "name": "SettingsModal",
    "kind": "const",
    "returnType": "React.FC<SettingsModalProps>",
    "params": [],
    "sourceFile": "SettingsModal.tsx",
    "relPath": "components/SettingsModal.tsx"
  },
  {
    "name": "FlowCurriculumState",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "componentsFlow.ts",
    "relPath": "components/componentsFlow.ts"
  },
  {
    "name": "NanoSessionConfig",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "componentsFlow.ts",
    "relPath": "components/componentsFlow.ts"
  },
  {
    "name": "GroundedContextResult",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "componentsFlow.ts",
    "relPath": "components/componentsFlow.ts"
  },
  {
    "name": "ComponentsFlow",
    "kind": "class",
    "returnType": "typeof ComponentsFlow",
    "params": [],
    "sourceFile": "componentsFlow.ts",
    "relPath": "components/componentsFlow.ts"
  },
  {
    "name": "FOLDER_MANIFEST",
    "kind": "const",
    "returnType": "{ readonly folder: \"src/components\"; readonly timestamp: 1787937755135; readonly totalModules: 9; readonly exports: readonly [{ readonly name: \"FlowCurriculumState\"; readonly isType: true; readonly sourceFile: \"componentsFlow\"; }, ... 10 more ..., { ...; }]; }",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "components/engine.ts"
  },
  {
    "name": "FolderExportNames",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "components/engine.ts"
  },
  {
    "name": "FlowCurriculumState",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "components/engine.ts"
  },
  {
    "name": "NanoSessionConfig",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "components/engine.ts"
  },
  {
    "name": "GroundedContextResult",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "components/engine.ts"
  },
  {
    "name": "ComponentsFlow",
    "kind": "class",
    "returnType": "typeof ComponentsFlow",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "components/engine.ts"
  },
  {
    "name": "CurriculumSelector",
    "kind": "const",
    "returnType": "React.FC<Props>",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "components/engine.ts"
  },
  {
    "name": "TuringTutor",
    "kind": "function",
    "returnType": "any",
    "params": [
      {
        "name": "__0",
        "type": "TuringTutorProps"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "components/engine.ts"
  },
  {
    "name": "QuestionCard",
    "kind": "const",
    "returnType": "React.FC<Props>",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "components/engine.ts"
  },
  {
    "name": "SettingsModal",
    "kind": "const",
    "returnType": "React.FC<SettingsModalProps>",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "components/engine.ts"
  },
  {
    "name": "adaptOakStage",
    "kind": "function",
    "returnType": "StandardStage",
    "params": [
      {
        "name": "stage",
        "type": "any"
      }
    ],
    "sourceFile": "curriculumAdapter.ts",
    "relPath": "curriculum/curriculumAdapter.ts"
  },
  {
    "name": "StandardTopic",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "curriculumAdapter.ts",
    "relPath": "curriculum/curriculumAdapter.ts"
  },
  {
    "name": "StandardSubject",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "curriculumAdapter.ts",
    "relPath": "curriculum/curriculumAdapter.ts"
  },
  {
    "name": "StandardStage",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "curriculumAdapter.ts",
    "relPath": "curriculum/curriculumAdapter.ts"
  },
  {
    "name": "FOLDER_MANIFEST",
    "kind": "const",
    "returnType": "{ readonly folder: \"src/curriculum\"; readonly timestamp: 1787937755228; readonly totalModules: 2; readonly exports: readonly [{ readonly name: \"StandardTopic\"; readonly isType: true; readonly sourceFile: \"curriculumAdapter\"; }, ... 8 more ..., { ...; }]; }",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "curriculum/engine.ts"
  },
  {
    "name": "FolderExportNames",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "curriculum/engine.ts"
  },
  {
    "name": "adaptOakStage",
    "kind": "function",
    "returnType": "StandardStage",
    "params": [
      {
        "name": "stage",
        "type": "any"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "curriculum/engine.ts"
  },
  {
    "name": "StandardTopic",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "curriculum/engine.ts"
  },
  {
    "name": "StandardSubject",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "curriculum/engine.ts"
  },
  {
    "name": "StandardStage",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "curriculum/engine.ts"
  },
  {
    "name": "OakTopic",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "curriculum/engine.ts"
  },
  {
    "name": "OakSubject",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "curriculum/engine.ts"
  },
  {
    "name": "OakStage",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "curriculum/engine.ts"
  },
  {
    "name": "OAK_CURRICULUM_CATALOGUE",
    "kind": "const",
    "returnType": "Record<string, OakStage>",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "curriculum/engine.ts"
  },
  {
    "name": "OakCatalogue",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "curriculum/engine.ts"
  },
  {
    "name": "DEFAULT_OAK_CATALOGUE",
    "kind": "const",
    "returnType": "OakCatalogue",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "curriculum/engine.ts"
  },
  {
    "name": "getActiveCurriculum",
    "kind": "function",
    "returnType": "CurriculumPackage",
    "params": [
      {
        "name": "id",
        "type": "string"
      }
    ],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "dispatchAstIntent",
    "kind": "function",
    "returnType": "T",
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
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "CurriculumPackage",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "CurriculumRegistry",
    "kind": "const",
    "returnType": "Record<string, CurriculumPackage>",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "generateCurriculumAst",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "dirPath",
        "type": "string"
      },
      {
        "name": "outputPath",
        "type": "string"
      }
    ],
    "sourceFile": "mineCurriculumAst.ts",
    "relPath": "curriculum/mineCurriculumAst.ts"
  },
  {
    "name": "OakTopic",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "oakCatalogue.ts",
    "relPath": "curriculum/oakCatalogue.ts"
  },
  {
    "name": "OakSubject",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "oakCatalogue.ts",
    "relPath": "curriculum/oakCatalogue.ts"
  },
  {
    "name": "OakStage",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "oakCatalogue.ts",
    "relPath": "curriculum/oakCatalogue.ts"
  },
  {
    "name": "OAK_CURRICULUM_CATALOGUE",
    "kind": "const",
    "returnType": "Record<string, OakStage>",
    "params": [],
    "sourceFile": "oakCatalogue.ts",
    "relPath": "curriculum/oakCatalogue.ts"
  },
  {
    "name": "OakCatalogue",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "oakCatalogue.ts",
    "relPath": "curriculum/oakCatalogue.ts"
  },
  {
    "name": "DEFAULT_OAK_CATALOGUE",
    "kind": "const",
    "returnType": "OakCatalogue",
    "params": [],
    "sourceFile": "oakCatalogue.ts",
    "relPath": "curriculum/oakCatalogue.ts"
  },
  {
    "name": "getActiveCurriculumTree",
    "kind": "function",
    "returnType": "Record<string, StandardStage>",
    "params": [
      {
        "name": "providerKey",
        "type": "CurriculumProviderKey"
      }
    ],
    "sourceFile": "curriculumRegistry.ts",
    "relPath": "data/curriculumRegistry.ts"
  },
  {
    "name": "CurriculumProviderKey",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "curriculumRegistry.ts",
    "relPath": "data/curriculumRegistry.ts"
  },
  {
    "name": "CURRICULUM_PROVIDERS",
    "kind": "const",
    "returnType": "Record<CurriculumProviderKey, () => Record<string, StandardStage>>",
    "params": [],
    "sourceFile": "curriculumRegistry.ts",
    "relPath": "data/curriculumRegistry.ts"
  },
  {
    "name": "OakLessonSeed",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "oakCurriculumSeeds.ts",
    "relPath": "data/oakCurriculumSeeds.ts"
  },
  {
    "name": "OAK_CURRICULUM_SEEDS",
    "kind": "const",
    "returnType": "Record<string, OakLessonSeed>",
    "params": [],
    "sourceFile": "oakCurriculumSeeds.ts",
    "relPath": "data/oakCurriculumSeeds.ts"
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
    "sourceFile": "EdgeCognitiveEngine.tsx",
    "relPath": "engine/EdgeCognitiveEngine.tsx"
  },
  {
    "name": "default",
    "kind": "function",
    "returnType": "any",
    "params": [
      {
        "name": "__0",
        "type": "{ runtimeConfig?: any; }"
      }
    ],
    "sourceFile": "EdgeCognitiveEngine.tsx",
    "relPath": "engine/EdgeCognitiveEngine.tsx"
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
    "name": "LanguageSelector",
    "kind": "function",
    "returnType": "any",
    "params": [
      {
        "name": "__0",
        "type": "{ currentLang: string; onSelect: (langCode: string) => void; }"
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
        "name": "target",
        "type": "string"
      },
      {
        "name": "message",
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
    "name": "LanguageSelector",
    "kind": "function",
    "returnType": "any",
    "params": [
      {
        "name": "__0",
        "type": "{ currentLang: string; onSelect: (langCode: string) => void; }"
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
    "name": "ROOT_AST_STRING",
    "kind": "const",
    "returnType": "\";; Collated Root AST Manifest\\n(:root-substrate\\n  (:symbol \\\"CurriculumSelector\\\" :from \\\"components/CurriculumSelector.tsx\\\" :kind :const :return \\\"React.FC<Props>\\\" :params ())\\n  (:symbol \\\"default\\\" :from \\\"components/CurriculumSelector.tsx\\\" :kind :const :return \\\"React.FC<Props>\\\" :params ())\\n  (:symbol \\\"d...",
    "params": [],
    "sourceFile": "rootSubstrate.generated.ts",
    "relPath": "engine/rootSubstrate.generated.ts"
  },
  {
    "name": "ROOT_EXPORT_CATALOG",
    "kind": "const",
    "returnType": "readonly [{ readonly name: \"CurriculumSelector\"; readonly kind: \"const\"; readonly returnType: \"React.FC<Props>\"; readonly params: readonly []; readonly sourceFile: \"CurriculumSelector.tsx\"; readonly relPath: \"components/CurriculumSelector.tsx\"; }, ... 192 more ..., { ...; }]",
    "params": [],
    "sourceFile": "rootSubstrate.generated.ts",
    "relPath": "engine/rootSubstrate.generated.ts"
  },
  {
    "name": "FOLDER_MANIFEST",
    "kind": "const",
    "returnType": "{ readonly folder: \"src/hooks\"; readonly timestamp: 1787937755214; readonly totalModules: 4; readonly exports: readonly [{ readonly name: \"HOOKS_MANIFEST\"; readonly isType: false; readonly sourceFile: \"hookengine\"; }, ... 4 more ..., { ...; }]; }",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "hooks/engine.ts"
  },
  {
    "name": "FolderExportNames",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "hooks/engine.ts"
  },
  {
    "name": "HOOKS_MANIFEST",
    "kind": "const",
    "returnType": "{ readonly folder: \"src/hooks\"; readonly timestamp: number; readonly capabilities: readonly [{ readonly name: \"useCurriculumStandard\"; readonly type: \"state-syncer\"; readonly description: \"Cross-tab local storage state for UK Oak vs International\"; }, { ...; }, { ...; }]; }",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "hooks/engine.ts"
  },
  {
    "name": "useCurriculumStandard",
    "kind": "function",
    "returnType": "[CurriculumProviderKey, (val: CurriculumProviderKey) => void]",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "hooks/engine.ts"
  },
  {
    "name": "useWebRTCNeuralBus",
    "kind": "function",
    "returnType": "{ isReady: boolean; status: string; sendIntent: (keyStage: string, subject: string, unit: string, ksId?: string, subId?: string, unitId?: string, curriculum?: string) => boolean; }",
    "params": [
      {
        "name": "onQuestionReady",
        "type": "(payload: QuestionPayload) => void"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "hooks/engine.ts"
  },
  {
    "name": "QuestionPayload",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "hooks/engine.ts"
  },
  {
    "name": "useKnowledgeStage",
    "kind": "function",
    "returnType": "{ activeProps: Record<string, any>; isReady: boolean; }",
    "params": [
      {
        "name": "keyStage",
        "type": "string"
      },
      {
        "name": "subject",
        "type": "string"
      },
      {
        "name": "fallbackRegistry",
        "type": "any"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "hooks/engine.ts"
  },
  {
    "name": "StagePayload",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "hooks/engine.ts"
  },
  {
    "name": "HOOKS_MANIFEST",
    "kind": "const",
    "returnType": "{ readonly folder: \"src/hooks\"; readonly timestamp: number; readonly capabilities: readonly [{ readonly name: \"useCurriculumStandard\"; readonly type: \"state-syncer\"; readonly description: \"Cross-tab local storage state for UK Oak vs International\"; }, { ...; }, { ...; }]; }",
    "params": [],
    "sourceFile": "hookengine.ts",
    "relPath": "hooks/hookengine.ts"
  },
  {
    "name": "useCurriculumStandard",
    "kind": "function",
    "returnType": "[CurriculumProviderKey, (val: CurriculumProviderKey) => void]",
    "params": [],
    "sourceFile": "hookengine.ts",
    "relPath": "hooks/hookengine.ts"
  },
  {
    "name": "useWebRTCNeuralBus",
    "kind": "function",
    "returnType": "{ isReady: boolean; status: string; sendIntent: (keyStage: string, subject: string, unit: string, ksId?: string, subId?: string, unitId?: string, curriculum?: string) => boolean; }",
    "params": [
      {
        "name": "onQuestionReady",
        "type": "(payload: QuestionPayload) => void"
      }
    ],
    "sourceFile": "hookengine.ts",
    "relPath": "hooks/hookengine.ts"
  },
  {
    "name": "QuestionPayload",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "hookengine.ts",
    "relPath": "hooks/hookengine.ts"
  },
  {
    "name": "useCurriculumStandard",
    "kind": "function",
    "returnType": "[CurriculumProviderKey, (val: CurriculumProviderKey) => void]",
    "params": [],
    "sourceFile": "useCurriculumStandard.ts",
    "relPath": "hooks/useCurriculumStandard.ts"
  },
  {
    "name": "useKnowledgeStage",
    "kind": "function",
    "returnType": "{ activeProps: Record<string, any>; isReady: boolean; }",
    "params": [
      {
        "name": "keyStage",
        "type": "string"
      },
      {
        "name": "subject",
        "type": "string"
      },
      {
        "name": "fallbackRegistry",
        "type": "any"
      }
    ],
    "sourceFile": "useKnowledgestage.ts",
    "relPath": "hooks/useKnowledgestage.ts"
  },
  {
    "name": "StagePayload",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "useKnowledgestage.ts",
    "relPath": "hooks/useKnowledgestage.ts"
  },
  {
    "name": "useWebRTCNeuralBus",
    "kind": "function",
    "returnType": "{ isReady: boolean; status: string; sendIntent: (keyStage: string, subject: string, unit: string, ksId?: string, subId?: string, unitId?: string, curriculum?: string) => boolean; }",
    "params": [
      {
        "name": "onQuestionReady",
        "type": "(payload: QuestionPayload) => void"
      }
    ],
    "sourceFile": "useWebRTCNeuralBus.ts",
    "relPath": "hooks/useWebRTCNeuralBus.ts"
  },
  {
    "name": "QuestionPayload",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "useWebRTCNeuralBus.ts",
    "relPath": "hooks/useWebRTCNeuralBus.ts"
  },
  {
    "name": "initCurriculumDB",
    "kind": "function",
    "returnType": "Promise<IDBDatabase>",
    "params": [],
    "sourceFile": "browser-rag.ts",
    "relPath": "lib/browser-rag.ts"
  },
  {
    "name": "syncCurriculumIndex",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [
      {
        "name": "db",
        "type": "IDBDatabase"
      }
    ],
    "sourceFile": "browser-rag.ts",
    "relPath": "lib/browser-rag.ts"
  },
  {
    "name": "searchCurriculum",
    "kind": "function",
    "returnType": "Promise<RAGMatch[]>",
    "params": [
      {
        "name": "db",
        "type": "IDBDatabase"
      },
      {
        "name": "query",
        "type": "string"
      },
      {
        "name": "topK",
        "type": "number"
      }
    ],
    "sourceFile": "browser-rag.ts",
    "relPath": "lib/browser-rag.ts"
  },
  {
    "name": "getLessonManifest",
    "kind": "function",
    "returnType": "Promise<any>",
    "params": [
      {
        "name": "db",
        "type": "IDBDatabase"
      },
      {
        "name": "id",
        "type": "string"
      },
      {
        "name": "manifestPath",
        "type": "string"
      }
    ],
    "sourceFile": "browser-rag.ts",
    "relPath": "lib/browser-rag.ts"
  },
  {
    "name": "RAGMatch",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "browser-rag.ts",
    "relPath": "lib/browser-rag.ts"
  },
  {
    "name": "FOLDER_MANIFEST",
    "kind": "const",
    "returnType": "{ readonly folder: \"src/lib\"; readonly timestamp: 1787937755144; readonly totalModules: 1; readonly exports: readonly [{ readonly name: \"RAGMatch\"; readonly isType: true; readonly sourceFile: \"browser-rag\"; }, { ...; }, { ...; }, { ...; }, { ...; }]; }",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "lib/engine.ts"
  },
  {
    "name": "FolderExportNames",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "lib/engine.ts"
  },
  {
    "name": "initCurriculumDB",
    "kind": "function",
    "returnType": "Promise<IDBDatabase>",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "lib/engine.ts"
  },
  {
    "name": "syncCurriculumIndex",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [
      {
        "name": "db",
        "type": "IDBDatabase"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "lib/engine.ts"
  },
  {
    "name": "searchCurriculum",
    "kind": "function",
    "returnType": "Promise<RAGMatch[]>",
    "params": [
      {
        "name": "db",
        "type": "IDBDatabase"
      },
      {
        "name": "query",
        "type": "string"
      },
      {
        "name": "topK",
        "type": "number"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "lib/engine.ts"
  },
  {
    "name": "getLessonManifest",
    "kind": "function",
    "returnType": "Promise<any>",
    "params": [
      {
        "name": "db",
        "type": "IDBDatabase"
      },
      {
        "name": "id",
        "type": "string"
      },
      {
        "name": "manifestPath",
        "type": "string"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "lib/engine.ts"
  },
  {
    "name": "RAGMatch",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "engine.ts",
    "relPath": "lib/engine.ts"
  },
  {
    "name": "COMMUNION_MANIFEST",
    "kind": "const",
    "returnType": "DomainManifest",
    "params": [],
    "sourceFile": "communion.ts",
    "relPath": "manifests/communion.ts"
  },
  {
    "name": "SCHOOL_MANIFEST",
    "kind": "const",
    "returnType": "DomainManifest",
    "params": [],
    "sourceFile": "school.ts",
    "relPath": "manifests/school.ts"
  },
  {
    "name": "VFS_CURRICULUM_SEEDS",
    "kind": "const",
    "returnType": "Record<string, string>",
    "params": [],
    "sourceFile": "vfsSeedModules.ts",
    "relPath": "manifests/vfsSeedModules.ts"
  },
  {
    "name": "default",
    "kind": "function",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "pages/index.tsx"
  },
  {
    "name": "default",
    "kind": "function",
    "returnType": "any",
    "params": [],
    "sourceFile": "learning-zone.tsx",
    "relPath": "pages/learning-zone.tsx"
  },
  {
    "name": "LessonViewContent",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "learning-zone.tsx",
    "relPath": "pages/learning-zone.tsx"
  },
  {
    "name": "default",
    "kind": "function",
    "returnType": "any",
    "params": [],
    "sourceFile": "practice-lab.tsx",
    "relPath": "pages/practice-lab.tsx"
  },
  {
    "name": "default",
    "kind": "function",
    "returnType": "any",
    "params": [],
    "sourceFile": "settings.tsx",
    "relPath": "pages/settings.tsx"
  },
  {
    "name": "getRuleSet",
    "kind": "function",
    "returnType": "RulePackage",
    "params": [
      {
        "name": "name",
        "type": "string"
      }
    ],
    "sourceFile": "index.ts",
    "relPath": "rules/index.ts"
  },
  {
    "name": "RulePackage",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "rules/index.ts"
  },
  {
    "name": "RulesRegistry",
    "kind": "const",
    "returnType": "Record<string, RulePackage>",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "rules/index.ts"
  },
  {
    "name": "openLocalDB",
    "kind": "function",
    "returnType": "Promise<IDBDatabase>",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "getBufferedLesson",
    "kind": "function",
    "returnType": "Promise<CachedLessonRecord>",
    "params": [
      {
        "name": "key",
        "type": "string"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "putBufferedLesson",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [
      {
        "name": "lesson",
        "type": "CachedLessonRecord"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "saveManifest",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [
      {
        "name": "manifest",
        "type": "DomainManifest"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "getManifest",
    "kind": "function",
    "returnType": "Promise<DomainManifest>",
    "params": [
      {
        "name": "domainId",
        "type": "string"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "logProgress",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [
      {
        "name": "record",
        "type": "StudentRecord"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "getTuringDiagnosticSummary",
    "kind": "function",
    "returnType": "Promise<{ accuracy: number; commonErrors: string[]; }>",
    "params": [
      {
        "name": "topicId",
        "type": "string"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "saveTopicAdapter",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [
      {
        "name": "adapter",
        "type": "TopicAdapterRecord"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "getTopicAdapter",
    "kind": "function",
    "returnType": "Promise<TopicAdapterRecord>",
    "params": [
      {
        "name": "topicKey",
        "type": "string"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "bootstrapTopicAdapters",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "saveVerifiedAST",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [
      {
        "name": "topicKey",
        "type": "string"
      },
      {
        "name": "rawAST",
        "type": "string"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "getBufferedQuestion",
    "kind": "function",
    "returnType": "Promise<string>",
    "params": [
      {
        "name": "topicKey",
        "type": "string"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "checkAndReplenishBuffer",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [
      {
        "name": "topicKey",
        "type": "string"
      },
      {
        "name": "minThreshold",
        "type": "number"
      },
      {
        "name": "triggerWorker",
        "type": "(key: string) => Promise<void>"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "getRandomCachedAST",
    "kind": "function",
    "returnType": "Promise<string>",
    "params": [
      {
        "name": "topicKey",
        "type": "string"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "saveVfsView",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [
      {
        "name": "path",
        "type": "string"
      },
      {
        "name": "content",
        "type": "string"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "getVfsView",
    "kind": "function",
    "returnType": "Promise<string>",
    "params": [
      {
        "name": "path",
        "type": "string"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "bootstrapVfsViews",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [
      {
        "name": "defaultViews",
        "type": "Record<string, string>"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "purgeInactiveManifests",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [
      {
        "name": "activeDomainId",
        "type": "string"
      },
      {
        "name": "preservedDomains",
        "type": "string[]"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "STORE_VIEWS",
    "kind": "const",
    "returnType": "\"vfs_views\"",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "StudentRecord",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "VfsViewRecord",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "TopicAdapterRecord",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "CachedASTRecord",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "CachedLessonRecord",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "getDB",
    "kind": "const",
    "returnType": "Promise<IDBDatabase>",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "DEFAULT_TOPIC_ADAPTERS",
    "kind": "const",
    "returnType": "TopicAdapterRecord[]",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "openJotterDB",
    "kind": "function",
    "returnType": "Promise<IDBDatabase>",
    "params": [],
    "sourceFile": "jotter-db.ts",
    "relPath": "services/jotter-db.ts"
  },
  {
    "name": "appendJotter",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [
      {
        "name": "entry",
        "type": "Omit<JotterEntry, \"timestamp\">"
      }
    ],
    "sourceFile": "jotter-db.ts",
    "relPath": "services/jotter-db.ts"
  },
  {
    "name": "getRecentJotterEntries",
    "kind": "function",
    "returnType": "Promise<JotterEntry[]>",
    "params": [
      {
        "name": "sessionId",
        "type": "string"
      },
      {
        "name": "limit",
        "type": "number"
      }
    ],
    "sourceFile": "jotter-db.ts",
    "relPath": "services/jotter-db.ts"
  },
  {
    "name": "JotterEntry",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "jotter-db.ts",
    "relPath": "services/jotter-db.ts"
  },
  {
    "name": "default",
    "kind": "function",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "theme/PwaReloadPopup/index.tsx"
  },
  {
    "name": "default",
    "kind": "function",
    "returnType": "React.JSX.Element",
    "params": [
      {
        "name": "__0",
        "type": "{ children: React.ReactNode; }"
      }
    ],
    "sourceFile": "root.tsx",
    "relPath": "theme/root.tsx"
  },
  {
    "name": "SemanticRule",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "learning-ast.ts",
    "relPath": "types/learning-ast.ts"
  },
  {
    "name": "Challenge",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "learning-ast.ts",
    "relPath": "types/learning-ast.ts"
  },
  {
    "name": "Cohort",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "learning-ast.ts",
    "relPath": "types/learning-ast.ts"
  },
  {
    "name": "TutorPersona",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "learning-ast.ts",
    "relPath": "types/learning-ast.ts"
  },
  {
    "name": "DomainManifest",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "learning-ast.ts",
    "relPath": "types/learning-ast.ts"
  },
  {
    "name": "LearningStream",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "learning-ast.ts",
    "relPath": "types/learning-ast.ts"
  },
  {
    "name": "CatalogItem",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "learning-ast.ts",
    "relPath": "types/learning-ast.ts"
  },
  {
    "name": "StreamCategory",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "learning-ast.ts",
    "relPath": "types/learning-ast.ts"
  },
  {
    "name": "MasterCatalog",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "learning-ast.ts",
    "relPath": "types/learning-ast.ts"
  },
  {
    "name": "SExprAtom",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "SExprNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "SExprAST",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "extractQuestionFromAst",
    "kind": "function",
    "returnType": "ExtractedQuestion",
    "params": [
      {
        "name": "rawLisp",
        "type": "string"
      }
    ],
    "sourceFile": "astQuestionExtractor.ts",
    "relPath": "utils/astQuestionExtractor.ts"
  },
  {
    "name": "ExtractedQuestion",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "astQuestionExtractor.ts",
    "relPath": "utils/astQuestionExtractor.ts"
  },
  {
    "name": "Channel",
    "kind": "class",
    "returnType": "typeof Channel",
    "params": [],
    "sourceFile": "channelBus.ts",
    "relPath": "utils/channelBus.ts"
  },
  {
    "name": "Channels",
    "kind": "const",
    "returnType": "{ UI_ACTIONS: Channel<{ action: string; payload: any; }>; AI_DIAGNOSTICS: Channel<{ studentId: string; challengeId: string; answer: string; isCorrect: boolean; }>; PROGRESS_LOG: Channel<...>; }",
    "params": [],
    "sourceFile": "channelBus.ts",
    "relPath": "utils/channelBus.ts"
  },
  {
    "name": "generateSessionReport",
    "kind": "function",
    "returnType": "Promise<SessionReportSummary>",
    "params": [
      {
        "name": "sessionId",
        "type": "string"
      }
    ],
    "sourceFile": "sessionReporter.ts",
    "relPath": "utils/sessionReporter.ts"
  },
  {
    "name": "downloadReportAsHtml",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "summary",
        "type": "SessionReportSummary"
      }
    ],
    "sourceFile": "sessionReporter.ts",
    "relPath": "utils/sessionReporter.ts"
  },
  {
    "name": "SessionReportSummary",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sessionReporter.ts",
    "relPath": "utils/sessionReporter.ts"
  },
  {
    "name": "parseSExpr",
    "kind": "function",
    "returnType": "SExprAST",
    "params": [
      {
        "name": "input",
        "type": "string"
      }
    ],
    "sourceFile": "sexprParser.ts",
    "relPath": "utils/sexprParser.ts"
  }
] as const;
