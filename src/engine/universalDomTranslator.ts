// src/engine/universalDomTranslator.ts
import {
  SUPPORTED_LANGUAGES,
  getSavedLanguage,
  listenToLanguageChange,
  setSavedLanguage,
} from './operational-language';
import { translateText, speakInLanguage } from './translationService';

// WeakMap storing original English text of DOM text nodes for 100% fidelity restoration
const ORIGINAL_TEXT_NODES = new WeakMap<Text, string>();
const TRANSLATED_TEXT_NODES = new WeakMap<Text, { lang: string; text: string }>();

// Comprehensive educational dictionary for instant zero-latency universal UI translation
export const UNIVERSAL_UI_LEXICON: Record<string, Record<string, string>> = {
  "St Joseph's": {
    es: "San José",
    fr: "Saint-Joseph",
    de: "St. Joseph",
    pl: "Św. Józefa",
    uk: "Святого Йосипа",
    ar: "سانت جوزيف",
    ur: "سینٹ جوزف",
    bn: "সেন্ট জোসেফ",
    hi: "सेंट जोसेफ",
    zh: "圣约瑟夫",
  },
  "St Joseph's Interactive Learning Portal": {
    es: "Portal de Aprendizaje Interactivo San José",
    fr: "Portail d'Apprentissage Interactif Saint-Joseph",
    de: "St. Joseph Interaktives Lernportal",
    pl: "Interaktywny Portal Edukacyjny Św. Józefa",
    uk: "Інтерактивний Навчальний Портал Святого Йосипа",
    ar: "بوابة سانت جوزيف للتعلم التفاعلي",
    ur: "سینٹ جوزف انٹرایکٹو لرننگ پورٹل",
    bn: "সেন্ট জোসেফ ইন্টারেক্টিভ লার্নিং পোর্টাল",
    hi: "सेंट जोसेफ इंटरैक्टिव लर्निंग पोर्टल",
    zh: "圣约瑟夫互动学习平台",
  },
  "Adaptive Practice Lab": {
    es: "Laboratorio de Práctica Adaptativo",
    fr: "Laboratoire de Pratique Adaptatif",
    de: "Adaptives Übungslabor",
    pl: "Adaptacyjne Laboratorium Ćwiczeń",
    uk: "Адаптивна Практична Лабораторія",
    ar: "مختبر تدريب تكيّفي",
    ur: "انکولی مشق کی لیب",
    bn: "অভিযোজিত অনুশীলন ল্যাব",
    hi: "अनुकूली अभ्यास प्रयोगशाला",
    zh: "自适应实践实验室",
  },
  "Prof. Turing Socratic Tutor": {
    es: "Tutor Socrático Prof. Turing",
    fr: "Tuteur Socratique Prof. Turing",
    de: "Sokratischer Tutor Prof. Turing",
    pl: "Sokratejski Korepetytor Prof. Turing",
    uk: "Сократівський Репетитор Проф. Тюрінг",
    ar: "المعلم السقراطي البروفيسور تورينج",
    ur: "پروفیسر ٹیورنگ سقراطی ٹیوٹر",
    bn: "প্রফেসর টিউরিং সক্রেটিক শিক্ষক",
    hi: "प्रोफेसर ट्यूरिंग सुकराती शिक्षक",
    zh: "图灵教授苏格拉底式导师",
  },
  "Deterministic Guardrails": {
    es: "Barreras Deterministas",
    fr: "Garde-fous Déterministes",
    de: "Deterministische Leitplanken",
    pl: "Deterministyczne Bariery Ochronne",
    uk: "Детерміновані Захисні Бар'єри",
    ar: "حواجز وقائية حتمية",
    ur: "حتمی حفاظتی تدابیر",
    bn: "নির্ধারিত সুরক্ষা ব্যবস্থা",
    hi: "निश्चित सुरक्षा दिशानिर्देश",
    zh: "确定性防护栏",
  },
  "Practice Lab": {
    es: "Laboratorio de Práctica",
    fr: "Laboratoire de Pratique",
    de: "Übungslabor",
    pl: "Laboratorium Ćwiczeń",
    uk: "Практична Лабораторія",
    ar: "مختبر التدريب",
    ur: "مشق کی لیب",
    bn: "অনুশীলন ল্যাব",
    hi: "अभ्यास प्रयोगशाला",
    zh: "练习实验室",
  },
  "Learning Zone": {
    es: "Zona de Aprendizaje",
    fr: "Zone d'Apprentissage",
    de: "Lernbereich",
    pl: "Strefa Nauki",
    uk: "Зона Навчання",
    ar: "منطقة التعلم",
    ur: "سیکھنے کا زون",
    bn: "শেখার অঞ্চল",
    hi: "अध्ययन क्षेत्र",
    zh: "学习区",
  },
  "Learner Profile": {
    es: "Perfil del Estudiante",
    fr: "Profil de l'Élève",
    de: "Schülerprofil",
    pl: "Profil Ucznia",
    uk: "Профіль Учня",
    ar: "ملف المتعلم",
    ur: "طالب علم کا پروفائل",
    bn: "শিক্ষার্থীর প্রোফাইল",
    hi: "शिक्षार्थी प्रोफ़ाइल",
    zh: "学习者档案",
  },
  "Settings": {
    es: "Configuración",
    fr: "Paramètres",
    de: "Einstellungen",
    pl: "Ustawienia",
    uk: "Налаштування",
    ar: "الإعدادات",
    ur: "ترتیبات",
    bn: "সেটিংস",
    hi: "सेटिंग्स",
    zh: "设置",
  },
  "News": {
    es: "Noticias",
    fr: "Actualités",
    de: "Neuigkeiten",
    pl: "Aktualności",
    uk: "Новини",
    ar: "الأخبار",
    ur: "خبریں",
    bn: "সংবাদ",
    hi: "समाचार",
    zh: "新闻",
  },
  "What We Offer": {
    es: "Lo Que Ofrecemos",
    fr: "Ce Que Nous Proposons",
    de: "Unser Angebot",
    pl: "Co Oferujemy",
    uk: "Що Ми Пропонуємо",
    ar: "ما نقدمه",
    ur: "ہم کیا پیش کرتے ہیں",
    bn: "আমরা যা অফার করি",
    hi: "हम क्या प्रदान करते हैं",
    zh: "我们提供的服务",
  },
  "Generate Lesson": {
    es: "Generar Lección",
    fr: "Générer la Leçon",
    de: "Lektion Erstellen",
    pl: "Generuj Lekcję",
    uk: "Створити Урок",
    ar: "إنشاء درس",
    ur: "سبق بنائیں",
    bn: "পাঠ তৈরি করুন",
    hi: "पाठ तैयार करें",
    zh: "生成课程",
  },
  "Compiling...": {
    es: "Compilando...",
    fr: "Compilation...",
    de: "Kompiliere...",
    pl: "Kompilowanie...",
    uk: "Компіляція...",
    ar: "جارٍ التحضير...",
    ur: "تیاری جاری ہے...",
    bn: "সংকলন হচ্ছে...",
    hi: "तैयार हो रहा है...",
    zh: "正在编译...",
  },
  "Interactive Practice Lab": {
    es: "Laboratorio de Práctica Interactivo",
    fr: "Laboratoire de Pratique Interactif",
    de: "Interaktives Übungslabor",
    pl: "Interaktywne Laboratorium Ćwiczeń",
    uk: "Інтерактивна Практична Лабораторія",
    ar: "مختبر تدريب تفاعلي",
    ur: "انٹرایکٹو پریکٹس لیب",
    bn: "ইন্টারেক্টিভ অনুশীলন ল্যাব",
    hi: "इंटरैक्टिव अभ्यास प्रयोगशाला",
    zh: "互动实践实验室",
  },
  "Curriculum Learning Zone": {
    es: "Zona de Aprendizaje Curricular",
    fr: "Zone d'Apprentissage Curriculaire",
    de: "Lehrplan-Lernbereich",
    pl: "Strefa Nauki Programowej",
    uk: "Зона Вивчення Навчальної Програми",
    ar: "منطقة تعلم المنهج الدراسي",
    ur: "نصاب سیکھنے کا زون",
    bn: "পাঠ্যক্রম শেখার অঞ্চল",
    hi: "पाठ्यक्रम अध्ययन क्षेत्र",
    zh: "课程学习区",
  },
  "Read Aloud": {
    es: "Leer en Voz Alta",
    fr: "Lire à Haute Voix",
    de: "Vorlesen",
    pl: "Czytaj na Głos",
    uk: "Читати Вголос",
    ar: "قراءة بصوت عالٍ",
    ur: "بلند آواز میں پڑھیں",
    bn: "জোরে পড়ুন",
    hi: "ज़ोर से पढ़ें",
    zh: "大声朗读",
  },
  "Expand Full Lesson (AI)": {
    es: "Ampliar Lección Completa (IA)",
    fr: "Développer la Leçon Complète (IA)",
    de: "Vollständige Lektion Erweitern (KI)",
    pl: "Rozwiń Pełną Lekcję (AI)",
    uk: "Розгорнути Повний Урок (ШІ)",
    ar: "توسيع الدرس بالكامل (ذكاء اصطناعي)",
    ur: "مکمل سبق پھیلائیں (AI)",
    bn: "সম্পূর্ণ পাঠ প্রসারিত করুন (AI)",
    hi: "पूरा पाठ विस्तार से देखें (AI)",
    zh: "展开完整课程 (AI)",
  },
  "Test in Practice Lab": {
    es: "Probar en Laboratorio de Práctica",
    fr: "Tester dans le Laboratoire",
    de: "Im Übungslabor Testen",
    pl: "Testuj w Laboratorium",
    uk: "Перевірити в Лабораторії",
    ar: "اختبار في مختبر التدريب",
    ur: "پریکٹس لیب میں ٹیسٹ کریں",
    bn: "অনুশীলন ল্যাবে পরীক্ষা করুন",
    hi: "अभ्यास लैब में परीक्षण करें",
    zh: "在实践实验室测试",
  },
  "Core Axiom": {
    es: "Axioma Central",
    fr: "Axiome Principal",
    de: "Kernaxiom",
    pl: "Główny Aksjomat",
    uk: "Основна Аксіома",
    ar: "المبدأ الأساسي",
    ur: "بنیادی اصول",
    bn: "মূল স্বতঃসিদ্ধ",
    hi: "मूल सिद्धांत",
    zh: "核心公理",
  },
  "Cognitive Trap (Common Error)": {
    es: "Trampa Cognitiva (Error Común)",
    fr: "Piège Cognitif (Erreur Courante)",
    de: "Denkfalle (Häufiger Fehler)",
    pl: "Pułapka Poznawcza (Częsty Błąd)",
    uk: "Когнітивна Пастка (Поширена Помилка)",
    ar: "فخ معرفي (خطأ شائع)",
    ur: "علمی غلط فہمی (عام غلطی)",
    bn: "জ্ঞানীয় ফাঁদ (সাধারণ ভুল)",
    hi: "संज्ञानात्मक जाल (सामान्य त्रुटि)",
    zh: "认知陷阱 (常见错误)",
  },
  "Structured Lesson Steps": {
    es: "Pasos Estructurados de la Lección",
    fr: "Étapes Structurées de la Leçon",
    de: "Strukturierte Lektionsschritte",
    pl: "Ustrukturyzowane Kroki Lekcji",
    uk: "Структуровані Кроки Уроку",
    ar: "خطوات الدرس المنهجية",
    ur: "سبق کے منظم مراحل",
    bn: "পাঠের কাঠামোগত পদক্ষেপ",
    hi: "पाठ के संरचित चरण",
    zh: "结构化课程步骤",
  },
  "Step 1: Inquiry Hook": {
    es: "Paso 1: Pregunta Disparadora",
    fr: "Étape 1 : Accroche d'Enquête",
    de: "Schritt 1: Einführende Frage",
    pl: "Krok 1: Wprowadzenie i Pytanie",
    uk: "Крок 1: Дослідницький Гачок",
    ar: "الخطوة 1: مدخل استكشافي",
    ur: "مرحلہ 1: تحقیقی آغاز",
    bn: "ধাপ ১: অনুসন্ধানী সূচনা",
    hi: "चरण 1: अन्वेषण बिंदु",
    zh: "步骤 1: 探究引子",
  },
  "Step 2: Guided Practice & Activity": {
    es: "Paso 2: Práctica Guiada y Actividad",
    fr: "Étape 2 : Pratique Guidée et Activité",
    de: "Schritt 2: Angeleitete Übung & Aktivität",
    pl: "Krok 2: Ćwiczenia z Przewodnikiem",
    uk: "Крок 2: Керована Практика та Завдання",
    ar: "الخطوة 2: تدريب موجه ونشاط",
    ur: "مرحلہ 2: رہنمائی کے ساتھ مشق و سرگرمی",
    bn: "ধাপ ২: নির্দেশিত অনুশীলন এবং কার্যকলাপ",
    hi: "चरण 2: निर्देशित अभ्यास और गतिविधि",
    zh: "步骤 2: 引导式练习与活动",
  },
  "Step 3: Socratic Check for Understanding": {
    es: "Paso 3: Verificación Socrática de Comprensión",
    fr: "Étape 3 : Vérification Socratique de la Compréhension",
    de: "Schritt 3: Sokratische Verständnisprüfung",
    pl: "Krok 3: Sokratejskie Sprawdzenie Zrozumienia",
    uk: "Крок 3: Сократівська Перевірка Розуміння",
    ar: "الخطوة 3: فحص سقراطي للفهم",
    ur: "مرحلہ 3: تفہیم کی سقراطی جانچ",
    bn: "ধাপ ৩: বোঝার সক্রেটিক যাচাইকরণ",
    hi: "चरण 3: समझ की सुकराती जाँच",
    zh: "步骤 3: 苏格拉底式理解检查",
  },
  "Synthesized Comprehensive Lesson": {
    es: "Lección Integral Sintetizada",
    fr: "Leçon Complète Synthétisée",
    de: "Synthetisierte Umfassende Lektion",
    pl: "Zsyntetyzowana Kompleksowa Lekcja",
    uk: "Синтезований Повний Урок",
    ar: "درس شامل مُركّب",
    ur: "جامع تیار کردہ سبق",
    bn: "সমন্বিত বিস্তৃত পাঠ",
    hi: "संश्लेषित व्यापक पाठ",
    zh: "综合生成课程",
  },
  "Key Stage": {
    es: "Etapa Clave",
    fr: "Cycle Scolaire",
    de: "Schulstufe",
    pl: "Etap Edukacyjny",
    uk: "Ключовий Етап",
    ar: "المرحلة الدراسية",
    ur: "تعلیمی مرحلہ",
    bn: "মূল পর্যায়",
    hi: "मुख्य चरण",
    zh: "关键学段",
  },
  "Subject": {
    es: "Materia",
    fr: "Matière",
    de: "Fach",
    pl: "Przedmiot",
    uk: "Предмет",
    ar: "المادة",
    ur: "مضمون",
    bn: "বিষয়",
    hi: "विषय",
    zh: "科目",
  },
  "Unit": {
    es: "Unidad",
    fr: "Unité",
    de: "Einheit",
    pl: "Jednostka",
    uk: "Розділ",
    ar: "الوحدة",
    ur: "یونٹ",
    bn: "একক",
    hi: "इकाई",
    zh: "单元",
  },
  "Mathematics": {
    es: "Matemáticas",
    fr: "Mathématiques",
    de: "Mathematik",
    pl: "Matematyka",
    uk: "Математика",
    ar: "الرياضيات",
    ur: "ریاضی",
    bn: "গণিত",
    hi: "गणित",
    zh: "数学",
  },
  "Science": {
    es: "Ciencias",
    fr: "Sciences",
    de: "Naturwissenschaften",
    pl: "Nauki Przyrodnicze",
    uk: "Природничі Науки",
    ar: "العلوم",
    ur: "سائنس",
    bn: "বিজ্ঞান",
    hi: "विज्ञान",
    zh: "科学",
  },
  "Computing": {
    es: "Informática",
    fr: "Informatique",
    de: "Informatik",
    pl: "Informatyka",
    uk: "Інформатика",
    ar: "الحوسبة",
    ur: "کمپیوٹنگ",
    bn: "কম্পিউটিং",
    hi: "कंप्यूटिंग",
    zh: "计算机科学",
  },
  "History": {
    es: "Historia",
    fr: "Histoire",
    de: "Geschichte",
    pl: "Historia",
    uk: "Історія",
    ar: "التاريخ",
    ur: "تاریخ",
    bn: "ইতিহাস",
    hi: "इतिहास",
    zh: "历史",
  },
  "Geography": {
    es: "Geografía",
    fr: "Géographie",
    de: "Geografie",
    pl: "Geografia",
    uk: "Географія",
    ar: "الجغرافيا",
    ur: "جغرافیہ",
    bn: "ভূগোল",
    hi: "भूगोल",
    zh: "地理",
  },
  "English": {
    es: "Inglés",
    fr: "Anglais",
    de: "Englisch",
    pl: "Język Angielski",
    uk: "Англійська Мова",
    ar: "اللغة الإنجليزية",
    ur: "انگریزی",
    bn: "ইংরেজি",
    hi: "अंग्रेजी",
    zh: "英语",
  },
  "Score": {
    es: "Puntuación",
    fr: "Score",
    de: "Punktzahl",
    pl: "Wynik",
    uk: "Рахунок",
    ar: "النتيجة",
    ur: "اسکور",
    bn: "স্কোর",
    hi: "स्कोर",
    zh: "得分",
  },
  "Streak": {
    es: "Racha",
    fr: "Série",
    de: "Serie",
    pl: "Seria",
    uk: "Серія",
    ar: "التتابع",
    ur: "مسلسل اسکور",
    bn: "ধারাবাহিকতা",
    hi: "सिलसिला",
    zh: "连胜",
  },
  "Difficulty": {
    es: "Dificultad",
    fr: "Difficulté",
    de: "Schwierigkeit",
    pl: "Poziom Trudności",
    uk: "Рівень Складності",
    ar: "مستوى الصعوبة",
    ur: "مشکل کا درجہ",
    bn: "কঠিনতার স্তর",
    hi: "कठिनाई स्तर",
    zh: "难度",
  },
  "Warmup": {
    es: "Calentamiento",
    fr: "Échauffement",
    de: "Aufwärmen",
    pl: "Rozgrzewka",
    uk: "Розминка",
    ar: "إحماء",
    ur: "ابتدائی مشق",
    bn: "ওয়ার্ম-আপ",
    hi: "अभ्यास शुरुआत",
    zh: "热身",
  },
  "Challenger": {
    es: "Desafío",
    fr: "Défi",
    de: "Herausforderer",
    pl: "Wyzwanie",
    uk: "Виклик",
    ar: "المتحدي",
    ur: "چیلنجر",
    bn: "চ্যালেঞ্জার",
    hi: "चैलेंजर",
    zh: "挑战",
  },
  "Brainbuster": {
    es: "Rompecabezas",
    fr: "Casse-Tête",
    de: "Gehirnjogging",
    pl: "Łamigłówka",
    uk: "Головоломка",
    ar: "اختبار العباقرة",
    ur: "ذہنی آزمائش",
    bn: "মগজ ধোলাই",
    hi: "दिमागी कसरत",
    zh: "高难度烧脑",
  },
  "Show Original": {
    es: "Ver Original",
    fr: "Voir l'Original",
    de: "Original Anzeigen",
    pl: "Pokaż Oryginał",
    uk: "Показати Оригінал",
    ar: "عرض الأصل",
    ur: "اصل دیکھیں",
    bn: "মূল দেখুন",
    hi: "मूल देखें",
    zh: "显示原版",
  },
  "Show Translated": {
    es: "Ver Traducido",
    fr: "Voir Traduit",
    de: "Übersetzung Anzeigen",
    pl: "Pokaż Tłumaczenie",
    uk: "Показати Переклад",
    ar: "عرض المترجم",
    ur: "ترجمہ دیکھیں",
    bn: "অনূদিত দেখুন",
    hi: "अनुवादित देखें",
    zh: "显示翻译",
  },
  "Translate Portal": {
    es: "Traducir Portal",
    fr: "Traduire le Portail",
    de: "Portal Übersetzen",
    pl: "Przetłumacz Portal",
    uk: "Перекласти Портал",
    ar: "ترجمة البوابة",
    ur: "پورٹل کا ترجمہ کریں",
    bn: "পোর্টাল অনুবাদ করুন",
    hi: "पोर्टल का अनुवाद करें",
    zh: "翻译整个平台",
  },
};

