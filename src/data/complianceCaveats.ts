// src/data/complianceCaveats.ts
// Multilingual legal compliance caveats for California (CAADCA, SOPIPA, CCPA)
// and India (DPDP Act 2023 Sec 5(3), IT Rules 2021).
// Written in plain, child-appropriate language.

export interface ComplianceCaveat {
  badgeTitle: string;
  badgeSubtitle: string;
  activateBtn: string;
  ecoBtn: string;
  californiaNotice: string;
  indiaNotice: string;
  deviceReadyText: string;
  deviceDownloadText: string;
  deviceUnsupportedText: string;
  statusOn: string;
  statusEco: string;
  activeSummary: string;
  ecoSummary: string;
}

export const COMPLIANCE_CAVEATS: Record<string, ComplianceCaveat> = {
  en: {
    badgeTitle: '100% Private On-Device AI',
    badgeSubtitle: 'Prof. Turing runs entirely on this computer via Chrome Gemini Nano. No student questions, answers, or voice audio ever leave this device or go to the cloud.',
    activateBtn: '✅ Activate Private AI',
    ecoBtn: '🌱 Keep Eco Mode',
    californiaNotice: 'California (CAADCA & SOPIPA): Zero student data collection or sale. Runs strictly offline.',
    indiaNotice: 'India (DPDP Act Sec 5(3)): Local on-device processing. No child personal data is transmitted to cloud fiduciaries.',
    deviceReadyText: 'Device Ready (Prompt API active)',
    deviceDownloadText: 'Supported (downloads model locally)',
    deviceUnsupportedText: 'Curriculum Rules Mode (Chromebook / Chrome 128+)',
    statusOn: 'Nano AI: ON',
    statusEco: 'Nano AI: Eco',
    activeSummary: 'Active: Student tutoring runs 100% locally in your browser. Zero cloud data egress.',
    ecoSummary: 'Eco Mode: Runs pre-compiled curriculum logic. Turn on Nano for live Socratic conversational tutoring.',
  },
  es: {
    badgeTitle: 'IA 100% Privada en el Dispositivo',
    badgeSubtitle: 'El Profesor Turing se ejecuta completamente en esta computadora mediante Chrome Gemini Nano. Las preguntas, respuestas y voz del estudiante nunca salen de este dispositivo ni van a la nube.',
    activateBtn: '✅ Activar IA Privada',
    ecoBtn: '🌱 Mantener Modo Eco',
    californiaNotice: 'California (CAADCA y SOPIPA): Cero recopilación o venta de datos de estudiantes. Totalmente seguro fuera de línea.',
    indiaNotice: 'India (Ley DPDP Art. 5(3)): Procesamiento local en el dispositivo. No se transmiten datos personales de menores a servidores.',
    deviceReadyText: 'Dispositivo Listo (Prompt API activo)',
    deviceDownloadText: 'Compatible (descarga el modelo localmente)',
    deviceUnsupportedText: 'Modo Reglas Curriculares (Chromebook / Chrome 128+)',
    statusOn: 'IA Nano: ACTIVA',
    statusEco: 'IA Nano: Eco',
    activeSummary: 'Activo: La tutoría se ejecuta 100% localmente en el navegador. Sin salida de datos a la nube.',
    ecoSummary: 'Modo Eco: Utiliza lógica curricular precompilada. Activa Nano para tutoría socrática en vivo.',
  },
  hi: {
    badgeTitle: '100% निजी ऑन-डिवाइस एआई',
    badgeSubtitle: 'प्रोफेसर ट्यूरिंग पूरी तरह से इसी कंप्यूटर पर क्रोम जेमिनी नैनो के माध्यम से चलता है। छात्र के प्रश्न, उत्तर या आवाज़ कभी भी इस डिवाइस से बाहर नहीं जाते और न ही क्लाउड पर जाते हैं।',
    activateBtn: '✅ निजी एआई चालू करें',
    ecoBtn: '🌱 इको मोड में रखें',
    californiaNotice: 'कैलिफोर्निया (CAADCA और SOPIPA): छात्र डेटा का कोई संग्रह या बिक्री नहीं। पूरी तरह से सुरक्षित।',
    indiaNotice: 'भारत (डीपीडीपी अधिनियम धारा 5(3)): स्थानीय ऑन-डिवाइस प्रोसेसिंग। किसी भी बच्चे का व्यक्तिगत डेटा क्लाउड पर नहीं भेजा जाता।',
    deviceReadyText: 'डिवाइस तैयार है (Prompt API सक्रिय)',
    deviceDownloadText: 'समर्थित (मॉडल स्थानीय रूप से डाउनलोड होता है)',
    deviceUnsupportedText: 'पाठ्यचर्या नियम मोड (Chromebook / Chrome 128+)',
    statusOn: 'नैनो एआई: चालू',
    statusEco: 'नैनो एआई: इको',
    activeSummary: 'सक्रिय: छात्र ट्यूशन 100% स्थानीय रूप से ब्राउज़र में चलती है। कोई क्लाउड डेटा नहीं भेजा जाता।',
    ecoSummary: 'इको मोड: पूर्व-संकलित पाठ्यचर्या तर्क का उपयोग करता है। संवादात्मक ट्यूशन के लिए नैनो चालू करें।',
  },
  bn: {
    badgeTitle: '১০০% ব্যক্তিগত অন-ডিভাইস এআই',
    badgeSubtitle: 'প্রফেসর টুরিং সম্পূর্ণভাবে এই কম্পিউটারে ক্রোম জেমিনি ন্যানোর মাধ্যমে চলে। শিক্ষার্থীর কোনো প্রশ্ন, উত্তর বা অডিও কখনই এই ডিভাইস ছেড়ে ক্লাউডে যায় না।',
    activateBtn: '✅ ব্যক্তিগত এআই চালু করুন',
    ecoBtn: '🌱 ইকো মোড রাখুন',
    californiaNotice: 'ক্যালিফোর্নিয়া (CAADCA ও SOPIPA): শিক্ষার্থীর ডেটা সংগ্রহ বা বিক্রি করা হয় না। সম্পূর্ণ অফলাইন।',
    indiaNotice: 'ভারত (DPDP আইন ধারা ৫(৩)): স্থানীয় অন-ডিভাইস প্রসেসিং। শিশুদের কোনো ব্যক্তিগত তথ্য ক্লাউডে পাঠানো হয় না।',
    deviceReadyText: 'ডিভাইস প্রস্তুত (Prompt API সক্রিয়)',
    deviceDownloadText: 'সমর্থিত (মডেলটি স্থানীয়ভাবে ডাউনলোড হয়)',
    deviceUnsupportedText: 'কারিকুলাম রুলস মোড (Chromebook / Chrome 128+)',
    statusOn: 'ন্যানো এআই: চালু',
    statusEco: 'ন্যানো এআই: ইকো',
    activeSummary: 'সক্রিয়: শিক্ষা পুরোপুরি ব্রাউজারের অভ্যন্তরে সম্পন্ন হয়। ক্লাউডে ডেটা স্থানান্তরিত হয় না।',
    ecoSummary: 'ইকো মোড: পূর্ব-সংকলিত পাঠ্যক্রম যুক্তি ব্যবহার করে। সরাসরি চ্যাট টিউটরের জন্য ন্যানো চালু করুন।',
  },
  ur: {
    badgeTitle: '100% نجی آن ڈیوائس AI',
    badgeSubtitle: 'پروفیسر ٹیورنگ مکمل طور پر اسی کمپیوٹر پر کروم جیمنی نینو کے ذریعے چلتا ہے۔ طالب علم کے سوالات، جوابات یا آواز کبھی بھی اس ڈیوائس سے باہر کلاؤڈ پر نہیں جاتے۔',
    activateBtn: '✅ نجی AI فعال کریں',
    ecoBtn: '🌱 ایکو موڈ برقرار رکھیں',
    californiaNotice: 'کیلیفورنیا (CAADCA اور SOPIPA): طالب علم کے ڈیٹا کا کوئی مجموعہ یا فروخت نہیں۔ مکمل طور پر آف لائن۔',
    indiaNotice: 'بھارت (DPDP ایکٹ سیکشن 5(3)): مقامی آن ڈیوائس پروسیسنگ۔ بچوں کا کوئی ذاتی ڈیٹا کلاؤڈ پر منتقل نہیں ہوتا۔',
    deviceReadyText: 'ڈیوائس تیار ہے (Prompt API فعال)',
    deviceDownloadText: 'معاون ہے (ماڈل مقامی طور پر ڈاؤن لوڈ ہوتا ہے)',
    deviceUnsupportedText: 'نصاب کے قواعد کا موڈ (Chromebook / Chrome 128+)',
    statusOn: 'نینو AI: آن',
    statusEco: 'نینو AI: ایکو',
    activeSummary: 'فعال: طالب علم کی تدریس 100% مقامی طور پر براؤزر میں چلتی ہے۔ کلاؤڈ میں کوئی ڈیٹا نہیں جاتا۔',
    ecoSummary: 'ایکو موڈ: پہلے سے مرتب کردہ نصابی منطق چلاتا ہے۔ براہ راست تدریس کے لیے نینو آن کریں۔',
  },
  fr: {
    badgeTitle: 'IA 100% Privée sur l\'Appareil',
    badgeSubtitle: 'Le Professeur Turing s\'exécute entièrement sur cet ordinateur via Chrome Gemini Nano. Aucune question d\'élève, réponse ou voix ne quitte cet appareil ni n\'est envoyée dans le cloud.',
    activateBtn: '✅ Activer l\'IA Privée',
    ecoBtn: '🌱 Rester en Mode Éco',
    californiaNotice: 'Californie (CAADCA & SOPIPA) : Aucune collecte ni vente de données élèves. Conforme et sécurisé.',
    indiaNotice: 'Inde (DPDP Act Sec 5(3)) : Traitement local sur l\'appareil. Aucune donnée d\'enfant n\'est transmise au cloud.',
    deviceReadyText: 'Appareil Prêt (Prompt API actif)',
    deviceDownloadText: 'Pris en charge (téléchargement du modèle local)',
    deviceUnsupportedText: 'Mode Règles Pédagogiques (Chromebook / Chrome 128+)',
    statusOn: 'IA Nano : ON',
    statusEco: 'IA Nano : Éco',
    activeSummary: 'Actif : Le tutorat s\'exécute à 100% localement dans votre navigateur. Aucune donnée cloud.',
    ecoSummary: 'Mode Éco : Utilise la logique de cours pré-compilée. Activez Nano pour un tutorat socratique en direct.',
  },
  de: {
    badgeTitle: '100% Private On-Device KI',
    badgeSubtitle: 'Prof. Turing läuft vollständig auf diesem Computer über Chrome Gemini Nano. Keine Schülerfragen, Antworten oder Sprachaufnahmen verlassen dieses Gerät.',
    activateBtn: '✅ Private KI aktivieren',
    ecoBtn: '🌱 Öko-Modus behalten',
    californiaNotice: 'Kalifornien (CAADCA & SOPIPA): Keine Erfassung oder Weitergabe von Schülerdaten.',
    indiaNotice: 'Indien (DPDP Act Sec 5(3)): Lokale Verarbeitung auf dem Gerät. Keine Cloud-Datenübertragung.',
    deviceReadyText: 'Gerät bereit (Prompt API aktiv)',
    deviceDownloadText: 'Unterstützt (lädt Modell lokal herunter)',
    deviceUnsupportedText: 'Lehrplan-Regel-Modus (Chromebook / Chrome 128+)',
    statusOn: 'Nano KI: EIN',
    statusEco: 'Nano KI: Öko',
    activeSummary: 'Aktiv: Das Tutoring läuft zu 100% lokal im Browser. Kein Cloud-Datenverkehr.',
    ecoSummary: 'Öko-Modus: Verwendet vorkompilierte Lehrplanregeln. Schalten Sie Nano für Live-Hilfe ein.',
  },
  pl: {
    badgeTitle: '100% Prywatna AI na Urządzeniu',
    badgeSubtitle: 'Prof. Turing działa całkowicie na tym komputerze przez Chrome Gemini Nano. Żadne pytania, odpowiedzi ani nagrania głosowe uczniów nie opuszczają urządzenia.',
    activateBtn: '✅ Włącz prywatną AI',
    ecoBtn: '🌱 Tryb Eko',
    californiaNotice: 'Kalifornia (CAADCA i SOPIPA): Brak gromadzenia danych uczniów. Pełna ochrona.',
    indiaNotice: 'Indie (DPDP Act Sec 5(3)): Przetwarzanie lokalne. Żadne dane dzieci nie trafiają do chmury.',
    deviceReadyText: 'Urządzenie gotowe (Prompt API aktywne)',
    deviceDownloadText: 'Obsługiwane (pobieranie lokalnego modelu)',
    deviceUnsupportedText: 'Tryb reguł programu (Chromebook / Chrome 128+)',
    statusOn: 'Nano AI: WŁ',
    statusEco: 'Nano AI: Eko',
    activeSummary: 'Aktywny: Korepetycje działają w 100% lokalnie w przeglądarce. Zero chmury.',
    ecoSummary: 'Tryb Eko: Używa wstępnie skompilowanych reguł. Włącz Nano, aby uzyskać interaktywną pomoc.',
  },
  ar: {
    badgeTitle: 'ذكاء اصطناعي محلي خاص بنسبة 100%',
    badgeSubtitle: 'يعمل الأستاذ تورينغ بالكامل على هذا الحاسوب عبر Chrome Gemini Nano. لا تغادر أي أسئلة أو إجابات أو تسجيلات صوتية هذا الجهاز مطلقاً.',
    activateBtn: '✅ تفعيل الذكاء الاصطناعي الخاص',
    ecoBtn: '🌱 البقاء في الوضع البيئي',
    californiaNotice: 'كاليفورنيا (CAADCA & SOPIPA): لا يتم جمع بيانات الطلاب أو بيعها مطلقاً.',
    indiaNotice: 'الهند (قانون DPDP المادة 5(3)): معالجة محلية داخل الجهاز دون إرسال بيانات الأطفال للسحابة.',
    deviceReadyText: 'الجهاز جاهز (Prompt API نشط)',
    deviceDownloadText: 'مدعوم (يتم تنزيل النموذج محلياً)',
    deviceUnsupportedText: 'وضع قواعد المنهج (Chromebook / Chrome 128+)',
    statusOn: 'الذكاء Nano: نشط',
    statusEco: 'الذكاء Nano: بيئي',
    activeSummary: 'نشط: يعمل التدريس بنسبة 100% داخل متصفحك دون أي خروج للبيانات.',
    ecoSummary: 'الوضع البيئي: يستخدم منطق المنهج المترجم مسبقاً. قم بتفعيل Nano للحصول على محادثة ذكية.',
  },
  zh: {
    badgeTitle: '100% 端侧隐私人工智能',
    badgeSubtitle: '图灵教授完全通过 Chrome Gemini Nano 在本机上运行。学生的任何问题、答案或语音输入都不会离开本设备，绝不上云。',
    activateBtn: '✅ 开启隐私 AI',
    ecoBtn: '🌱 保持省电模式',
    californiaNotice: '加利福尼亚 (CAADCA 与 SOPIPA)：零学生数据采集与出售，完全离线运行。',
    indiaNotice: '印度 (DPDP 法案第 5(3) 条)：完全在端侧本地运行，不向任何云端实体上传儿童个人信息。',
    deviceReadyText: '设备就绪 (Prompt API 已启用)',
    deviceDownloadText: '硬件支持 (将在本地下载模型)',
    deviceUnsupportedText: '标准课程规则模式 (Chromebook / Chrome 128+)',
    statusOn: 'Nano AI: 已开启',
    statusEco: 'Nano AI: 环保模式',
    activeSummary: '已激活：辅导完全在本地浏览器中运行，零云端数据外泄。',
    ecoSummary: '环保模式：使用预编译课程规则。开启 Nano 即可享受苏格拉底式互动辅导。',
  },
};

export function getComplianceCaveat(langCode: string): ComplianceCaveat {
  return COMPLIANCE_CAVEATS[langCode] || COMPLIANCE_CAVEATS.en;
}
