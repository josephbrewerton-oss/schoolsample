// Auto-generated Domain Substrate: SERVICES
export const SERVICES_AST_STRING = ";; Domain AST Manifest: services\n(:domain-substrate :services\n  (:symbol \"FOLDER_MANIFEST\" :from \"hooks/engine.ts\" :kind :const :return \"{ readonly folder: \"src/hooks\"; readonly timestamp: 1787937755214; readonly totalModules: 4; readonly exports: readonly [{ readonly name: \"HOOKS_MANIFEST\"; readonly isType: false; readonly sourceFile: \"hookengine\"; }, ... 4 more ..., { ...; }]; }\" :params ())\n  (:symbol \"FolderExportNames\" :from \"hooks/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"HOOKS_MANIFEST\" :from \"hooks/engine.ts\" :kind :const :return \"{ readonly folder: \"src/hooks\"; readonly timestamp: number; readonly capabilities: readonly [{ readonly name: \"useCurriculumStandard\"; readonly type: \"state-syncer\"; readonly description: \"Cross-tab local storage state for UK Oak vs International\"; }, { ...; }, { ...; }]; }\" :params ())\n  (:symbol \"useCurriculumStandard\" :from \"hooks/engine.ts\" :kind :function :return \"[CurriculumProviderKey, (val: CurriculumProviderKey) => void]\" :params ())\n  (:symbol \"useKnowledgeStage\" :from \"hooks/engine.ts\" :kind :function :return \"{ activeProps: Record<string, any>; isReady: boolean; }\" :params ((:param \"keyStage\" :type \"string\") (:param \"subject\" :type \"string\") (:param \"fallbackRegistry\" :type \"any\")))\n  (:symbol \"StagePayload\" :from \"hooks/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"useWebRTCNeuralBus\" :from \"hooks/engine.ts\" :kind :function :return \"{ isReady: boolean; status: string; instanceState: GuestVMState; metrics: HypervisorMetrics; sendIntent: (keyStage: string, subject: string, unit: string, ksId?: string, subId?: string, unitId?: string, curriculum?: string) => Promise<...>; resetInstance: () => void; reconnect: (reason?: string) => void; }\" :params ((:param \"onQuestionReady\" :type \"(payload: QuestionPayload) => void\") (:param \"onTokenChunk\" :type \"(chunk: string) => void\")))\n  (:symbol \"QuestionPayload\" :from \"hooks/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"HOOKS_MANIFEST\" :from \"hooks/hookengine.ts\" :kind :const :return \"{ readonly folder: \"src/hooks\"; readonly timestamp: number; readonly capabilities: readonly [{ readonly name: \"useCurriculumStandard\"; readonly type: \"state-syncer\"; readonly description: \"Cross-tab local storage state for UK Oak vs International\"; }, { ...; }, { ...; }]; }\" :params ())\n  (:symbol \"useCurriculumStandard\" :from \"hooks/hookengine.ts\" :kind :function :return \"[CurriculumProviderKey, (val: CurriculumProviderKey) => void]\" :params ())\n  (:symbol \"useKnowledgeStage\" :from \"hooks/hookengine.ts\" :kind :function :return \"{ activeProps: Record<string, any>; isReady: boolean; }\" :params ((:param \"keyStage\" :type \"string\") (:param \"subject\" :type \"string\") (:param \"fallbackRegistry\" :type \"any\")))\n  (:symbol \"StagePayload\" :from \"hooks/hookengine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"useWebRTCNeuralBus\" :from \"hooks/hookengine.ts\" :kind :function :return \"{ isReady: boolean; status: string; instanceState: GuestVMState; metrics: HypervisorMetrics; sendIntent: (keyStage: string, subject: string, unit: string, ksId?: string, subId?: string, unitId?: string, curriculum?: string) => Promise<...>; resetInstance: () => void; reconnect: (reason?: string) => void; }\" :params ((:param \"onQuestionReady\" :type \"(payload: QuestionPayload) => void\") (:param \"onTokenChunk\" :type \"(chunk: string) => void\")))\n  (:symbol \"QuestionPayload\" :from \"hooks/hookengine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"useCurriculumStandard\" :from \"hooks/useCurriculumStandard.ts\" :kind :function :return \"[CurriculumProviderKey, (val: CurriculumProviderKey) => void]\" :params ())\n  (:symbol \"useKnowledgeStage\" :from \"hooks/useKnowledgeStage.ts\" :kind :function :return \"{ activeProps: Record<string, any>; isReady: boolean; }\" :params ((:param \"keyStage\" :type \"string\") (:param \"subject\" :type \"string\") (:param \"fallbackRegistry\" :type \"any\")))\n  (:symbol \"StagePayload\" :from \"hooks/useKnowledgeStage.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"usePWAInstall\" :from \"hooks/usePWAInstall.ts\" :kind :function :return \"{ isInstallable: boolean; isInstalled: boolean; isIOS: boolean; install: () => Promise<boolean>; }\" :params ())\n  (:symbol \"useWebRTCNeuralBus\" :from \"hooks/useWebRTCNeuralBus.ts\" :kind :function :return \"{ isReady: boolean; status: string; instanceState: GuestVMState; metrics: HypervisorMetrics; sendIntent: (keyStage: string, subject: string, unit: string, ksId?: string, subId?: string, unitId?: string, curriculum?: string) => Promise<...>; resetInstance: () => void; reconnect: (reason?: string) => void; }\" :params ((:param \"onQuestionReady\" :type \"(payload: QuestionPayload) => void\") (:param \"onTokenChunk\" :type \"(chunk: string) => void\")))\n  (:symbol \"QuestionPayload\" :from \"hooks/useWebRTCNeuralBus.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"initCurriculumDB\" :from \"lib/browser-rag.ts\" :kind :function :return \"Promise<IDBDatabase>\" :params ())\n  (:symbol \"syncCurriculumIndex\" :from \"lib/browser-rag.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"db\" :type \"IDBDatabase\")))\n  (:symbol \"searchCurriculum\" :from \"lib/browser-rag.ts\" :kind :function :return \"Promise<RAGMatch[]>\" :params ((:param \"db\" :type \"IDBDatabase\") (:param \"query\" :type \"string\") (:param \"topK\" :type \"number\")))\n  (:symbol \"getLessonManifest\" :from \"lib/browser-rag.ts\" :kind :function :return \"Promise<any>\" :params ((:param \"db\" :type \"IDBDatabase\") (:param \"id\" :type \"string\") (:param \"manifestPath\" :type \"string\")))\n  (:symbol \"RAGMatch\" :from \"lib/browser-rag.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"FOLDER_MANIFEST\" :from \"lib/engine.ts\" :kind :const :return \"{ readonly folder: \"src/lib\"; readonly timestamp: 1787937755144; readonly totalModules: 1; readonly exports: readonly [{ readonly name: \"RAGMatch\"; readonly isType: true; readonly sourceFile: \"browser-rag\"; }, { ...; }, { ...; }, { ...; }, { ...; }]; }\" :params ())\n  (:symbol \"FolderExportNames\" :from \"lib/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"initCurriculumDB\" :from \"lib/engine.ts\" :kind :function :return \"Promise<IDBDatabase>\" :params ())\n  (:symbol \"syncCurriculumIndex\" :from \"lib/engine.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"db\" :type \"IDBDatabase\")))\n  (:symbol \"searchCurriculum\" :from \"lib/engine.ts\" :kind :function :return \"Promise<RAGMatch[]>\" :params ((:param \"db\" :type \"IDBDatabase\") (:param \"query\" :type \"string\") (:param \"topK\" :type \"number\")))\n  (:symbol \"getLessonManifest\" :from \"lib/engine.ts\" :kind :function :return \"Promise<any>\" :params ((:param \"db\" :type \"IDBDatabase\") (:param \"id\" :type \"string\") (:param \"manifestPath\" :type \"string\")))\n  (:symbol \"RAGMatch\" :from \"lib/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"resolveChallengeForTopic\" :from \"services/challengeLauncher.ts\" :kind :function :return \"ChallengeMetadata\" :params ((:param \"subject\" :type \"string\") (:param \"unit\" :type \"string\") (:param \"topic\" :type \"string\") (:param \"keyStage\" :type \"string\")))\n  (:symbol \"openChallengeModal\" :from \"services/challengeLauncher.ts\" :kind :function :return \"void\" :params ((:param \"options\" :type \"ChallengeCallOptions\")))\n  (:symbol \"closeChallengeModal\" :from \"services/challengeLauncher.ts\" :kind :function :return \"void\" :params ())\n  (:symbol \"subscribeToChallengeCalls\" :from \"services/challengeLauncher.ts\" :kind :function :return \"() => void\" :params ((:param \"listener\" :type \"ChallengeListener\")))\n  (:symbol \"ChallengeType\" :from \"services/challengeLauncher.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ChallengeMetadata\" :from \"services/challengeLauncher.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ChallengeCallOptions\" :from \"services/challengeLauncher.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"validateStudentInput\" :from \"services/childSafetyFilter.ts\" :kind :function :return \"SafetyCheckResult\" :params ((:param \"input\" :type \"string\")))\n  (:symbol \"sanitizeAiOutput\" :from \"services/childSafetyFilter.ts\" :kind :function :return \"string\" :params ((:param \"output\" :type \"string\") (:param \"fallbackContext\" :type \"string\")))\n  (:symbol \"SafetyCheckResult\" :from \"services/childSafetyFilter.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CHILD_SAFEGUARDING_SYSTEM_PROMPT\" :from \"services/childSafetyFilter.ts\" :kind :const :return \"\"\\nCRITICAL CHILD SAFEGUARDING & SAFETY MANDATE:\\n1. You are speaking directly to primary or secondary school children (ages 5 to 16).\\n2. You MUST always maintain a warm, gentle, encouraging, and 100% wholesome tone.\\n3. NEVER produce or discuss: violence, weapons, adult content, profanity, drugs, romantic relation...\" :params ())\n  (:symbol \"StudentBeaconTelemetry\" :from \"services/classroomBeacon.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"TeacherBroadcastCommand\" :from \"services/classroomBeacon.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"classroomBeacon\" :from \"services/classroomBeacon.ts\" :kind :const :return \"ClassroomBeaconManager\" :params ())\n  (:symbol \"default\" :from \"services/classroomBeacon.ts\" :kind :const :return \"ClassroomBeaconManager\" :params ())\n  (:symbol \"getInstalledCurriculumPacks\" :from \"services/curriculumPackStore.ts\" :kind :function :return \"CustomCurriculumPack[]\" :params ())\n  (:symbol \"saveCurriculumPack\" :from \"services/curriculumPackStore.ts\" :kind :function :return \"void\" :params ((:param \"pack\" :type \"CustomCurriculumPack\")))\n  (:symbol \"removeCurriculumPack\" :from \"services/curriculumPackStore.ts\" :kind :function :return \"void\" :params ((:param \"packId\" :type \"string\")))\n  (:symbol \"findCustomTopicKnowledge\" :from \"services/curriculumPackStore.ts\" :kind :function :return \"CurriculumTopicKnowledge\" :params ((:param \"stage\" :type \"string\") (:param \"subject\" :type \"string\") (:param \"topic\" :type \"string\")))\n  (:symbol \"saveAxiomAnchorTopic\" :from \"services/curriculumPackStore.ts\" :kind :function :return \"CustomCurriculumPack\" :params ((:param \"data\" :type \"{ keyStage: string; subject: string; topic: string; axiom: string; trap: string; hook?: string; guidedStep?: string; socraticPivot?: string; questions?: CustomQuestionItem[]; }\")))\n  (:symbol \"deleteAxiomAnchorTopic\" :from \"services/curriculumPackStore.ts\" :kind :function :return \"void\" :params ((:param \"lessonId\" :type \"string\")))\n  (:symbol \"getCustomStandardStages\" :from \"services/curriculumPackStore.ts\" :kind :function :return \"Record<string, StandardStage>\" :params ())\n  (:symbol \"generateSampleCsvTemplate\" :from \"services/curriculumPackStore.ts\" :kind :function :return \"string\" :params ())\n  (:symbol \"generateSampleJsonTemplate\" :from \"services/curriculumPackStore.ts\" :kind :function :return \"string\" :params ())\n  (:symbol \"parseCsvToCurriculumPack\" :from \"services/curriculumPackStore.ts\" :kind :function :return \"CustomCurriculumPack\" :params ((:param \"csvContent\" :type \"string\") (:param \"metadata\" :type \"{ packId?: string; packTitle?: string; countryOrRegion?: string; authorOrMinistry?: string; description?: string; }\")))\n  (:symbol \"CustomQuestionDistractor\" :from \"services/curriculumPackStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CustomQuestionItem\" :from \"services/curriculumPackStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CustomCurriculumLesson\" :from \"services/curriculumPackStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CustomCurriculumPack\" :from \"services/curriculumPackStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"PRESET_OVERSEAS_PACKS\" :from \"services/curriculumPackStore.ts\" :kind :const :return \"CustomCurriculumPack[]\" :params ())\n  (:symbol \"isDataSaverActive\" :from \"services/dataSaverStore.ts\" :kind :function :return \"boolean\" :params ())\n  (:symbol \"setDataSaverMode\" :from \"services/dataSaverStore.ts\" :kind :function :return \"void\" :params ((:param \"enabled\" :type \"boolean\")))\n  (:symbol \"applyDataSaverToDOM\" :from \"services/dataSaverStore.ts\" :kind :function :return \"void\" :params ((:param \"enabled\" :type \"boolean\")))\n  (:symbol \"listenToDataSaverChanges\" :from \"services/dataSaverStore.ts\" :kind :function :return \"() => void\" :params ((:param \"callback\" :type \"(enabled: boolean) => void\")))\n  (:symbol \"isConstrainedEnvironment\" :from \"services/dataSaverStore.ts\" :kind :function :return \"boolean\" :params ())\n  (:symbol \"isCoreSyllabusPinned\" :from \"services/dbStore.ts\" :kind :function :return \"boolean\" :params ((:param \"keyOrDomain\" :type \"string\")))\n  (:symbol \"openLocalDB\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<IDBDatabase>\" :params ())\n  (:symbol \"getBufferedLesson\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<CachedLessonRecord>\" :params ((:param \"key\" :type \"string\")))\n  (:symbol \"putBufferedLesson\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"lesson\" :type \"CachedLessonRecord\")))\n  (:symbol \"saveManifest\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"manifest\" :type \"DomainManifest\")))\n  (:symbol \"getManifest\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<DomainManifest>\" :params ((:param \"domainId\" :type \"string\")))\n  (:symbol \"logProgress\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"record\" :type \"StudentRecord\")))\n  (:symbol \"getAllProgressRecords\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<StudentRecord[]>\" :params ())\n  (:symbol \"clearAllStudentProgress\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ())\n  (:symbol \"getTuringDiagnosticSummary\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<{ accuracy: number; commonErrors: string[]; }>\" :params ((:param \"topicId\" :type \"string\")))\n  (:symbol \"saveTopicAdapter\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"adapter\" :type \"TopicAdapterRecord\")))\n  (:symbol \"getTopicAdapter\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<TopicAdapterRecord>\" :params ((:param \"topicKey\" :type \"string\")))\n  (:symbol \"bootstrapTopicAdapters\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ())\n  (:symbol \"saveVerifiedAST\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"topicKey\" :type \"string\") (:param \"rawAST\" :type \"string\")))\n  (:symbol \"getBufferedQuestion\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<string>\" :params ((:param \"topicKey\" :type \"string\") (:param \"excludePrompt\" :type \"string\")))\n  (:symbol \"checkAndReplenishBuffer\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"topicKey\" :type \"string\") (:param \"minThreshold\" :type \"number\") (:param \"triggerWorker\" :type \"(key: string) => Promise<void>\")))\n  (:symbol \"getRandomCachedAST\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<string>\" :params ((:param \"topicKey\" :type \"string\")))\n  (:symbol \"saveVfsView\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"path\" :type \"string\") (:param \"content\" :type \"string\")))\n  (:symbol \"getVfsView\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<string>\" :params ((:param \"path\" :type \"string\")))\n  (:symbol \"bootstrapVfsViews\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"defaultViews\" :type \"Record<string, string>\")))\n  (:symbol \"enforceStorageQuotaLRU\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<StorageQuotaLRUMetrics>\" :params ())\n  (:symbol \"getStorageQuotaMetrics\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<StorageQuotaLRUMetrics>\" :params ())\n  (:symbol \"purgeInactiveManifests\" :from \"services/dbStore.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"activeDomainId\" :type \"string\") (:param \"preservedDomains\" :type \"string[]\")))\n  (:symbol \"STORE_VIEWS\" :from \"services/dbStore.ts\" :kind :const :return \"\"vfs_views\"\" :params ())\n  (:symbol \"StudentRecord\" :from \"services/dbStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"VfsViewRecord\" :from \"services/dbStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"TopicAdapterRecord\" :from \"services/dbStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CachedASTRecord\" :from \"services/dbStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CachedLessonRecord\" :from \"services/dbStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"PINNED_CORE_MANIFESTS\" :from \"services/dbStore.ts\" :kind :const :return \"Set<string>\" :params ())\n  (:symbol \"getDB\" :from \"services/dbStore.ts\" :kind :const :return \"Promise<IDBDatabase>\" :params ())\n  (:symbol \"DEFAULT_TOPIC_ADAPTERS\" :from \"services/dbStore.ts\" :kind :const :return \"TopicAdapterRecord[]\" :params ())\n  (:symbol \"StorageQuotaLRUMetrics\" :from \"services/dbStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"MAX_UNPINNED_LESSON_TRACES\" :from \"services/dbStore.ts\" :kind :const :return \"35\" :params ())\n  (:symbol \"TARGET_UNPINNED_LESSON_TRACES\" :from \"services/dbStore.ts\" :kind :const :return \"25\" :params ())\n  (:symbol \"MAX_UNPINNED_AST_ITEMS\" :from \"services/dbStore.ts\" :kind :const :return \"60\" :params ())\n  (:symbol \"TARGET_UNPINNED_AST_ITEMS\" :from \"services/dbStore.ts\" :kind :const :return \"40\" :params ())\n  (:symbol \"openJotterDB\" :from \"services/jotter-db.ts\" :kind :function :return \"Promise<IDBDatabase>\" :params ())\n  (:symbol \"appendJotter\" :from \"services/jotter-db.ts\" :kind :function :return \"Promise<void>\" :params ((:param \"entry\" :type \"Omit<JotterEntry, \"timestamp\">\")))\n  (:symbol \"getRecentJotterEntries\" :from \"services/jotter-db.ts\" :kind :function :return \"Promise<JotterEntry[]>\" :params ((:param \"sessionId\" :type \"string\") (:param \"limit\" :type \"number\")))\n  (:symbol \"clearJotterDB\" :from \"services/jotter-db.ts\" :kind :function :return \"Promise<void>\" :params ())\n  (:symbol \"JotterEntry\" :from \"services/jotter-db.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"getActiveManifestCacheName\" :from \"services/offlineSync.ts\" :kind :function :return \"Promise<string>\" :params ())\n  (:symbol \"isOfflineSyncComplete\" :from \"services/offlineSync.ts\" :kind :function :return \"boolean\" :params ())\n  (:symbol \"getOfflineSyncDate\" :from \"services/offlineSync.ts\" :kind :function :return \"string\" :params ())\n  (:symbol \"checkDeviceStorageSupport\" :from \"services/offlineSync.ts\" :kind :function :return \"Promise<{ supported: boolean; persisted: boolean; quotaMb?: number; usageMb?: number; }>\" :params ())\n  (:symbol \"syncEntireCurriculumOffline\" :from \"services/offlineSync.ts\" :kind :function :return \"Promise<boolean>\" :params ((:param \"onProgress\" :type \"(progress: SyncProgress) => void\")))\n  (:symbol \"CORE_OFFLINE_URLS\" :from \"services/offlineSync.ts\" :kind :const :return \"string[]\" :params ())\n  (:symbol \"SyncProgress\" :from \"services/offlineSync.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"getOfflineStatus\" :from \"services/offlineSyncService.ts\" :kind :function :return \"Promise<OfflineStatus>\" :params ())\n  (:symbol \"downloadCurriculumForOffline\" :from \"services/offlineSyncService.ts\" :kind :function :return \"Promise<{ success: boolean; count: number; error?: string; }>\" :params ((:param \"onProgress\" :type \"(progress: SyncProgress) => void\")))\n  (:symbol \"SyncProgress\" :from \"services/offlineSyncService.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OfflineStatus\" :from \"services/offlineSyncService.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"resolvePresetForTopic\" :from \"services/playerLauncher.ts\" :kind :function :return \"VectorPresetId\" :params ((:param \"subject\" :type \"string\") (:param \"unit\" :type \"string\") (:param \"topic\" :type \"string\")))\n  (:symbol \"openPlayerModal\" :from \"services/playerLauncher.ts\" :kind :function :return \"void\" :params ((:param \"options\" :type \"PlayerCallOptions\")))\n  (:symbol \"closePlayerModal\" :from \"services/playerLauncher.ts\" :kind :function :return \"void\" :params ())\n  (:symbol \"subscribeToPlayerCalls\" :from \"services/playerLauncher.ts\" :kind :function :return \"() => void\" :params ((:param \"listener\" :type \"PlayerListener\")))\n  (:symbol \"VectorPresetId\" :from \"services/playerLauncher.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"PlayerCallOptions\" :from \"services/playerLauncher.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"isStrictAirGapMode\" :from \"services/privacyGuard.ts\" :kind :function :return \"boolean\" :params ())\n  (:symbol \"setStrictAirGapMode\" :from \"services/privacyGuard.ts\" :kind :function :return \"void\" :params ((:param \"enabled\" :type \"boolean\")))\n  (:symbol \"listenToAirGapChanges\" :from \"services/privacyGuard.ts\" :kind :function :return \"() => void\" :params ((:param \"callback\" :type \"(enabled: boolean) => void\")))\n  (:symbol \"isSoundEnabled\" :from \"services/soundHaptics.ts\" :kind :function :return \"boolean\" :params ())\n  (:symbol \"setSoundEnabled\" :from \"services/soundHaptics.ts\" :kind :function :return \"void\" :params ((:param \"enabled\" :type \"boolean\")))\n  (:symbol \"isHapticsEnabled\" :from \"services/soundHaptics.ts\" :kind :function :return \"boolean\" :params ())\n  (:symbol \"setHapticsEnabled\" :from \"services/soundHaptics.ts\" :kind :function :return \"void\" :params ((:param \"enabled\" :type \"boolean\")))\n  (:symbol \"playSuccessChime\" :from \"services/soundHaptics.ts\" :kind :function :return \"void\" :params ())\n  (:symbol \"playIncorrectTone\" :from \"services/soundHaptics.ts\" :kind :function :return \"void\" :params ())\n  (:symbol \"playClickTone\" :from \"services/soundHaptics.ts\" :kind :function :return \"void\" :params ())\n  (:symbol \"playCelebrationFanfare\" :from \"services/soundHaptics.ts\" :kind :function :return \"void\" :params ())\n  (:symbol \"triggerHapticSuccess\" :from \"services/soundHaptics.ts\" :kind :function :return \"void\" :params ())\n  (:symbol \"triggerHapticError\" :from \"services/soundHaptics.ts\" :kind :function :return \"void\" :params ())\n  (:symbol \"triggerHapticClick\" :from \"services/soundHaptics.ts\" :kind :function :return \"void\" :params ())\n  (:symbol \"generateRandomAlias\" :from \"services/studentProfileStore.ts\" :kind :function :return \"{ alias: string; avatar: string; }\" :params ())\n  (:symbol \"getLearnerProfile\" :from \"services/studentProfileStore.ts\" :kind :function :return \"LearnerProfile\" :params ())\n  (:symbol \"saveLearnerProfile\" :from \"services/studentProfileStore.ts\" :kind :function :return \"LearnerProfile\" :params ((:param \"updates\" :type \"Partial<LearnerProfile>\")))\n  (:symbol \"formatTopicTitle\" :from \"services/studentProfileStore.ts\" :kind :function :return \"string\" :params ((:param \"rawTopicId\" :type \"string\")))\n  (:symbol \"getLearnerAnalytics\" :from \"services/studentProfileStore.ts\" :kind :function :return \"Promise<LearnerAnalytics>\" :params ())\n  (:symbol \"purgeAllLearnerData\" :from \"services/studentProfileStore.ts\" :kind :function :return \"Promise<void>\" :params ())\n  (:symbol \"exportLearnerPassportJson\" :from \"services/studentProfileStore.ts\" :kind :function :return \"Promise<void>\" :params ())\n  (:symbol \"downloadLearnerCertificateHtml\" :from \"services/studentProfileStore.ts\" :kind :function :return \"Promise<void>\" :params ())\n  (:symbol \"LearnerProfile\" :from \"services/studentProfileStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"TopicMasteryStat\" :from \"services/studentProfileStore.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LearnerAnalytics\" :from \"services/studentProfileStore.ts\" :kind :const :return \"any\" :params ())\n)\n";
export const SERVICES_EXPORT_CATALOG = [
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
    "name": "useWebRTCNeuralBus",
    "kind": "function",
    "returnType": "{ isReady: boolean; status: string; instanceState: GuestVMState; metrics: HypervisorMetrics; sendIntent: (keyStage: string, subject: string, unit: string, ksId?: string, subId?: string, unitId?: string, curriculum?: string) => Promise<...>; resetInstance: () => void; reconnect: (reason?: string) => void; }",
    "params": [
      {
        "name": "onQuestionReady",
        "type": "(payload: QuestionPayload) => void"
      },
      {
        "name": "onTokenChunk",
        "type": "(chunk: string) => void"
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
    "sourceFile": "hookengine.ts",
    "relPath": "hooks/hookengine.ts"
  },
  {
    "name": "StagePayload",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "hookengine.ts",
    "relPath": "hooks/hookengine.ts"
  },
  {
    "name": "useWebRTCNeuralBus",
    "kind": "function",
    "returnType": "{ isReady: boolean; status: string; instanceState: GuestVMState; metrics: HypervisorMetrics; sendIntent: (keyStage: string, subject: string, unit: string, ksId?: string, subId?: string, unitId?: string, curriculum?: string) => Promise<...>; resetInstance: () => void; reconnect: (reason?: string) => void; }",
    "params": [
      {
        "name": "onQuestionReady",
        "type": "(payload: QuestionPayload) => void"
      },
      {
        "name": "onTokenChunk",
        "type": "(chunk: string) => void"
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
    "sourceFile": "useKnowledgeStage.ts",
    "relPath": "hooks/useKnowledgeStage.ts"
  },
  {
    "name": "StagePayload",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "useKnowledgeStage.ts",
    "relPath": "hooks/useKnowledgeStage.ts"
  },
  {
    "name": "usePWAInstall",
    "kind": "function",
    "returnType": "{ isInstallable: boolean; isInstalled: boolean; isIOS: boolean; install: () => Promise<boolean>; }",
    "params": [],
    "sourceFile": "usePWAInstall.ts",
    "relPath": "hooks/usePWAInstall.ts"
  },
  {
    "name": "useWebRTCNeuralBus",
    "kind": "function",
    "returnType": "{ isReady: boolean; status: string; instanceState: GuestVMState; metrics: HypervisorMetrics; sendIntent: (keyStage: string, subject: string, unit: string, ksId?: string, subId?: string, unitId?: string, curriculum?: string) => Promise<...>; resetInstance: () => void; reconnect: (reason?: string) => void; }",
    "params": [
      {
        "name": "onQuestionReady",
        "type": "(payload: QuestionPayload) => void"
      },
      {
        "name": "onTokenChunk",
        "type": "(chunk: string) => void"
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
    "name": "resolveChallengeForTopic",
    "kind": "function",
    "returnType": "ChallengeMetadata",
    "params": [
      {
        "name": "subject",
        "type": "string"
      },
      {
        "name": "unit",
        "type": "string"
      },
      {
        "name": "topic",
        "type": "string"
      },
      {
        "name": "keyStage",
        "type": "string"
      }
    ],
    "sourceFile": "challengeLauncher.ts",
    "relPath": "services/challengeLauncher.ts"
  },
  {
    "name": "openChallengeModal",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "options",
        "type": "ChallengeCallOptions"
      }
    ],
    "sourceFile": "challengeLauncher.ts",
    "relPath": "services/challengeLauncher.ts"
  },
  {
    "name": "closeChallengeModal",
    "kind": "function",
    "returnType": "void",
    "params": [],
    "sourceFile": "challengeLauncher.ts",
    "relPath": "services/challengeLauncher.ts"
  },
  {
    "name": "subscribeToChallengeCalls",
    "kind": "function",
    "returnType": "() => void",
    "params": [
      {
        "name": "listener",
        "type": "ChallengeListener"
      }
    ],
    "sourceFile": "challengeLauncher.ts",
    "relPath": "services/challengeLauncher.ts"
  },
  {
    "name": "ChallengeType",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "challengeLauncher.ts",
    "relPath": "services/challengeLauncher.ts"
  },
  {
    "name": "ChallengeMetadata",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "challengeLauncher.ts",
    "relPath": "services/challengeLauncher.ts"
  },
  {
    "name": "ChallengeCallOptions",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "challengeLauncher.ts",
    "relPath": "services/challengeLauncher.ts"
  },
  {
    "name": "validateStudentInput",
    "kind": "function",
    "returnType": "SafetyCheckResult",
    "params": [
      {
        "name": "input",
        "type": "string"
      }
    ],
    "sourceFile": "childSafetyFilter.ts",
    "relPath": "services/childSafetyFilter.ts"
  },
  {
    "name": "sanitizeAiOutput",
    "kind": "function",
    "returnType": "string",
    "params": [
      {
        "name": "output",
        "type": "string"
      },
      {
        "name": "fallbackContext",
        "type": "string"
      }
    ],
    "sourceFile": "childSafetyFilter.ts",
    "relPath": "services/childSafetyFilter.ts"
  },
  {
    "name": "SafetyCheckResult",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "childSafetyFilter.ts",
    "relPath": "services/childSafetyFilter.ts"
  },
  {
    "name": "CHILD_SAFEGUARDING_SYSTEM_PROMPT",
    "kind": "const",
    "returnType": "\"\\nCRITICAL CHILD SAFEGUARDING & SAFETY MANDATE:\\n1. You are speaking directly to primary or secondary school children (ages 5 to 16).\\n2. You MUST always maintain a warm, gentle, encouraging, and 100% wholesome tone.\\n3. NEVER produce or discuss: violence, weapons, adult content, profanity, drugs, romantic relation...",
    "params": [],
    "sourceFile": "childSafetyFilter.ts",
    "relPath": "services/childSafetyFilter.ts"
  },
  {
    "name": "StudentBeaconTelemetry",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "classroomBeacon.ts",
    "relPath": "services/classroomBeacon.ts"
  },
  {
    "name": "TeacherBroadcastCommand",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "classroomBeacon.ts",
    "relPath": "services/classroomBeacon.ts"
  },
  {
    "name": "classroomBeacon",
    "kind": "const",
    "returnType": "ClassroomBeaconManager",
    "params": [],
    "sourceFile": "classroomBeacon.ts",
    "relPath": "services/classroomBeacon.ts"
  },
  {
    "name": "default",
    "kind": "const",
    "returnType": "ClassroomBeaconManager",
    "params": [],
    "sourceFile": "classroomBeacon.ts",
    "relPath": "services/classroomBeacon.ts"
  },
  {
    "name": "getInstalledCurriculumPacks",
    "kind": "function",
    "returnType": "CustomCurriculumPack[]",
    "params": [],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "saveCurriculumPack",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "pack",
        "type": "CustomCurriculumPack"
      }
    ],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "removeCurriculumPack",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "packId",
        "type": "string"
      }
    ],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "findCustomTopicKnowledge",
    "kind": "function",
    "returnType": "CurriculumTopicKnowledge",
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
      }
    ],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "saveAxiomAnchorTopic",
    "kind": "function",
    "returnType": "CustomCurriculumPack",
    "params": [
      {
        "name": "data",
        "type": "{ keyStage: string; subject: string; topic: string; axiom: string; trap: string; hook?: string; guidedStep?: string; socraticPivot?: string; questions?: CustomQuestionItem[]; }"
      }
    ],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "deleteAxiomAnchorTopic",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "lessonId",
        "type": "string"
      }
    ],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "getCustomStandardStages",
    "kind": "function",
    "returnType": "Record<string, StandardStage>",
    "params": [],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "generateSampleCsvTemplate",
    "kind": "function",
    "returnType": "string",
    "params": [],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "generateSampleJsonTemplate",
    "kind": "function",
    "returnType": "string",
    "params": [],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "parseCsvToCurriculumPack",
    "kind": "function",
    "returnType": "CustomCurriculumPack",
    "params": [
      {
        "name": "csvContent",
        "type": "string"
      },
      {
        "name": "metadata",
        "type": "{ packId?: string; packTitle?: string; countryOrRegion?: string; authorOrMinistry?: string; description?: string; }"
      }
    ],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "CustomQuestionDistractor",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "CustomQuestionItem",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "CustomCurriculumLesson",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "CustomCurriculumPack",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "PRESET_OVERSEAS_PACKS",
    "kind": "const",
    "returnType": "CustomCurriculumPack[]",
    "params": [],
    "sourceFile": "curriculumPackStore.ts",
    "relPath": "services/curriculumPackStore.ts"
  },
  {
    "name": "isDataSaverActive",
    "kind": "function",
    "returnType": "boolean",
    "params": [],
    "sourceFile": "dataSaverStore.ts",
    "relPath": "services/dataSaverStore.ts"
  },
  {
    "name": "setDataSaverMode",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "enabled",
        "type": "boolean"
      }
    ],
    "sourceFile": "dataSaverStore.ts",
    "relPath": "services/dataSaverStore.ts"
  },
  {
    "name": "applyDataSaverToDOM",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "enabled",
        "type": "boolean"
      }
    ],
    "sourceFile": "dataSaverStore.ts",
    "relPath": "services/dataSaverStore.ts"
  },
  {
    "name": "listenToDataSaverChanges",
    "kind": "function",
    "returnType": "() => void",
    "params": [
      {
        "name": "callback",
        "type": "(enabled: boolean) => void"
      }
    ],
    "sourceFile": "dataSaverStore.ts",
    "relPath": "services/dataSaverStore.ts"
  },
  {
    "name": "isConstrainedEnvironment",
    "kind": "function",
    "returnType": "boolean",
    "params": [],
    "sourceFile": "dataSaverStore.ts",
    "relPath": "services/dataSaverStore.ts"
  },
  {
    "name": "isCoreSyllabusPinned",
    "kind": "function",
    "returnType": "boolean",
    "params": [
      {
        "name": "keyOrDomain",
        "type": "string"
      }
    ],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
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
    "name": "getAllProgressRecords",
    "kind": "function",
    "returnType": "Promise<StudentRecord[]>",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "clearAllStudentProgress",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [],
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
      },
      {
        "name": "excludePrompt",
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
    "name": "enforceStorageQuotaLRU",
    "kind": "function",
    "returnType": "Promise<StorageQuotaLRUMetrics>",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "getStorageQuotaMetrics",
    "kind": "function",
    "returnType": "Promise<StorageQuotaLRUMetrics>",
    "params": [],
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
    "name": "PINNED_CORE_MANIFESTS",
    "kind": "const",
    "returnType": "Set<string>",
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
    "name": "StorageQuotaLRUMetrics",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "MAX_UNPINNED_LESSON_TRACES",
    "kind": "const",
    "returnType": "35",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "TARGET_UNPINNED_LESSON_TRACES",
    "kind": "const",
    "returnType": "25",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "MAX_UNPINNED_AST_ITEMS",
    "kind": "const",
    "returnType": "60",
    "params": [],
    "sourceFile": "dbStore.ts",
    "relPath": "services/dbStore.ts"
  },
  {
    "name": "TARGET_UNPINNED_AST_ITEMS",
    "kind": "const",
    "returnType": "40",
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
    "name": "clearJotterDB",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [],
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
    "name": "getActiveManifestCacheName",
    "kind": "function",
    "returnType": "Promise<string>",
    "params": [],
    "sourceFile": "offlineSync.ts",
    "relPath": "services/offlineSync.ts"
  },
  {
    "name": "isOfflineSyncComplete",
    "kind": "function",
    "returnType": "boolean",
    "params": [],
    "sourceFile": "offlineSync.ts",
    "relPath": "services/offlineSync.ts"
  },
  {
    "name": "getOfflineSyncDate",
    "kind": "function",
    "returnType": "string",
    "params": [],
    "sourceFile": "offlineSync.ts",
    "relPath": "services/offlineSync.ts"
  },
  {
    "name": "checkDeviceStorageSupport",
    "kind": "function",
    "returnType": "Promise<{ supported: boolean; persisted: boolean; quotaMb?: number; usageMb?: number; }>",
    "params": [],
    "sourceFile": "offlineSync.ts",
    "relPath": "services/offlineSync.ts"
  },
  {
    "name": "syncEntireCurriculumOffline",
    "kind": "function",
    "returnType": "Promise<boolean>",
    "params": [
      {
        "name": "onProgress",
        "type": "(progress: SyncProgress) => void"
      }
    ],
    "sourceFile": "offlineSync.ts",
    "relPath": "services/offlineSync.ts"
  },
  {
    "name": "CORE_OFFLINE_URLS",
    "kind": "const",
    "returnType": "string[]",
    "params": [],
    "sourceFile": "offlineSync.ts",
    "relPath": "services/offlineSync.ts"
  },
  {
    "name": "SyncProgress",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "offlineSync.ts",
    "relPath": "services/offlineSync.ts"
  },
  {
    "name": "getOfflineStatus",
    "kind": "function",
    "returnType": "Promise<OfflineStatus>",
    "params": [],
    "sourceFile": "offlineSyncService.ts",
    "relPath": "services/offlineSyncService.ts"
  },
  {
    "name": "downloadCurriculumForOffline",
    "kind": "function",
    "returnType": "Promise<{ success: boolean; count: number; error?: string; }>",
    "params": [
      {
        "name": "onProgress",
        "type": "(progress: SyncProgress) => void"
      }
    ],
    "sourceFile": "offlineSyncService.ts",
    "relPath": "services/offlineSyncService.ts"
  },
  {
    "name": "SyncProgress",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "offlineSyncService.ts",
    "relPath": "services/offlineSyncService.ts"
  },
  {
    "name": "OfflineStatus",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "offlineSyncService.ts",
    "relPath": "services/offlineSyncService.ts"
  },
  {
    "name": "resolvePresetForTopic",
    "kind": "function",
    "returnType": "VectorPresetId",
    "params": [
      {
        "name": "subject",
        "type": "string"
      },
      {
        "name": "unit",
        "type": "string"
      },
      {
        "name": "topic",
        "type": "string"
      }
    ],
    "sourceFile": "playerLauncher.ts",
    "relPath": "services/playerLauncher.ts"
  },
  {
    "name": "openPlayerModal",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "options",
        "type": "PlayerCallOptions"
      }
    ],
    "sourceFile": "playerLauncher.ts",
    "relPath": "services/playerLauncher.ts"
  },
  {
    "name": "closePlayerModal",
    "kind": "function",
    "returnType": "void",
    "params": [],
    "sourceFile": "playerLauncher.ts",
    "relPath": "services/playerLauncher.ts"
  },
  {
    "name": "subscribeToPlayerCalls",
    "kind": "function",
    "returnType": "() => void",
    "params": [
      {
        "name": "listener",
        "type": "PlayerListener"
      }
    ],
    "sourceFile": "playerLauncher.ts",
    "relPath": "services/playerLauncher.ts"
  },
  {
    "name": "VectorPresetId",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "playerLauncher.ts",
    "relPath": "services/playerLauncher.ts"
  },
  {
    "name": "PlayerCallOptions",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "playerLauncher.ts",
    "relPath": "services/playerLauncher.ts"
  },
  {
    "name": "isStrictAirGapMode",
    "kind": "function",
    "returnType": "boolean",
    "params": [],
    "sourceFile": "privacyGuard.ts",
    "relPath": "services/privacyGuard.ts"
  },
  {
    "name": "setStrictAirGapMode",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "enabled",
        "type": "boolean"
      }
    ],
    "sourceFile": "privacyGuard.ts",
    "relPath": "services/privacyGuard.ts"
  },
  {
    "name": "listenToAirGapChanges",
    "kind": "function",
    "returnType": "() => void",
    "params": [
      {
        "name": "callback",
        "type": "(enabled: boolean) => void"
      }
    ],
    "sourceFile": "privacyGuard.ts",
    "relPath": "services/privacyGuard.ts"
  },
  {
    "name": "isSoundEnabled",
    "kind": "function",
    "returnType": "boolean",
    "params": [],
    "sourceFile": "soundHaptics.ts",
    "relPath": "services/soundHaptics.ts"
  },
  {
    "name": "setSoundEnabled",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "enabled",
        "type": "boolean"
      }
    ],
    "sourceFile": "soundHaptics.ts",
    "relPath": "services/soundHaptics.ts"
  },
  {
    "name": "isHapticsEnabled",
    "kind": "function",
    "returnType": "boolean",
    "params": [],
    "sourceFile": "soundHaptics.ts",
    "relPath": "services/soundHaptics.ts"
  },
  {
    "name": "setHapticsEnabled",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "enabled",
        "type": "boolean"
      }
    ],
    "sourceFile": "soundHaptics.ts",
    "relPath": "services/soundHaptics.ts"
  },
  {
    "name": "playSuccessChime",
    "kind": "function",
    "returnType": "void",
    "params": [],
    "sourceFile": "soundHaptics.ts",
    "relPath": "services/soundHaptics.ts"
  },
  {
    "name": "playIncorrectTone",
    "kind": "function",
    "returnType": "void",
    "params": [],
    "sourceFile": "soundHaptics.ts",
    "relPath": "services/soundHaptics.ts"
  },
  {
    "name": "playClickTone",
    "kind": "function",
    "returnType": "void",
    "params": [],
    "sourceFile": "soundHaptics.ts",
    "relPath": "services/soundHaptics.ts"
  },
  {
    "name": "playCelebrationFanfare",
    "kind": "function",
    "returnType": "void",
    "params": [],
    "sourceFile": "soundHaptics.ts",
    "relPath": "services/soundHaptics.ts"
  },
  {
    "name": "triggerHapticSuccess",
    "kind": "function",
    "returnType": "void",
    "params": [],
    "sourceFile": "soundHaptics.ts",
    "relPath": "services/soundHaptics.ts"
  },
  {
    "name": "triggerHapticError",
    "kind": "function",
    "returnType": "void",
    "params": [],
    "sourceFile": "soundHaptics.ts",
    "relPath": "services/soundHaptics.ts"
  },
  {
    "name": "triggerHapticClick",
    "kind": "function",
    "returnType": "void",
    "params": [],
    "sourceFile": "soundHaptics.ts",
    "relPath": "services/soundHaptics.ts"
  },
  {
    "name": "generateRandomAlias",
    "kind": "function",
    "returnType": "{ alias: string; avatar: string; }",
    "params": [],
    "sourceFile": "studentProfileStore.ts",
    "relPath": "services/studentProfileStore.ts"
  },
  {
    "name": "getLearnerProfile",
    "kind": "function",
    "returnType": "LearnerProfile",
    "params": [],
    "sourceFile": "studentProfileStore.ts",
    "relPath": "services/studentProfileStore.ts"
  },
  {
    "name": "saveLearnerProfile",
    "kind": "function",
    "returnType": "LearnerProfile",
    "params": [
      {
        "name": "updates",
        "type": "Partial<LearnerProfile>"
      }
    ],
    "sourceFile": "studentProfileStore.ts",
    "relPath": "services/studentProfileStore.ts"
  },
  {
    "name": "formatTopicTitle",
    "kind": "function",
    "returnType": "string",
    "params": [
      {
        "name": "rawTopicId",
        "type": "string"
      }
    ],
    "sourceFile": "studentProfileStore.ts",
    "relPath": "services/studentProfileStore.ts"
  },
  {
    "name": "getLearnerAnalytics",
    "kind": "function",
    "returnType": "Promise<LearnerAnalytics>",
    "params": [],
    "sourceFile": "studentProfileStore.ts",
    "relPath": "services/studentProfileStore.ts"
  },
  {
    "name": "purgeAllLearnerData",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [],
    "sourceFile": "studentProfileStore.ts",
    "relPath": "services/studentProfileStore.ts"
  },
  {
    "name": "exportLearnerPassportJson",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [],
    "sourceFile": "studentProfileStore.ts",
    "relPath": "services/studentProfileStore.ts"
  },
  {
    "name": "downloadLearnerCertificateHtml",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [],
    "sourceFile": "studentProfileStore.ts",
    "relPath": "services/studentProfileStore.ts"
  },
  {
    "name": "LearnerProfile",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "studentProfileStore.ts",
    "relPath": "services/studentProfileStore.ts"
  },
  {
    "name": "TopicMasteryStat",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "studentProfileStore.ts",
    "relPath": "services/studentProfileStore.ts"
  },
  {
    "name": "LearnerAnalytics",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "studentProfileStore.ts",
    "relPath": "services/studentProfileStore.ts"
  }
] as const;