// Elements to strictly ignore during DOM tree traversal
const IGNORED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'CODE',
  'PRE',
  'TEXTAREA',
  'SVG',
  'NOSCRIPT',
  'IFRAME',
]);

let isUniversalTranslationRunning = false;
let universalObserver: MutationObserver | null = null;
let currentActiveTargetLang = 'en';

/**
 * Checks if an element or its ancestor has opted out of translation
 */
function isExcludedFromTranslation(node: Node): boolean {
  let parent = node.parentElement;
  while (parent) {
    if (
      IGNORED_TAGS.has(parent.tagName) ||
      parent.classList.contains('notranslate') ||
      parent.getAttribute('translate') === 'no' ||
      parent.hasAttribute('data-no-translate') ||
      parent.id === 'universal-translator-bar'
    ) {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}

/**
 * Looks up direct lexicon match with trimmed case-insensitivity
 */
function getLexiconTranslation(text: string, targetLang: string): string | null {
  const trimmed = text.trim();
  if (UNIVERSAL_UI_LEXICON[trimmed] && UNIVERSAL_UI_LEXICON[trimmed][targetLang]) {
    return UNIVERSAL_UI_LEXICON[trimmed][targetLang];
  }

  // Case insensitive match
  const lower = trimmed.toLowerCase();
  for (const [key, mapping] of Object.entries(UNIVERSAL_UI_LEXICON)) {
    if (key.toLowerCase() === lower && mapping[targetLang]) {
      return mapping[targetLang];
    }
  }

  return null;
}

/**
 * Universal DOM Translator: walks through all visible text nodes in the page,
 * stores the original English string, and replaces it with the translated version.
 */
export async function translatePageDOM(targetLang: string): Promise<void> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  currentActiveTargetLang = targetLang;

  // Apply Direction & HTML attributes
  const isRTL = targetLang === 'ar' || targetLang === 'ur';
  document.documentElement.lang = targetLang;
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

  // If returning to English, restore all nodes from the WeakMap
  if (!targetLang || targetLang === 'en') {
    restorePageDOM();
    return;
  }

  if (isUniversalTranslationRunning) return;
  isUniversalTranslationRunning = true;

  try {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (isExcludedFromTranslation(node)) {
            return NodeFilter.FILTER_REJECT;
          }
          const val = node.nodeValue?.trim();
          // Filter out empty spaces, numbers only, or single punctuation
          if (!val || /^[0-9\s.,!?:;()[\]{}<>=+\-*\/%&|^~$#@]+$/.test(val)) {
            return NodeFilter.FILTER_SKIP;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    const textNodesToTranslate: Text[] = [];
    let currentNode: Node | null = walker.nextNode();
    while (currentNode) {
      textNodesToTranslate.push(currentNode as Text);
      currentNode = walker.nextNode();
    }

    // Process nodes in fast chunks to avoid UI stutter
    const batchSize = 25;
    for (let i = 0; i < textNodesToTranslate.length; i += batchSize) {
      const batch = textNodesToTranslate.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (textNode) => {
          try {
            if (!textNode.parentElement) return;

            // Save original English text if not already saved
            if (!ORIGINAL_TEXT_NODES.has(textNode)) {
              ORIGINAL_TEXT_NODES.set(textNode, textNode.nodeValue || '');
            }

            const originalText = ORIGINAL_TEXT_NODES.get(textNode) || textNode.nodeValue || '';
            const trimmed = originalText.trim();
            if (!trimmed || trimmed.length < 2) return;

            // Check if already translated to this language
            const existing = TRANSLATED_TEXT_NODES.get(textNode);
            if (existing && existing.lang === targetLang) {
              return;
            }

            // 1. Instant dictionary lookup
            const dictMatch = getLexiconTranslation(trimmed, targetLang);
            if (dictMatch) {
              // Preserve surrounding whitespace
              const leadingSpace = originalText.match(/^\s*/)?.[0] || '';
              const trailingSpace = originalText.match(/\s*$/)?.[0] || '';
              textNode.nodeValue = `${leadingSpace}${dictMatch}${trailingSpace}`;
              TRANSLATED_TEXT_NODES.set(textNode, { lang: targetLang, text: dictMatch });
              return;
            }

            // 2. High-speed multi-tier translation
            const translated = await translateText(trimmed, targetLang, 'en');
            if (translated && translated !== trimmed) {
              const leadingSpace = originalText.match(/^\s*/)?.[0] || '';
              const trailingSpace = originalText.match(/\s*$/)?.[0] || '';
              textNode.nodeValue = `${leadingSpace}${translated}${trailingSpace}`;
              TRANSLATED_TEXT_NODES.set(textNode, { lang: targetLang, text: translated });
            }
          } catch {
            // Keep original text
          }
        })
      );
    }
  } catch (err) {
    console.warn('[Universal Translator Error]:', err);
  } finally {
    isUniversalTranslationRunning = false;
  }
}

/**
 * Restores all text nodes back to their original English text.
 */
export function restorePageDOM(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
  currentActiveTargetLang = 'en';

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        return ORIGINAL_TEXT_NODES.has(node as Text)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    }
  );

  let currentNode: Node | null = walker.nextNode();
  while (currentNode) {
    const textNode = currentNode as Text;
    const original = ORIGINAL_TEXT_NODES.get(textNode);
    if (original !== undefined) {
      textNode.nodeValue = original;
    }
    currentNode = walker.nextNode();
  }
}

/**
 * Starts a persistent MutationObserver so dynamically mounted elements
 * or route changes are automatically translated in real-time.
 */
export function enableUniversalObserver(targetLang: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (universalObserver) {
    universalObserver.disconnect();
    universalObserver = null;
  }

  if (!targetLang || targetLang === 'en') return;

  let debounceTimer: any = null;
  universalObserver = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      translatePageDOM(targetLang);
    }, 250);
  });

  universalObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Read the main content of the current active page aloud in the selected language.
 */
export function speakCurrentPage(targetLang: string): void {
  if (typeof window === 'undefined') return;

  const main = document.querySelector('main') || document.body;
  const headings = Array.from(main.querySelectorAll('h1, h2, h3, p'))
    .slice(0, 6)
    .map((el) => el.textContent?.trim() || '')
    .filter((txt) => txt.length > 5)
    .join('. ');

  if (headings) {
    speakInLanguage(headings, targetLang);
  }
}
