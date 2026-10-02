// Auto-generated Domain Substrate: CORE
export const CORE_AST_STRING = ";; Domain AST Manifest: core\n(:domain-substrate :core\n  (:symbol \"default\" :from \"App.tsx\" :kind :function :return \"React.JSX.Element\" :params ())\n  (:symbol \"ConceptGraphNode\" :from \"curriculum/conceptGraphEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ConceptGraphEdge\" :from \"curriculum/conceptGraphEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"DiagnosticRemediationRoute\" :from \"curriculum/conceptGraphEngine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ConceptGraphEngine\" :from \"curriculum/conceptGraphEngine.ts\" :kind :const :return \"ConceptGraphEngineSingleton\" :params ())\n  (:symbol \"adaptOakStage\" :from \"curriculum/curriculumAdapter.ts\" :kind :function :return \"StandardStage\" :params ((:param \"stage\" :type \"any\")))\n  (:symbol \"StandardTopic\" :from \"curriculum/curriculumAdapter.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"StandardSubject\" :from \"curriculum/curriculumAdapter.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"StandardStage\" :from \"curriculum/curriculumAdapter.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"generateCurriculumStockNumber\" :from \"curriculum/curriculumMesh.ts\" :kind :function :return \"string\" :params ((:param \"stageId\" :type \"string\") (:param \"subjectId\" :type \"string\") (:param \"topicId\" :type \"string\")))\n  (:symbol \"registerRouteNode\" :from \"curriculum/curriculumMesh.ts\" :kind :function :return \"void\" :params ((:param \"node\" :type \"CurriculumRouteNode\")))\n  (:symbol \"ingestCustomCurriculumPack\" :from \"curriculum/curriculumMesh.ts\" :kind :function :return \"number\" :params ((:param \"pack\" :type \"any\")))\n  (:symbol \"syncMeshToIndexedDB\" :from \"curriculum/curriculumMesh.ts\" :kind :function :return \"Promise<void>\" :params ())\n  (:symbol \"resolveCurriculumRoute\" :from \"curriculum/curriculumMesh.ts\" :kind :function :return \"CurriculumRouteNode\" :params ((:param \"stage\" :type \"string\") (:param \"subject\" :type \"string\") (:param \"topic\" :type \"string\") (:param \"lessonTitleOrId\" :type \"string\")))\n  (:symbol \"getQuestionForRoute\" :from \"curriculum/curriculumMesh.ts\" :kind :function :return \"CurriculumQuestionItem\" :params ((:param \"route\" :type \"CurriculumRouteNode\") (:param \"lessonTitleOrId\" :type \"string\") (:param \"forceVariation\" :type \"boolean\") (:param \"seedToken\" :type \"string\") (:param \"excludePrompt\" :type \"string\")))\n  (:symbol \"exportCurriculumMeshToSExpr\" :from \"curriculum/curriculumMesh.ts\" :kind :function :return \"string\" :params ())\n  (:symbol \"exportCurriculumMeshToJSON\" :from \"curriculum/curriculumMesh.ts\" :kind :function :return \"object\" :params ())\n  (:symbol \"ExecutionEngineType\" :from \"curriculum/curriculumMesh.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CurriculumQuestionItem\" :from \"curriculum/curriculumMesh.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CurriculumLessonNode\" :from \"curriculum/curriculumMesh.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CurriculumRouteNode\" :from \"curriculum/curriculumMesh.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ALL_CURRICULUM_ROUTES\" :from \"curriculum/curriculumMesh.ts\" :kind :const :return \"CurriculumRouteNode[]\" :params ())\n  (:symbol \"FOLDER_MANIFEST\" :from \"curriculum/engine.ts\" :kind :const :return \"{ readonly folder: \"src/curriculum\"; readonly timestamp: 1787937755228; readonly totalModules: 2; readonly exports: readonly [{ readonly name: \"StandardTopic\"; readonly isType: true; readonly sourceFile: \"curriculumAdapter\"; }, ... 8 more ..., { ...; }]; }\" :params ())\n  (:symbol \"FolderExportNames\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"adaptOakStage\" :from \"curriculum/engine.ts\" :kind :function :return \"StandardStage\" :params ((:param \"stage\" :type \"any\")))\n  (:symbol \"StandardTopic\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"StandardSubject\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"StandardStage\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"findTopicLessons\" :from \"curriculum/engine.ts\" :kind :function :return \"OakLesson[]\" :params ((:param \"stageKey\" :type \"string\") (:param \"subjectTitle\" :type \"string\") (:param \"topicTitle\" :type \"string\")))\n  (:symbol \"OakLesson\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OakTopic\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OakSubject\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OakStage\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OAK_CURRICULUM_CATALOGUE\" :from \"curriculum/engine.ts\" :kind :const :return \"Record<string, OakStage>\" :params ())\n  (:symbol \"OakCatalogue\" :from \"curriculum/engine.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"DEFAULT_OAK_CATALOGUE\" :from \"curriculum/engine.ts\" :kind :const :return \"OakCatalogue\" :params ())\n  (:symbol \"getActiveCurriculum\" :from \"curriculum/index.ts\" :kind :function :return \"CurriculumPackage\" :params ((:param \"id\" :type \"string\")))\n  (:symbol \"dispatchAstIntent\" :from \"curriculum/index.ts\" :kind :function :return \"T\" :params ((:param \"symbolName\" :type \"string\") (:param \"args\" :type \"any[]\")))\n  (:symbol \"CurriculumPackage\" :from \"curriculum/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CurriculumRegistry\" :from \"curriculum/index.ts\" :kind :const :return \"Record<string, CurriculumPackage>\" :params ())\n  (:symbol \"generateCurriculumStockNumber\" :from \"curriculum/index.ts\" :kind :function :return \"string\" :params ((:param \"stageId\" :type \"string\") (:param \"subjectId\" :type \"string\") (:param \"topicId\" :type \"string\")))\n  (:symbol \"registerRouteNode\" :from \"curriculum/index.ts\" :kind :function :return \"void\" :params ((:param \"node\" :type \"CurriculumRouteNode\")))\n  (:symbol \"ingestCustomCurriculumPack\" :from \"curriculum/index.ts\" :kind :function :return \"number\" :params ((:param \"pack\" :type \"any\")))\n  (:symbol \"syncMeshToIndexedDB\" :from \"curriculum/index.ts\" :kind :function :return \"Promise<void>\" :params ())\n  (:symbol \"resolveCurriculumRoute\" :from \"curriculum/index.ts\" :kind :function :return \"CurriculumRouteNode\" :params ((:param \"stage\" :type \"string\") (:param \"subject\" :type \"string\") (:param \"topic\" :type \"string\") (:param \"lessonTitleOrId\" :type \"string\")))\n  (:symbol \"getQuestionForRoute\" :from \"curriculum/index.ts\" :kind :function :return \"CurriculumQuestionItem\" :params ((:param \"route\" :type \"CurriculumRouteNode\") (:param \"lessonTitleOrId\" :type \"string\") (:param \"forceVariation\" :type \"boolean\") (:param \"seedToken\" :type \"string\") (:param \"excludePrompt\" :type \"string\")))\n  (:symbol \"exportCurriculumMeshToSExpr\" :from \"curriculum/index.ts\" :kind :function :return \"string\" :params ())\n  (:symbol \"exportCurriculumMeshToJSON\" :from \"curriculum/index.ts\" :kind :function :return \"object\" :params ())\n  (:symbol \"ExecutionEngineType\" :from \"curriculum/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CurriculumQuestionItem\" :from \"curriculum/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CurriculumLessonNode\" :from \"curriculum/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CurriculumRouteNode\" :from \"curriculum/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ALL_CURRICULUM_ROUTES\" :from \"curriculum/index.ts\" :kind :const :return \"CurriculumRouteNode[]\" :params ())\n  (:symbol \"generateCurriculumAst\" :from \"curriculum/mineCurriculumAst.ts\" :kind :function :return \"void\" :params ((:param \"dirPath\" :type \"string\") (:param \"outputPath\" :type \"string\")))\n  (:symbol \"findTopicLessons\" :from \"curriculum/oakCatalogue.ts\" :kind :function :return \"OakLesson[]\" :params ((:param \"stageKey\" :type \"string\") (:param \"subjectTitle\" :type \"string\") (:param \"topicTitle\" :type \"string\")))\n  (:symbol \"OakLesson\" :from \"curriculum/oakCatalogue.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OakTopic\" :from \"curriculum/oakCatalogue.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OakSubject\" :from \"curriculum/oakCatalogue.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OakStage\" :from \"curriculum/oakCatalogue.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OAK_CURRICULUM_CATALOGUE\" :from \"curriculum/oakCatalogue.ts\" :kind :const :return \"Record<string, OakStage>\" :params ())\n  (:symbol \"OakCatalogue\" :from \"curriculum/oakCatalogue.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"DEFAULT_OAK_CATALOGUE\" :from \"curriculum/oakCatalogue.ts\" :kind :const :return \"OakCatalogue\" :params ())\n  (:symbol \"CatholicPrayer\" :from \"data/catholic/catholicPrayers.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CATHOLIC_PRAYERS\" :from \"data/catholic/catholicPrayers.ts\" :kind :const :return \"CatholicPrayer[]\" :params ())\n  (:symbol \"CSTPrinciple\" :from \"data/catholic/cstAndVirtues.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CST_PRINCIPLES\" :from \"data/catholic/cstAndVirtues.ts\" :kind :const :return \"CSTPrinciple[]\" :params ())\n  (:symbol \"SchoolVirtue\" :from \"data/catholic/cstAndVirtues.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SCHOOL_VIRTUES\" :from \"data/catholic/cstAndVirtues.ts\" :kind :const :return \"SchoolVirtue[]\" :params ())\n  (:symbol \"CSTPrinciple\" :from \"data/catholic/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CST_PRINCIPLES\" :from \"data/catholic/index.ts\" :kind :const :return \"CSTPrinciple[]\" :params ())\n  (:symbol \"SchoolVirtue\" :from \"data/catholic/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SCHOOL_VIRTUES\" :from \"data/catholic/index.ts\" :kind :const :return \"SchoolVirtue[]\" :params ())\n  (:symbol \"LiturgyStep\" :from \"data/catholic/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LITURGY_STEPS\" :from \"data/catholic/index.ts\" :kind :const :return \"LiturgyStep[]\" :params ())\n  (:symbol \"CORRECT_LITURGY_SEQUENCE_IDS\" :from \"data/catholic/index.ts\" :kind :const :return \"string[]\" :params ())\n  (:symbol \"SacredObject\" :from \"data/catholic/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SACRED_OBJECTS\" :from \"data/catholic/index.ts\" :kind :const :return \"SacredObject[]\" :params ())\n  (:symbol \"CatholicPrayer\" :from \"data/catholic/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CATHOLIC_PRAYERS\" :from \"data/catholic/index.ts\" :kind :const :return \"CatholicPrayer[]\" :params ())\n  (:symbol \"LatinPrayerVerse\" :from \"data/catholic/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LatinPrayerItem\" :from \"data/catholic/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LATIN_PRAYERS_DATA\" :from \"data/catholic/index.ts\" :kind :const :return \"LatinPrayerItem[]\" :params ())\n  (:symbol \"StationQuest\" :from \"data/catholic/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SANCTUARY_QUESTS\" :from \"data/catholic/index.ts\" :kind :const :return \"StationQuest[]\" :params ())\n  (:symbol \"SacramentData\" :from \"data/catholic/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SacramentQuizQuestion\" :from \"data/catholic/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SEVEN_SACRAMENTS\" :from \"data/catholic/index.ts\" :kind :const :return \"SacramentData[]\" :params ())\n  (:symbol \"SACRAMENTS_QUIZ_QUESTIONS\" :from \"data/catholic/index.ts\" :kind :const :return \"SacramentQuizQuestion[]\" :params ())\n  (:symbol \"getCurrentSeasonByDate\" :from \"data/catholic/index.ts\" :kind :function :return \"LiturgicalSeason\" :params ())\n  (:symbol \"LiturgicalSeason\" :from \"data/catholic/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LiturgicalQuizItem\" :from \"data/catholic/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LITURGICAL_SEASONS\" :from \"data/catholic/index.ts\" :kind :const :return \"LiturgicalSeason[]\" :params ())\n  (:symbol \"LITURGICAL_QUIZ_QUESTIONS\" :from \"data/catholic/index.ts\" :kind :const :return \"LiturgicalQuizItem[]\" :params ())\n  (:symbol \"CATHOLIC_KS2_KNOWLEDGE\" :from \"data/catholic/index.ts\" :kind :const :return \"Record<string, CurriculumTopicKnowledge>\" :params ())\n  (:symbol \"CATHOLIC_KS3_KNOWLEDGE\" :from \"data/catholic/index.ts\" :kind :const :return \"Record<string, CurriculumTopicEntry>\" :params ())\n  (:symbol \"LatinPrayerVerse\" :from \"data/catholic/latinPrayers.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LatinPrayerItem\" :from \"data/catholic/latinPrayers.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LATIN_PRAYERS_DATA\" :from \"data/catholic/latinPrayers.ts\" :kind :const :return \"LatinPrayerItem[]\" :params ())\n  (:symbol \"getCurrentSeasonByDate\" :from \"data/catholic/liturgicalCalendar.ts\" :kind :function :return \"LiturgicalSeason\" :params ())\n  (:symbol \"LiturgicalSeason\" :from \"data/catholic/liturgicalCalendar.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LiturgicalQuizItem\" :from \"data/catholic/liturgicalCalendar.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LITURGICAL_SEASONS\" :from \"data/catholic/liturgicalCalendar.ts\" :kind :const :return \"LiturgicalSeason[]\" :params ())\n  (:symbol \"LITURGICAL_QUIZ_QUESTIONS\" :from \"data/catholic/liturgicalCalendar.ts\" :kind :const :return \"LiturgicalQuizItem[]\" :params ())\n  (:symbol \"LiturgyStep\" :from \"data/catholic/liturgySteps.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LITURGY_STEPS\" :from \"data/catholic/liturgySteps.ts\" :kind :const :return \"LiturgyStep[]\" :params ())\n  (:symbol \"CORRECT_LITURGY_SEQUENCE_IDS\" :from \"data/catholic/liturgySteps.ts\" :kind :const :return \"string[]\" :params ())\n  (:symbol \"CATHOLIC_KS2_KNOWLEDGE\" :from \"data/catholic/reCurriculumKnowledge.ts\" :kind :const :return \"Record<string, CurriculumTopicKnowledge>\" :params ())\n  (:symbol \"CATHOLIC_KS3_KNOWLEDGE\" :from \"data/catholic/reKs3CurriculumKnowledge.ts\" :kind :const :return \"Record<string, CurriculumTopicEntry>\" :params ())\n  (:symbol \"SacredObject\" :from \"data/catholic/sacredObjects.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SACRED_OBJECTS\" :from \"data/catholic/sacredObjects.ts\" :kind :const :return \"SacredObject[]\" :params ())\n  (:symbol \"StationQuest\" :from \"data/catholic/sanctuaryQuests.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SANCTUARY_QUESTS\" :from \"data/catholic/sanctuaryQuests.ts\" :kind :const :return \"StationQuest[]\" :params ())\n  (:symbol \"SacramentData\" :from \"data/catholic/sevenSacraments.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SacramentQuizQuestion\" :from \"data/catholic/sevenSacraments.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SEVEN_SACRAMENTS\" :from \"data/catholic/sevenSacraments.ts\" :kind :const :return \"SacramentData[]\" :params ())\n  (:symbol \"SACRAMENTS_QUIZ_QUESTIONS\" :from \"data/catholic/sevenSacraments.ts\" :kind :const :return \"SacramentQuizQuestion[]\" :params ())\n  (:symbol \"getComplianceCaveat\" :from \"data/complianceCaveats.ts\" :kind :function :return \"ComplianceCaveat\" :params ((:param \"langCode\" :type \"string\")))\n  (:symbol \"ComplianceCaveat\" :from \"data/complianceCaveats.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"COMPLIANCE_CAVEATS\" :from \"data/complianceCaveats.ts\" :kind :const :return \"Record<string, ComplianceCaveat>\" :params ())\n  (:symbol \"CURRICULUM_COMPLETE_BASE\" :from \"data/curriculumKnowledgeComplete.ts\" :kind :const :return \"Record<string, CurriculumTopicEntry>\" :params ())\n  (:symbol \"CurriculumTopicEntry\" :from \"data/curriculumKnowledgeExpansion.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CURRICULUM_EXPANSION_BASE\" :from \"data/curriculumKnowledgeExpansion.ts\" :kind :const :return \"Record<string, CurriculumTopicEntry>\" :params ())\n  (:symbol \"getActiveCurriculumTree\" :from \"data/curriculumRegistry.ts\" :kind :function :return \"Record<string, StandardStage>\" :params ((:param \"providerKey\" :type \"CurriculumProviderKey\")))\n  (:symbol \"CurriculumProviderKey\" :from \"data/curriculumRegistry.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CURRICULUM_PROVIDERS\" :from \"data/curriculumRegistry.ts\" :kind :const :return \"Record<CurriculumProviderKey, () => Record<string, StandardStage>>\" :params ())\n  (:symbol \"findCurriculumKnowledge\" :from \"data/oakCurriculumKnowledge.ts\" :kind :function :return \"CurriculumTopicKnowledge\" :params ((:param \"stage\" :type \"string\") (:param \"subject\" :type \"string\") (:param \"topic\" :type \"string\")))\n  (:symbol \"CurriculumQuestion\" :from \"data/oakCurriculumKnowledge.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CurriculumTopicKnowledge\" :from \"data/oakCurriculumKnowledge.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CURRICULUM_KNOWLEDGE_BASE\" :from \"data/oakCurriculumKnowledge.ts\" :kind :const :return \"Record<string, CurriculumTopicKnowledge>\" :params ())\n  (:symbol \"OakLessonSeed\" :from \"data/oakCurriculumSeeds.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"OAK_CURRICULUM_SEEDS\" :from \"data/oakCurriculumSeeds.ts\" :kind :const :return \"Record<string, OakLessonSeed>\" :params ())\n  (:symbol \"DramaticChoice\" :from \"data/shakespearePlays.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"PlayAct\" :from \"data/shakespearePlays.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ShakespearePlayStory\" :from \"data/shakespearePlays.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SHAKESPEARE_PLAY_STORIES\" :from \"data/shakespearePlays.ts\" :kind :const :return \"ShakespearePlayStory[]\" :params ())\n  (:symbol \"COMMUNION_MANIFEST\" :from \"manifests/communion.ts\" :kind :const :return \"DomainManifest\" :params ())\n  (:symbol \"SCHOOL_MANIFEST\" :from \"manifests/school.ts\" :kind :const :return \"DomainManifest\" :params ())\n  (:symbol \"VFS_CURRICULUM_SEEDS\" :from \"manifests/vfsSeedModules.ts\" :kind :const :return \"Record<string, string>\" :params ())\n  (:symbol \"registerServiceWorker\" :from \"registerServiceWorker.ts\" :kind :function :return \"void\" :params ())\n  (:symbol \"BrowserRouter\" :from \"router/index.tsx\" :kind :function :return \"React.JSX.Element\" :params ((:param \"__0\" :type \"BrowserRouterProps\")))\n  (:symbol \"useLocation\" :from \"router/index.tsx\" :kind :function :return \"LocationState\" :params ())\n  (:symbol \"useNavigate\" :from \"router/index.tsx\" :kind :function :return \"NavigateFunction\" :params ())\n  (:symbol \"useSearchParams\" :from \"router/index.tsx\" :kind :function :return \"[URLSearchParams, (newParams: Record<string, string> | URLSearchParams, options?: { replace?: boolean; }) => void]\" :params ())\n  (:symbol \"Route\" :from \"router/index.tsx\" :kind :function :return \"any\" :params ((:param \"_props\" :type \"RouteProps\")))\n  (:symbol \"Routes\" :from \"router/index.tsx\" :kind :function :return \"any\" :params ((:param \"__0\" :type \"RoutesProps\")))\n  (:symbol \"Outlet\" :from \"router/index.tsx\" :kind :function :return \"any\" :params ())\n  (:symbol \"LocationState\" :from \"router/index.tsx\" :kind :const :return \"any\" :params ())\n  (:symbol \"NavigateFunction\" :from \"router/index.tsx\" :kind :const :return \"any\" :params ())\n  (:symbol \"BrowserRouterProps\" :from \"router/index.tsx\" :kind :const :return \"any\" :params ())\n  (:symbol \"RouteProps\" :from \"router/index.tsx\" :kind :const :return \"any\" :params ())\n  (:symbol \"RoutesProps\" :from \"router/index.tsx\" :kind :const :return \"any\" :params ())\n  (:symbol \"LinkProps\" :from \"router/index.tsx\" :kind :const :return \"any\" :params ())\n  (:symbol \"Link\" :from \"router/index.tsx\" :kind :const :return \"any\" :params ())\n  (:symbol \"NavLinkProps\" :from \"router/index.tsx\" :kind :const :return \"any\" :params ())\n  (:symbol \"NavLink\" :from \"router/index.tsx\" :kind :const :return \"any\" :params ())\n  (:symbol \"getRuleSet\" :from \"rules/index.ts\" :kind :function :return \"RulePackage\" :params ((:param \"name\" :type \"string\")))\n  (:symbol \"RulePackage\" :from \"rules/index.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"RulesRegistry\" :from \"rules/index.ts\" :kind :const :return \"Record<string, RulePackage>\" :params ())\n  (:symbol \"SemanticRule\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"Challenge\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"Cohort\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"TutorPersona\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"DomainManifest\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"LearningStream\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"CatalogItem\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"StreamCategory\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"MasterCatalog\" :from \"types/learning-ast.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"defineASTScene\" :from \"types/mediaPlayer.ts\" :kind :function :return \"ASTSceneDefinition\" :params ((:param \"scene\" :type \"ASTSceneDefinition\")))\n  (:symbol \"ASTKeyframe\" :from \"types/mediaPlayer.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ASTSubtitle\" :from \"types/mediaPlayer.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ASTAudioCue\" :from \"types/mediaPlayer.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ASTSceneDefinition\" :from \"types/mediaPlayer.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ASTPlayerCommand\" :from \"types/mediaPlayer.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ASTPlayerTelemetry\" :from \"types/mediaPlayer.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"getPresetConfig\" :from \"types/playerConfig.ts\" :kind :function :return \"PlayerDisplayConfig\" :params ((:param \"mode\" :type \"PlayerDisplayMode\")))\n  (:symbol \"loadSavedPlayerConfig\" :from \"types/playerConfig.ts\" :kind :function :return \"PlayerDisplayConfig\" :params ())\n  (:symbol \"savePlayerConfig\" :from \"types/playerConfig.ts\" :kind :function :return \"void\" :params ((:param \"config\" :type \"PlayerDisplayConfig\")))\n  (:symbol \"PlayerDisplayMode\" :from \"types/playerConfig.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"PlayerDisplayConfig\" :from \"types/playerConfig.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"MODE_METADATA\" :from \"types/playerConfig.ts\" :kind :const :return \"Record<PlayerDisplayMode, { label: string; icon: string; tag: string; description: string; }>\" :params ())\n  (:symbol \"CLASSROOM_PRESET\" :from \"types/playerConfig.ts\" :kind :const :return \"PlayerDisplayConfig\" :params ())\n  (:symbol \"STUDENT_PRESET\" :from \"types/playerConfig.ts\" :kind :const :return \"PlayerDisplayConfig\" :params ())\n  (:symbol \"BROADCAST_PRESET\" :from \"types/playerConfig.ts\" :kind :const :return \"PlayerDisplayConfig\" :params ())\n  (:symbol \"DEVELOPER_PRESET\" :from \"types/playerConfig.ts\" :kind :const :return \"PlayerDisplayConfig\" :params ())\n  (:symbol \"CONFIG_STORAGE_KEY\" :from \"types/playerConfig.ts\" :kind :const :return \"\"stj_player_display_config\"\" :params ())\n  (:symbol \"isAstQuestion\" :from \"types/sexpr.ts\" :kind :function :return \"boolean\" :params ((:param \"node\" :type \"any\")))\n  (:symbol \"isAstScene\" :from \"types/sexpr.ts\" :kind :function :return \"boolean\" :params ((:param \"node\" :type \"any\")))\n  (:symbol \"isAstLesson\" :from \"types/sexpr.ts\" :kind :function :return \"boolean\" :params ((:param \"node\" :type \"any\")))\n  (:symbol \"SExprAtom\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SExprNode\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SExprAST\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"AstQuestionNode\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"ParsedAstNode\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"AstCameraOrbit\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"AstKeyframeNode\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"AstBindingType\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"AstBindingNode\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"AstSubtitleNode\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"AstPhysicsBody\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"AstPhysicsConfig\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"AstSceneNode\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"AstLessonNode\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"UnifiedAstUnit\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"BackendTier\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"EngineExecutionResult\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"EngineOptions\" :from \"types/sexpr.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"healSExprString\" :from \"utils/astQuestionExtractor.ts\" :kind :function :return \"string\" :params ((:param \"raw\" :type \"string\")))\n  (:symbol \"extractQuestionFromAst\" :from \"utils/astQuestionExtractor.ts\" :kind :function :return \"ExtractedQuestion\" :params ((:param \"rawLisp\" :type \"string\")))\n  (:symbol \"ExtractedQuestion\" :from \"utils/astQuestionExtractor.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"compileAstStyle\" :from \"utils/astStyleCompiler.ts\" :kind :function :return \"CSSProperties\" :params ((:param \"styleAst\" :type \"SExprAST | CSSProperties\") (:param \"nodeProps\" :type \"Record<string, any>\")))\n  (:symbol \"LITURGICAL_AST_PALETTE\" :from \"utils/astStyleCompiler.ts\" :kind :const :return \"Record<string, { bg: string; border: string; text: string; accent: string; }>\" :params ())\n  (:symbol \"isBinaryFrame\" :from \"utils/binaryStreamProtocol.ts\" :kind :function :return \"boolean\" :params ((:param \"data\" :type \"unknown\")))\n  (:symbol \"encodeBinaryFrame\" :from \"utils/binaryStreamProtocol.ts\" :kind :function :return \"ArrayBuffer\" :params ((:param \"opcode\" :type \"number\") (:param \"payload\" :type \"string | Uint8Array<ArrayBufferLike>\") (:param \"streamId\" :type \"number\") (:param \"flags\" :type \"number\")))\n  (:symbol \"decodeBinaryFrame\" :from \"utils/binaryStreamProtocol.ts\" :kind :function :return \"DecodedBinaryFrame\" :params ((:param \"buffer\" :type \"ArrayBuffer\")))\n  (:symbol \"createTokenChunkFrame\" :from \"utils/binaryStreamProtocol.ts\" :kind :function :return \"ArrayBuffer\" :params ((:param \"token\" :type \"string\") (:param \"streamId\" :type \"number\") (:param \"isFinal\" :type \"boolean\")))\n  (:symbol \"createAstNodeFrame\" :from \"utils/binaryStreamProtocol.ts\" :kind :function :return \"ArrayBuffer\" :params ((:param \"rawAst\" :type \"string\") (:param \"streamId\" :type \"number\") (:param \"isGoverned\" :type \"boolean\") (:param \"metadata\" :type \"Record<string, any>\")))\n  (:symbol \"createEofFrame\" :from \"utils/binaryStreamProtocol.ts\" :kind :function :return \"ArrayBuffer\" :params ((:param \"streamId\" :type \"number\")))\n  (:symbol \"PROTOCOL_MAGIC_0\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"83\" :params ())\n  (:symbol \"PROTOCOL_MAGIC_1\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"74\" :params ())\n  (:symbol \"PROTOCOL_VERSION\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"2\" :params ())\n  (:symbol \"OP_TOKEN_CHUNK\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"1\" :params ())\n  (:symbol \"OP_AST_NODE_CHUNK\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"2\" :params ())\n  (:symbol \"OP_AST_NODE_COMPLETE\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"3\" :params ())\n  (:symbol \"OP_HEARTBEAT_PING\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"4\" :params ())\n  (:symbol \"OP_HEARTBEAT_PONG\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"5\" :params ())\n  (:symbol \"OP_STATUS\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"6\" :params ())\n  (:symbol \"OP_ERROR\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"7\" :params ())\n  (:symbol \"OP_STREAM_EOF\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"15\" :params ())\n  (:symbol \"FLAG_IS_FINAL\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"1\" :params ())\n  (:symbol \"FLAG_IS_GOVERNED\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"2\" :params ())\n  (:symbol \"FLAG_IS_JSON\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"4\" :params ())\n  (:symbol \"DecodedBinaryFrame\" :from \"utils/binaryStreamProtocol.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"Channel\" :from \"utils/channelBus.ts\" :kind :class :return \"typeof Channel\" :params ())\n  (:symbol \"Channels\" :from \"utils/channelBus.ts\" :kind :const :return \"{ UI_ACTIONS: Channel<{ action: string; payload: any; }>; AI_DIAGNOSTICS: Channel<{ studentId: string; challengeId: string; answer: string; isCorrect: boolean; }>; PROGRESS_LOG: Channel<...>; }\" :params ())\n  (:symbol \"triggerCorrectConfetti\" :from \"utils/confetti.ts\" :kind :function :return \"void\" :params ())\n  (:symbol \"triggerStreakCelebration\" :from \"utils/confetti.ts\" :kind :function :return \"void\" :params ((:param \"streak\" :type \"number\")))\n  (:symbol \"triggerMasteryConfetti\" :from \"utils/confetti.ts\" :kind :function :return \"void\" :params ())\n  (:symbol \"encryptLocalData\" :from \"utils/cryptoVault.ts\" :kind :function :return \"Promise<EncryptedPayload>\" :params ((:param \"plainText\" :type \"string\") (:param \"passphrase\" :type \"string\")))\n  (:symbol \"decryptLocalData\" :from \"utils/cryptoVault.ts\" :kind :function :return \"Promise<string>\" :params ((:param \"payload\" :type \"EncryptedPayload\") (:param \"passphrase\" :type \"string\")))\n  (:symbol \"computeSha256\" :from \"utils/cryptoVault.ts\" :kind :function :return \"Promise<string>\" :params ((:param \"text\" :type \"string\")))\n  (:symbol \"EncryptedPayload\" :from \"utils/cryptoVault.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"resolveHarmonisedRoute\" :from \"utils/harmonisedRouteResolver.ts\" :kind :function :return \"RouteResolution\" :params ((:param \"rawPath\" :type \"string\") (:param \"search\" :type \"string\")))\n  (:symbol \"RouteResolution\" :from \"utils/harmonisedRouteResolver.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"generateSessionReport\" :from \"utils/sessionReporter.ts\" :kind :function :return \"Promise<SessionReportSummary>\" :params ((:param \"sessionId\" :type \"string\")))\n  (:symbol \"downloadReportAsHtml\" :from \"utils/sessionReporter.ts\" :kind :function :return \"void\" :params ((:param \"summary\" :type \"SessionReportSummary\")))\n  (:symbol \"SessionReportSummary\" :from \"utils/sessionReporter.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"stripSExprComments\" :from \"utils/sexprParser.ts\" :kind :function :return \"string\" :params ((:param \"str\" :type \"string\")))\n  (:symbol \"parseSExpr\" :from \"utils/sexprParser.ts\" :kind :function :return \"SExprAST\" :params ((:param \"input\" :type \"string\")))\n  (:symbol \"tokenize\" :from \"utils/sexprParser.ts\" :kind :function :return \"string[]\" :params ((:param \"str\" :type \"string\")))\n  (:symbol \"parseAstNode\" :from \"utils/sexprParser.ts\" :kind :function :return \"ParsedAstNode\" :params ((:param \"input\" :type \"SExprAST\")))\n  (:symbol \"ParsedAstNode\" :from \"utils/sexprParser.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"AstParser\" :from \"utils/sexprParser.ts\" :kind :class :return \"typeof AstParser\" :params ())\n  (:symbol \"transpileSwfToAst\" :from \"utils/swfAstParser.ts\" :kind :function :return \"Promise<SwfTranspileResult>\" :params ((:param \"fileData\" :type \"ArrayBuffer | Uint8Array<ArrayBufferLike>\") (:param \"sceneId\" :type \"string\")))\n  (:symbol \"SwfMetadata\" :from \"utils/swfAstParser.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"SwfTranspileResult\" :from \"utils/swfAstParser.ts\" :kind :const :return \"any\" :params ())\n  (:symbol \"getAssetUrl\" :from \"utils/url.ts\" :kind :function :return \"string\" :params ((:param \"path\" :type \"string\")))\n)\n";
export const CORE_EXPORT_CATALOG = [
  {
    "name": "default",
    "kind": "function",
    "returnType": "React.JSX.Element",
    "params": [],
    "sourceFile": "App.tsx",
    "relPath": "App.tsx"
  },
  {
    "name": "ConceptGraphNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "conceptGraphEngine.ts",
    "relPath": "curriculum/conceptGraphEngine.ts"
  },
  {
    "name": "ConceptGraphEdge",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "conceptGraphEngine.ts",
    "relPath": "curriculum/conceptGraphEngine.ts"
  },
  {
    "name": "DiagnosticRemediationRoute",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "conceptGraphEngine.ts",
    "relPath": "curriculum/conceptGraphEngine.ts"
  },
  {
    "name": "ConceptGraphEngine",
    "kind": "const",
    "returnType": "ConceptGraphEngineSingleton",
    "params": [],
    "sourceFile": "conceptGraphEngine.ts",
    "relPath": "curriculum/conceptGraphEngine.ts"
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
    "name": "generateCurriculumStockNumber",
    "kind": "function",
    "returnType": "string",
    "params": [
      {
        "name": "stageId",
        "type": "string"
      },
      {
        "name": "subjectId",
        "type": "string"
      },
      {
        "name": "topicId",
        "type": "string"
      }
    ],
    "sourceFile": "curriculumMesh.ts",
    "relPath": "curriculum/curriculumMesh.ts"
  },
  {
    "name": "registerRouteNode",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "node",
        "type": "CurriculumRouteNode"
      }
    ],
    "sourceFile": "curriculumMesh.ts",
    "relPath": "curriculum/curriculumMesh.ts"
  },
  {
    "name": "ingestCustomCurriculumPack",
    "kind": "function",
    "returnType": "number",
    "params": [
      {
        "name": "pack",
        "type": "any"
      }
    ],
    "sourceFile": "curriculumMesh.ts",
    "relPath": "curriculum/curriculumMesh.ts"
  },
  {
    "name": "syncMeshToIndexedDB",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [],
    "sourceFile": "curriculumMesh.ts",
    "relPath": "curriculum/curriculumMesh.ts"
  },
  {
    "name": "resolveCurriculumRoute",
    "kind": "function",
    "returnType": "CurriculumRouteNode",
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
        "name": "lessonTitleOrId",
        "type": "string"
      }
    ],
    "sourceFile": "curriculumMesh.ts",
    "relPath": "curriculum/curriculumMesh.ts"
  },
  {
    "name": "getQuestionForRoute",
    "kind": "function",
    "returnType": "CurriculumQuestionItem",
    "params": [
      {
        "name": "route",
        "type": "CurriculumRouteNode"
      },
      {
        "name": "lessonTitleOrId",
        "type": "string"
      },
      {
        "name": "forceVariation",
        "type": "boolean"
      },
      {
        "name": "seedToken",
        "type": "string"
      },
      {
        "name": "excludePrompt",
        "type": "string"
      }
    ],
    "sourceFile": "curriculumMesh.ts",
    "relPath": "curriculum/curriculumMesh.ts"
  },
  {
    "name": "exportCurriculumMeshToSExpr",
    "kind": "function",
    "returnType": "string",
    "params": [],
    "sourceFile": "curriculumMesh.ts",
    "relPath": "curriculum/curriculumMesh.ts"
  },
  {
    "name": "exportCurriculumMeshToJSON",
    "kind": "function",
    "returnType": "object",
    "params": [],
    "sourceFile": "curriculumMesh.ts",
    "relPath": "curriculum/curriculumMesh.ts"
  },
  {
    "name": "ExecutionEngineType",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "curriculumMesh.ts",
    "relPath": "curriculum/curriculumMesh.ts"
  },
  {
    "name": "CurriculumQuestionItem",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "curriculumMesh.ts",
    "relPath": "curriculum/curriculumMesh.ts"
  },
  {
    "name": "CurriculumLessonNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "curriculumMesh.ts",
    "relPath": "curriculum/curriculumMesh.ts"
  },
  {
    "name": "CurriculumRouteNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "curriculumMesh.ts",
    "relPath": "curriculum/curriculumMesh.ts"
  },
  {
    "name": "ALL_CURRICULUM_ROUTES",
    "kind": "const",
    "returnType": "CurriculumRouteNode[]",
    "params": [],
    "sourceFile": "curriculumMesh.ts",
    "relPath": "curriculum/curriculumMesh.ts"
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
    "name": "findTopicLessons",
    "kind": "function",
    "returnType": "OakLesson[]",
    "params": [
      {
        "name": "stageKey",
        "type": "string"
      },
      {
        "name": "subjectTitle",
        "type": "string"
      },
      {
        "name": "topicTitle",
        "type": "string"
      }
    ],
    "sourceFile": "engine.ts",
    "relPath": "curriculum/engine.ts"
  },
  {
    "name": "OakLesson",
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
    "name": "generateCurriculumStockNumber",
    "kind": "function",
    "returnType": "string",
    "params": [
      {
        "name": "stageId",
        "type": "string"
      },
      {
        "name": "subjectId",
        "type": "string"
      },
      {
        "name": "topicId",
        "type": "string"
      }
    ],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "registerRouteNode",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "node",
        "type": "CurriculumRouteNode"
      }
    ],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "ingestCustomCurriculumPack",
    "kind": "function",
    "returnType": "number",
    "params": [
      {
        "name": "pack",
        "type": "any"
      }
    ],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "syncMeshToIndexedDB",
    "kind": "function",
    "returnType": "Promise<void>",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "resolveCurriculumRoute",
    "kind": "function",
    "returnType": "CurriculumRouteNode",
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
        "name": "lessonTitleOrId",
        "type": "string"
      }
    ],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "getQuestionForRoute",
    "kind": "function",
    "returnType": "CurriculumQuestionItem",
    "params": [
      {
        "name": "route",
        "type": "CurriculumRouteNode"
      },
      {
        "name": "lessonTitleOrId",
        "type": "string"
      },
      {
        "name": "forceVariation",
        "type": "boolean"
      },
      {
        "name": "seedToken",
        "type": "string"
      },
      {
        "name": "excludePrompt",
        "type": "string"
      }
    ],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "exportCurriculumMeshToSExpr",
    "kind": "function",
    "returnType": "string",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "exportCurriculumMeshToJSON",
    "kind": "function",
    "returnType": "object",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "ExecutionEngineType",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "CurriculumQuestionItem",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "CurriculumLessonNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "CurriculumRouteNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "curriculum/index.ts"
  },
  {
    "name": "ALL_CURRICULUM_ROUTES",
    "kind": "const",
    "returnType": "CurriculumRouteNode[]",
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
    "name": "findTopicLessons",
    "kind": "function",
    "returnType": "OakLesson[]",
    "params": [
      {
        "name": "stageKey",
        "type": "string"
      },
      {
        "name": "subjectTitle",
        "type": "string"
      },
      {
        "name": "topicTitle",
        "type": "string"
      }
    ],
    "sourceFile": "oakCatalogue.ts",
    "relPath": "curriculum/oakCatalogue.ts"
  },
  {
    "name": "OakLesson",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "oakCatalogue.ts",
    "relPath": "curriculum/oakCatalogue.ts"
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
    "name": "CatholicPrayer",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "catholicPrayers.ts",
    "relPath": "data/catholic/catholicPrayers.ts"
  },
  {
    "name": "CATHOLIC_PRAYERS",
    "kind": "const",
    "returnType": "CatholicPrayer[]",
    "params": [],
    "sourceFile": "catholicPrayers.ts",
    "relPath": "data/catholic/catholicPrayers.ts"
  },
  {
    "name": "CSTPrinciple",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "cstAndVirtues.ts",
    "relPath": "data/catholic/cstAndVirtues.ts"
  },
  {
    "name": "CST_PRINCIPLES",
    "kind": "const",
    "returnType": "CSTPrinciple[]",
    "params": [],
    "sourceFile": "cstAndVirtues.ts",
    "relPath": "data/catholic/cstAndVirtues.ts"
  },
  {
    "name": "SchoolVirtue",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "cstAndVirtues.ts",
    "relPath": "data/catholic/cstAndVirtues.ts"
  },
  {
    "name": "SCHOOL_VIRTUES",
    "kind": "const",
    "returnType": "SchoolVirtue[]",
    "params": [],
    "sourceFile": "cstAndVirtues.ts",
    "relPath": "data/catholic/cstAndVirtues.ts"
  },
  {
    "name": "CSTPrinciple",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "CST_PRINCIPLES",
    "kind": "const",
    "returnType": "CSTPrinciple[]",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "SchoolVirtue",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "SCHOOL_VIRTUES",
    "kind": "const",
    "returnType": "SchoolVirtue[]",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "LiturgyStep",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "LITURGY_STEPS",
    "kind": "const",
    "returnType": "LiturgyStep[]",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "CORRECT_LITURGY_SEQUENCE_IDS",
    "kind": "const",
    "returnType": "string[]",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "SacredObject",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "SACRED_OBJECTS",
    "kind": "const",
    "returnType": "SacredObject[]",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "CatholicPrayer",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "CATHOLIC_PRAYERS",
    "kind": "const",
    "returnType": "CatholicPrayer[]",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "LatinPrayerVerse",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "LatinPrayerItem",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "LATIN_PRAYERS_DATA",
    "kind": "const",
    "returnType": "LatinPrayerItem[]",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "StationQuest",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "SANCTUARY_QUESTS",
    "kind": "const",
    "returnType": "StationQuest[]",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "SacramentData",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "SacramentQuizQuestion",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "SEVEN_SACRAMENTS",
    "kind": "const",
    "returnType": "SacramentData[]",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "SACRAMENTS_QUIZ_QUESTIONS",
    "kind": "const",
    "returnType": "SacramentQuizQuestion[]",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "getCurrentSeasonByDate",
    "kind": "function",
    "returnType": "LiturgicalSeason",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "LiturgicalSeason",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "LiturgicalQuizItem",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "LITURGICAL_SEASONS",
    "kind": "const",
    "returnType": "LiturgicalSeason[]",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "LITURGICAL_QUIZ_QUESTIONS",
    "kind": "const",
    "returnType": "LiturgicalQuizItem[]",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "CATHOLIC_KS2_KNOWLEDGE",
    "kind": "const",
    "returnType": "Record<string, CurriculumTopicKnowledge>",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "CATHOLIC_KS3_KNOWLEDGE",
    "kind": "const",
    "returnType": "Record<string, CurriculumTopicEntry>",
    "params": [],
    "sourceFile": "index.ts",
    "relPath": "data/catholic/index.ts"
  },
  {
    "name": "LatinPrayerVerse",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "latinPrayers.ts",
    "relPath": "data/catholic/latinPrayers.ts"
  },
  {
    "name": "LatinPrayerItem",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "latinPrayers.ts",
    "relPath": "data/catholic/latinPrayers.ts"
  },
  {
    "name": "LATIN_PRAYERS_DATA",
    "kind": "const",
    "returnType": "LatinPrayerItem[]",
    "params": [],
    "sourceFile": "latinPrayers.ts",
    "relPath": "data/catholic/latinPrayers.ts"
  },
  {
    "name": "getCurrentSeasonByDate",
    "kind": "function",
    "returnType": "LiturgicalSeason",
    "params": [],
    "sourceFile": "liturgicalCalendar.ts",
    "relPath": "data/catholic/liturgicalCalendar.ts"
  },
  {
    "name": "LiturgicalSeason",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "liturgicalCalendar.ts",
    "relPath": "data/catholic/liturgicalCalendar.ts"
  },
  {
    "name": "LiturgicalQuizItem",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "liturgicalCalendar.ts",
    "relPath": "data/catholic/liturgicalCalendar.ts"
  },
  {
    "name": "LITURGICAL_SEASONS",
    "kind": "const",
    "returnType": "LiturgicalSeason[]",
    "params": [],
    "sourceFile": "liturgicalCalendar.ts",
    "relPath": "data/catholic/liturgicalCalendar.ts"
  },
  {
    "name": "LITURGICAL_QUIZ_QUESTIONS",
    "kind": "const",
    "returnType": "LiturgicalQuizItem[]",
    "params": [],
    "sourceFile": "liturgicalCalendar.ts",
    "relPath": "data/catholic/liturgicalCalendar.ts"
  },
  {
    "name": "LiturgyStep",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "liturgySteps.ts",
    "relPath": "data/catholic/liturgySteps.ts"
  },
  {
    "name": "LITURGY_STEPS",
    "kind": "const",
    "returnType": "LiturgyStep[]",
    "params": [],
    "sourceFile": "liturgySteps.ts",
    "relPath": "data/catholic/liturgySteps.ts"
  },
  {
    "name": "CORRECT_LITURGY_SEQUENCE_IDS",
    "kind": "const",
    "returnType": "string[]",
    "params": [],
    "sourceFile": "liturgySteps.ts",
    "relPath": "data/catholic/liturgySteps.ts"
  },
  {
    "name": "CATHOLIC_KS2_KNOWLEDGE",
    "kind": "const",
    "returnType": "Record<string, CurriculumTopicKnowledge>",
    "params": [],
    "sourceFile": "reCurriculumKnowledge.ts",
    "relPath": "data/catholic/reCurriculumKnowledge.ts"
  },
  {
    "name": "CATHOLIC_KS3_KNOWLEDGE",
    "kind": "const",
    "returnType": "Record<string, CurriculumTopicEntry>",
    "params": [],
    "sourceFile": "reKs3CurriculumKnowledge.ts",
    "relPath": "data/catholic/reKs3CurriculumKnowledge.ts"
  },
  {
    "name": "SacredObject",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sacredObjects.ts",
    "relPath": "data/catholic/sacredObjects.ts"
  },
  {
    "name": "SACRED_OBJECTS",
    "kind": "const",
    "returnType": "SacredObject[]",
    "params": [],
    "sourceFile": "sacredObjects.ts",
    "relPath": "data/catholic/sacredObjects.ts"
  },
  {
    "name": "StationQuest",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sanctuaryQuests.ts",
    "relPath": "data/catholic/sanctuaryQuests.ts"
  },
  {
    "name": "SANCTUARY_QUESTS",
    "kind": "const",
    "returnType": "StationQuest[]",
    "params": [],
    "sourceFile": "sanctuaryQuests.ts",
    "relPath": "data/catholic/sanctuaryQuests.ts"
  },
  {
    "name": "SacramentData",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sevenSacraments.ts",
    "relPath": "data/catholic/sevenSacraments.ts"
  },
  {
    "name": "SacramentQuizQuestion",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sevenSacraments.ts",
    "relPath": "data/catholic/sevenSacraments.ts"
  },
  {
    "name": "SEVEN_SACRAMENTS",
    "kind": "const",
    "returnType": "SacramentData[]",
    "params": [],
    "sourceFile": "sevenSacraments.ts",
    "relPath": "data/catholic/sevenSacraments.ts"
  },
  {
    "name": "SACRAMENTS_QUIZ_QUESTIONS",
    "kind": "const",
    "returnType": "SacramentQuizQuestion[]",
    "params": [],
    "sourceFile": "sevenSacraments.ts",
    "relPath": "data/catholic/sevenSacraments.ts"
  },
  {
    "name": "getComplianceCaveat",
    "kind": "function",
    "returnType": "ComplianceCaveat",
    "params": [
      {
        "name": "langCode",
        "type": "string"
      }
    ],
    "sourceFile": "complianceCaveats.ts",
    "relPath": "data/complianceCaveats.ts"
  },
  {
    "name": "ComplianceCaveat",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "complianceCaveats.ts",
    "relPath": "data/complianceCaveats.ts"
  },
  {
    "name": "COMPLIANCE_CAVEATS",
    "kind": "const",
    "returnType": "Record<string, ComplianceCaveat>",
    "params": [],
    "sourceFile": "complianceCaveats.ts",
    "relPath": "data/complianceCaveats.ts"
  },
  {
    "name": "CURRICULUM_COMPLETE_BASE",
    "kind": "const",
    "returnType": "Record<string, CurriculumTopicEntry>",
    "params": [],
    "sourceFile": "curriculumKnowledgeComplete.ts",
    "relPath": "data/curriculumKnowledgeComplete.ts"
  },
  {
    "name": "CurriculumTopicEntry",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "curriculumKnowledgeExpansion.ts",
    "relPath": "data/curriculumKnowledgeExpansion.ts"
  },
  {
    "name": "CURRICULUM_EXPANSION_BASE",
    "kind": "const",
    "returnType": "Record<string, CurriculumTopicEntry>",
    "params": [],
    "sourceFile": "curriculumKnowledgeExpansion.ts",
    "relPath": "data/curriculumKnowledgeExpansion.ts"
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
    "name": "findCurriculumKnowledge",
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
    "sourceFile": "oakCurriculumKnowledge.ts",
    "relPath": "data/oakCurriculumKnowledge.ts"
  },
  {
    "name": "CurriculumQuestion",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "oakCurriculumKnowledge.ts",
    "relPath": "data/oakCurriculumKnowledge.ts"
  },
  {
    "name": "CurriculumTopicKnowledge",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "oakCurriculumKnowledge.ts",
    "relPath": "data/oakCurriculumKnowledge.ts"
  },
  {
    "name": "CURRICULUM_KNOWLEDGE_BASE",
    "kind": "const",
    "returnType": "Record<string, CurriculumTopicKnowledge>",
    "params": [],
    "sourceFile": "oakCurriculumKnowledge.ts",
    "relPath": "data/oakCurriculumKnowledge.ts"
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
    "name": "DramaticChoice",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "shakespearePlays.ts",
    "relPath": "data/shakespearePlays.ts"
  },
  {
    "name": "PlayAct",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "shakespearePlays.ts",
    "relPath": "data/shakespearePlays.ts"
  },
  {
    "name": "ShakespearePlayStory",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "shakespearePlays.ts",
    "relPath": "data/shakespearePlays.ts"
  },
  {
    "name": "SHAKESPEARE_PLAY_STORIES",
    "kind": "const",
    "returnType": "ShakespearePlayStory[]",
    "params": [],
    "sourceFile": "shakespearePlays.ts",
    "relPath": "data/shakespearePlays.ts"
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
    "name": "registerServiceWorker",
    "kind": "function",
    "returnType": "void",
    "params": [],
    "sourceFile": "registerServiceWorker.ts",
    "relPath": "registerServiceWorker.ts"
  },
  {
    "name": "BrowserRouter",
    "kind": "function",
    "returnType": "React.JSX.Element",
    "params": [
      {
        "name": "__0",
        "type": "BrowserRouterProps"
      }
    ],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "useLocation",
    "kind": "function",
    "returnType": "LocationState",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "useNavigate",
    "kind": "function",
    "returnType": "NavigateFunction",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "useSearchParams",
    "kind": "function",
    "returnType": "[URLSearchParams, (newParams: Record<string, string> | URLSearchParams, options?: { replace?: boolean; }) => void]",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "Route",
    "kind": "function",
    "returnType": "any",
    "params": [
      {
        "name": "_props",
        "type": "RouteProps"
      }
    ],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "Routes",
    "kind": "function",
    "returnType": "any",
    "params": [
      {
        "name": "__0",
        "type": "RoutesProps"
      }
    ],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "Outlet",
    "kind": "function",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "LocationState",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "NavigateFunction",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "BrowserRouterProps",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "RouteProps",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "RoutesProps",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "LinkProps",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "Link",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "NavLinkProps",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
  },
  {
    "name": "NavLink",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "index.tsx",
    "relPath": "router/index.tsx"
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
    "name": "defineASTScene",
    "kind": "function",
    "returnType": "ASTSceneDefinition",
    "params": [
      {
        "name": "scene",
        "type": "ASTSceneDefinition"
      }
    ],
    "sourceFile": "mediaPlayer.ts",
    "relPath": "types/mediaPlayer.ts"
  },
  {
    "name": "ASTKeyframe",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "mediaPlayer.ts",
    "relPath": "types/mediaPlayer.ts"
  },
  {
    "name": "ASTSubtitle",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "mediaPlayer.ts",
    "relPath": "types/mediaPlayer.ts"
  },
  {
    "name": "ASTAudioCue",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "mediaPlayer.ts",
    "relPath": "types/mediaPlayer.ts"
  },
  {
    "name": "ASTSceneDefinition",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "mediaPlayer.ts",
    "relPath": "types/mediaPlayer.ts"
  },
  {
    "name": "ASTPlayerCommand",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "mediaPlayer.ts",
    "relPath": "types/mediaPlayer.ts"
  },
  {
    "name": "ASTPlayerTelemetry",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "mediaPlayer.ts",
    "relPath": "types/mediaPlayer.ts"
  },
  {
    "name": "getPresetConfig",
    "kind": "function",
    "returnType": "PlayerDisplayConfig",
    "params": [
      {
        "name": "mode",
        "type": "PlayerDisplayMode"
      }
    ],
    "sourceFile": "playerConfig.ts",
    "relPath": "types/playerConfig.ts"
  },
  {
    "name": "loadSavedPlayerConfig",
    "kind": "function",
    "returnType": "PlayerDisplayConfig",
    "params": [],
    "sourceFile": "playerConfig.ts",
    "relPath": "types/playerConfig.ts"
  },
  {
    "name": "savePlayerConfig",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "config",
        "type": "PlayerDisplayConfig"
      }
    ],
    "sourceFile": "playerConfig.ts",
    "relPath": "types/playerConfig.ts"
  },
  {
    "name": "PlayerDisplayMode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "playerConfig.ts",
    "relPath": "types/playerConfig.ts"
  },
  {
    "name": "PlayerDisplayConfig",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "playerConfig.ts",
    "relPath": "types/playerConfig.ts"
  },
  {
    "name": "MODE_METADATA",
    "kind": "const",
    "returnType": "Record<PlayerDisplayMode, { label: string; icon: string; tag: string; description: string; }>",
    "params": [],
    "sourceFile": "playerConfig.ts",
    "relPath": "types/playerConfig.ts"
  },
  {
    "name": "CLASSROOM_PRESET",
    "kind": "const",
    "returnType": "PlayerDisplayConfig",
    "params": [],
    "sourceFile": "playerConfig.ts",
    "relPath": "types/playerConfig.ts"
  },
  {
    "name": "STUDENT_PRESET",
    "kind": "const",
    "returnType": "PlayerDisplayConfig",
    "params": [],
    "sourceFile": "playerConfig.ts",
    "relPath": "types/playerConfig.ts"
  },
  {
    "name": "BROADCAST_PRESET",
    "kind": "const",
    "returnType": "PlayerDisplayConfig",
    "params": [],
    "sourceFile": "playerConfig.ts",
    "relPath": "types/playerConfig.ts"
  },
  {
    "name": "DEVELOPER_PRESET",
    "kind": "const",
    "returnType": "PlayerDisplayConfig",
    "params": [],
    "sourceFile": "playerConfig.ts",
    "relPath": "types/playerConfig.ts"
  },
  {
    "name": "CONFIG_STORAGE_KEY",
    "kind": "const",
    "returnType": "\"stj_player_display_config\"",
    "params": [],
    "sourceFile": "playerConfig.ts",
    "relPath": "types/playerConfig.ts"
  },
  {
    "name": "isAstQuestion",
    "kind": "function",
    "returnType": "boolean",
    "params": [
      {
        "name": "node",
        "type": "any"
      }
    ],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "isAstScene",
    "kind": "function",
    "returnType": "boolean",
    "params": [
      {
        "name": "node",
        "type": "any"
      }
    ],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "isAstLesson",
    "kind": "function",
    "returnType": "boolean",
    "params": [
      {
        "name": "node",
        "type": "any"
      }
    ],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
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
    "name": "AstQuestionNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "ParsedAstNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "AstCameraOrbit",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "AstKeyframeNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "AstBindingType",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "AstBindingNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "AstSubtitleNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "AstPhysicsBody",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "AstPhysicsConfig",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "AstSceneNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "AstLessonNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "UnifiedAstUnit",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "BackendTier",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "EngineExecutionResult",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "EngineOptions",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexpr.ts",
    "relPath": "types/sexpr.ts"
  },
  {
    "name": "healSExprString",
    "kind": "function",
    "returnType": "string",
    "params": [
      {
        "name": "raw",
        "type": "string"
      }
    ],
    "sourceFile": "astQuestionExtractor.ts",
    "relPath": "utils/astQuestionExtractor.ts"
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
    "name": "compileAstStyle",
    "kind": "function",
    "returnType": "CSSProperties",
    "params": [
      {
        "name": "styleAst",
        "type": "SExprAST | CSSProperties"
      },
      {
        "name": "nodeProps",
        "type": "Record<string, any>"
      }
    ],
    "sourceFile": "astStyleCompiler.ts",
    "relPath": "utils/astStyleCompiler.ts"
  },
  {
    "name": "LITURGICAL_AST_PALETTE",
    "kind": "const",
    "returnType": "Record<string, { bg: string; border: string; text: string; accent: string; }>",
    "params": [],
    "sourceFile": "astStyleCompiler.ts",
    "relPath": "utils/astStyleCompiler.ts"
  },
  {
    "name": "isBinaryFrame",
    "kind": "function",
    "returnType": "boolean",
    "params": [
      {
        "name": "data",
        "type": "unknown"
      }
    ],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "encodeBinaryFrame",
    "kind": "function",
    "returnType": "ArrayBuffer",
    "params": [
      {
        "name": "opcode",
        "type": "number"
      },
      {
        "name": "payload",
        "type": "string | Uint8Array<ArrayBufferLike>"
      },
      {
        "name": "streamId",
        "type": "number"
      },
      {
        "name": "flags",
        "type": "number"
      }
    ],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "decodeBinaryFrame",
    "kind": "function",
    "returnType": "DecodedBinaryFrame",
    "params": [
      {
        "name": "buffer",
        "type": "ArrayBuffer"
      }
    ],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "createTokenChunkFrame",
    "kind": "function",
    "returnType": "ArrayBuffer",
    "params": [
      {
        "name": "token",
        "type": "string"
      },
      {
        "name": "streamId",
        "type": "number"
      },
      {
        "name": "isFinal",
        "type": "boolean"
      }
    ],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "createAstNodeFrame",
    "kind": "function",
    "returnType": "ArrayBuffer",
    "params": [
      {
        "name": "rawAst",
        "type": "string"
      },
      {
        "name": "streamId",
        "type": "number"
      },
      {
        "name": "isGoverned",
        "type": "boolean"
      },
      {
        "name": "metadata",
        "type": "Record<string, any>"
      }
    ],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "createEofFrame",
    "kind": "function",
    "returnType": "ArrayBuffer",
    "params": [
      {
        "name": "streamId",
        "type": "number"
      }
    ],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "PROTOCOL_MAGIC_0",
    "kind": "const",
    "returnType": "83",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "PROTOCOL_MAGIC_1",
    "kind": "const",
    "returnType": "74",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "PROTOCOL_VERSION",
    "kind": "const",
    "returnType": "2",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "OP_TOKEN_CHUNK",
    "kind": "const",
    "returnType": "1",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "OP_AST_NODE_CHUNK",
    "kind": "const",
    "returnType": "2",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "OP_AST_NODE_COMPLETE",
    "kind": "const",
    "returnType": "3",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "OP_HEARTBEAT_PING",
    "kind": "const",
    "returnType": "4",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "OP_HEARTBEAT_PONG",
    "kind": "const",
    "returnType": "5",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "OP_STATUS",
    "kind": "const",
    "returnType": "6",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "OP_ERROR",
    "kind": "const",
    "returnType": "7",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "OP_STREAM_EOF",
    "kind": "const",
    "returnType": "15",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "FLAG_IS_FINAL",
    "kind": "const",
    "returnType": "1",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "FLAG_IS_GOVERNED",
    "kind": "const",
    "returnType": "2",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "FLAG_IS_JSON",
    "kind": "const",
    "returnType": "4",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
  },
  {
    "name": "DecodedBinaryFrame",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "binaryStreamProtocol.ts",
    "relPath": "utils/binaryStreamProtocol.ts"
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
    "name": "triggerCorrectConfetti",
    "kind": "function",
    "returnType": "void",
    "params": [],
    "sourceFile": "confetti.ts",
    "relPath": "utils/confetti.ts"
  },
  {
    "name": "triggerStreakCelebration",
    "kind": "function",
    "returnType": "void",
    "params": [
      {
        "name": "streak",
        "type": "number"
      }
    ],
    "sourceFile": "confetti.ts",
    "relPath": "utils/confetti.ts"
  },
  {
    "name": "triggerMasteryConfetti",
    "kind": "function",
    "returnType": "void",
    "params": [],
    "sourceFile": "confetti.ts",
    "relPath": "utils/confetti.ts"
  },
  {
    "name": "encryptLocalData",
    "kind": "function",
    "returnType": "Promise<EncryptedPayload>",
    "params": [
      {
        "name": "plainText",
        "type": "string"
      },
      {
        "name": "passphrase",
        "type": "string"
      }
    ],
    "sourceFile": "cryptoVault.ts",
    "relPath": "utils/cryptoVault.ts"
  },
  {
    "name": "decryptLocalData",
    "kind": "function",
    "returnType": "Promise<string>",
    "params": [
      {
        "name": "payload",
        "type": "EncryptedPayload"
      },
      {
        "name": "passphrase",
        "type": "string"
      }
    ],
    "sourceFile": "cryptoVault.ts",
    "relPath": "utils/cryptoVault.ts"
  },
  {
    "name": "computeSha256",
    "kind": "function",
    "returnType": "Promise<string>",
    "params": [
      {
        "name": "text",
        "type": "string"
      }
    ],
    "sourceFile": "cryptoVault.ts",
    "relPath": "utils/cryptoVault.ts"
  },
  {
    "name": "EncryptedPayload",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "cryptoVault.ts",
    "relPath": "utils/cryptoVault.ts"
  },
  {
    "name": "resolveHarmonisedRoute",
    "kind": "function",
    "returnType": "RouteResolution",
    "params": [
      {
        "name": "rawPath",
        "type": "string"
      },
      {
        "name": "search",
        "type": "string"
      }
    ],
    "sourceFile": "harmonisedRouteResolver.ts",
    "relPath": "utils/harmonisedRouteResolver.ts"
  },
  {
    "name": "RouteResolution",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "harmonisedRouteResolver.ts",
    "relPath": "utils/harmonisedRouteResolver.ts"
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
    "name": "stripSExprComments",
    "kind": "function",
    "returnType": "string",
    "params": [
      {
        "name": "str",
        "type": "string"
      }
    ],
    "sourceFile": "sexprParser.ts",
    "relPath": "utils/sexprParser.ts"
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
  },
  {
    "name": "tokenize",
    "kind": "function",
    "returnType": "string[]",
    "params": [
      {
        "name": "str",
        "type": "string"
      }
    ],
    "sourceFile": "sexprParser.ts",
    "relPath": "utils/sexprParser.ts"
  },
  {
    "name": "parseAstNode",
    "kind": "function",
    "returnType": "ParsedAstNode",
    "params": [
      {
        "name": "input",
        "type": "SExprAST"
      }
    ],
    "sourceFile": "sexprParser.ts",
    "relPath": "utils/sexprParser.ts"
  },
  {
    "name": "ParsedAstNode",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "sexprParser.ts",
    "relPath": "utils/sexprParser.ts"
  },
  {
    "name": "AstParser",
    "kind": "class",
    "returnType": "typeof AstParser",
    "params": [],
    "sourceFile": "sexprParser.ts",
    "relPath": "utils/sexprParser.ts"
  },
  {
    "name": "transpileSwfToAst",
    "kind": "function",
    "returnType": "Promise<SwfTranspileResult>",
    "params": [
      {
        "name": "fileData",
        "type": "ArrayBuffer | Uint8Array<ArrayBufferLike>"
      },
      {
        "name": "sceneId",
        "type": "string"
      }
    ],
    "sourceFile": "swfAstParser.ts",
    "relPath": "utils/swfAstParser.ts"
  },
  {
    "name": "SwfMetadata",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "swfAstParser.ts",
    "relPath": "utils/swfAstParser.ts"
  },
  {
    "name": "SwfTranspileResult",
    "kind": "const",
    "returnType": "any",
    "params": [],
    "sourceFile": "swfAstParser.ts",
    "relPath": "utils/swfAstParser.ts"
  },
  {
    "name": "getAssetUrl",
    "kind": "function",
    "returnType": "string",
    "params": [
      {
        "name": "path",
        "type": "string"
      }
    ],
    "sourceFile": "url.ts",
    "relPath": "utils/url.ts"
  }
] as const;
