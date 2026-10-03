// src/data/phonicsCurriculumData.ts
/**
 * UK DfE Systematic Synthetic Phonics (SSP) Curriculum Data
 * Letters & Sounds Framework: Phases 2 to 5, Sound Buttons, Tricky Words,
 * and the Statutory Year 1 Phonics Screening Check.
 */

export interface PhonicGrapheme {
  id: string;
  grapheme: string;
  phonemeIPA: string;
  soundAudioText: string;
  mouthTip: string;
  exampleWord: string;
  exampleIcon: string;
  phase: 2 | 3 | 4 | 5;
  set: string;
  type: 'single' | 'digraph' | 'trigraph' | 'split-digraph' | 'cluster';
}

export interface SoundSegment {
  letters: string;
  type: 'single' | 'digraph' | 'trigraph' | 'split';
  soundHint: string;
}

export interface DecodableWord {
  word: string;
  phase: 2 | 3 | 4 | 5;
  category: string;
  segments: SoundSegment[];
  icon?: string;
}

export interface ScreeningWord {
  id: string;
  word: string;
  isAlien: boolean;
  alienName?: string;
  alienAvatar?: string;
  phaseTarget: number;
  section: 1 | 2;
  segments: SoundSegment[];
}

export interface TrickyWord {
  id: string;
  word: string;
  phase: 2 | 3 | 4 | 5;
  trickyPart: string;
  trickyExplanation: string;
  exampleSentence: string;
}

export const PHONICS_GRAPHEMES: PhonicGrapheme[] = [
  // PHASE 2 (Reception Autumn)
  { id: 'p2-s', grapheme: 's', phonemeIPA: '/s/', soundAudioText: 'sss', mouthTip: 'Teeth gently together, tongue behind teeth, hiss like a soft snake.', exampleWord: 'sun', exampleIcon: '☀️', phase: 2, set: 'Set 1', type: 'single' },
  { id: 'p2-a', grapheme: 'a', phonemeIPA: '/æ/', soundAudioText: 'ah', mouthTip: 'Open mouth wide, tongue low, short crisp sound like crying baby.', exampleWord: 'ant', exampleIcon: '🐜', phase: 2, set: 'Set 1', type: 'single' },
  { id: 'p2-t', grapheme: 't', phonemeIPA: '/t/', soundAudioText: 't', mouthTip: 'Tip of tongue taps top teeth ridge with unvoiced crisp puff.', exampleWord: 'tap', exampleIcon: '🚰', phase: 2, set: 'Set 1', type: 'single' },
  { id: 'p2-p', grapheme: 'p', phonemeIPA: '/p/', soundAudioText: 'p', mouthTip: 'Press lips together then pop open without your voice box.', exampleWord: 'pan', exampleIcon: '🍳', phase: 2, set: 'Set 1', type: 'single' },
  
  { id: 'p2-i', grapheme: 'i', phonemeIPA: '/ɪ/', soundAudioText: 'ih', mouthTip: 'Smile gently, mouth slightly open, short sharp vowel sound.', exampleWord: 'ink', exampleIcon: '🖋️', phase: 2, set: 'Set 2', type: 'single' },
  { id: 'p2-n', grapheme: 'n', phonemeIPA: '/n/', soundAudioText: 'nnn', mouthTip: 'Tongue on roof of mouth, air flows out your nose like a model plane.', exampleWord: 'net', exampleIcon: '🥅', phase: 2, set: 'Set 2', type: 'single' },
  { id: 'p2-m', grapheme: 'm', phonemeIPA: '/m/', soundAudioText: 'mmm', mouthTip: 'Lips together, hum delicious sound like yummy food.', exampleWord: 'map', exampleIcon: '🗺️', phase: 2, set: 'Set 2', type: 'single' },
  { id: 'p2-d', grapheme: 'd', phonemeIPA: '/d/', soundAudioText: 'd', mouthTip: 'Voice on, tongue taps upper teeth ridge like tapping a little drum.', exampleWord: 'dog', exampleIcon: '🐶', phase: 2, set: 'Set 2', type: 'single' },

  { id: 'p2-g', grapheme: 'g', phonemeIPA: '/ɡ/', soundAudioText: 'g', mouthTip: 'Back of tongue touches soft palate at back of throat, clean gulp.', exampleWord: 'gap', exampleIcon: '🚪', phase: 2, set: 'Set 3', type: 'single' },
  { id: 'p2-o', grapheme: 'o', phonemeIPA: '/ɒ/', soundAudioText: 'oh', mouthTip: 'Round lips into a circular shape, short crisp orange sound.', exampleWord: 'pot', exampleIcon: '🍲', phase: 2, set: 'Set 3', type: 'single' },
  { id: 'p2-c', grapheme: 'c', phonemeIPA: '/k/', soundAudioText: 'k', mouthTip: 'Click at back of throat without voice box like clicking castanets.', exampleWord: 'cat', exampleIcon: '🐱', phase: 2, set: 'Set 3', type: 'single' },
  { id: 'p2-k', grapheme: 'k', phonemeIPA: '/k/', soundAudioText: 'k', mouthTip: 'Same pure sound as c, sharp back click.', exampleWord: 'kit', exampleIcon: '🧰', phase: 2, set: 'Set 3', type: 'single' },

  { id: 'p2-ck', grapheme: 'ck', phonemeIPA: '/k/', soundAudioText: 'k', mouthTip: 'Two letters making one sound (digraph) at the end of short words.', exampleWord: 'duck', exampleIcon: '🦆', phase: 2, set: 'Set 4', type: 'digraph' },
  { id: 'p2-e', grapheme: 'e', phonemeIPA: '/e/', soundAudioText: 'eh', mouthTip: 'Open mouth medium, relaxed jaw like cracking an egg.', exampleWord: 'egg', exampleIcon: '🥚', phase: 2, set: 'Set 4', type: 'single' },
  { id: 'p2-u', grapheme: 'u', phonemeIPA: '/ʌ/', soundAudioText: 'uh', mouthTip: 'Short relaxed throat sound like opening an umbrella.', exampleWord: 'cup', exampleIcon: '☕', phase: 2, set: 'Set 4', type: 'single' },
  { id: 'p2-r', grapheme: 'r', phonemeIPA: '/r/', soundAudioText: 'rrr', mouthTip: 'Curl tongue tip up without touching roof of mouth, roar like a puppy.', exampleWord: 'run', exampleIcon: '🏃', phase: 2, set: 'Set 4', type: 'single' },

  { id: 'p2-h', grapheme: 'h', phonemeIPA: '/h/', soundAudioText: 'h', mouthTip: 'Breathe hot air out onto your hand, whisper breathing.', exampleWord: 'hat', exampleIcon: '🎩', phase: 2, set: 'Set 5', type: 'single' },
  { id: 'p2-b', grapheme: 'b', phonemeIPA: '/b/', soundAudioText: 'b', mouthTip: 'Voice on, press lips then release with little bounce.', exampleWord: 'bat', exampleIcon: '🏏', phase: 2, set: 'Set 5', type: 'single' },
  { id: 'p2-f', grapheme: 'f', phonemeIPA: '/f/', soundAudioText: 'fff', mouthTip: 'Top teeth on bottom lip, blow gentle soft air.', exampleWord: 'fan', exampleIcon: '🪭', phase: 2, set: 'Set 5', type: 'single' },
  { id: 'p2-l', grapheme: 'l', phonemeIPA: '/l/', soundAudioText: 'lll', mouthTip: 'Tongue tip flat against front ridge, hum smooth sound like licking lollipop.', exampleWord: 'log', exampleIcon: '🪵', phase: 2, set: 'Set 5', type: 'single' },
  { id: 'p2-ss', grapheme: 'ss', phonemeIPA: '/s/', soundAudioText: 'sss', mouthTip: 'Double consonant at word end making one long clean sss sound.', exampleWord: 'hiss', exampleIcon: '🐍', phase: 2, set: 'Set 5', type: 'digraph' },

  // PHASE 3 (Reception Spring & Summer)
  { id: 'p3-j', grapheme: 'j', phonemeIPA: '/dʒ/', soundAudioText: 'j', mouthTip: 'Tongue tip touches roof, pushes away with voice like bouncing jelly.', exampleWord: 'jam', exampleIcon: '🍓', phase: 3, set: 'Set 6', type: 'single' },
  { id: 'p3-v', grapheme: 'v', phonemeIPA: '/v/', soundAudioText: 'vvv', mouthTip: 'Top teeth on bottom lip, buzz your voice box like a driving van.', exampleWord: 'van', exampleIcon: '🚐', phase: 3, set: 'Set 6', type: 'single' },
  { id: 'p3-w', grapheme: 'w', phonemeIPA: '/w/', soundAudioText: 'w', mouthTip: 'Round lips into a tight small circle, blow wind outward.', exampleWord: 'web', exampleIcon: '🕸️', phase: 3, set: 'Set 6', type: 'single' },
  { id: 'p3-x', grapheme: 'x', phonemeIPA: '/ks/', soundAudioText: 'ks', mouthTip: 'Combination of /k/ + /s/ sounds in one rapid beat.', exampleWord: 'box', exampleIcon: '📦', phase: 3, set: 'Set 6', type: 'single' },
  { id: 'p3-y', grapheme: 'y', phonemeIPA: '/j/', soundAudioText: 'y', mouthTip: 'Sides of tongue touch upper molars, smile saying yellow.', exampleWord: 'yak', exampleIcon: '🐂', phase: 3, set: 'Set 7', type: 'single' },
  { id: 'p3-z', grapheme: 'z', phonemeIPA: '/z/', soundAudioText: 'zzz', mouthTip: 'Teeth together, voice buzzing like a busy bumblebee.', exampleWord: 'zip', exampleIcon: '🤐', phase: 3, set: 'Set 7', type: 'single' },
  { id: 'p3-qu', grapheme: 'qu', phonemeIPA: '/kw/', soundAudioText: 'kw', mouthTip: 'q always needs its friend u! Sounds like /k/ + /w/ duck quack.', exampleWord: 'queen', exampleIcon: '👑', phase: 3, set: 'Set 7', type: 'digraph' },

  // Phase 3 Consonant & Vowel Digraphs
  { id: 'p3-ch', grapheme: 'ch', phonemeIPA: '/tʃ/', soundAudioText: 'ch', mouthTip: 'Mouth rounded, stop sound then push out like a chuffing steam train.', exampleWord: 'chop', exampleIcon: '🪓', phase: 3, set: 'Digraphs', type: 'digraph' },
  { id: 'p3-sh', grapheme: 'sh', phonemeIPA: '/ʃ/', soundAudioText: 'sh', mouthTip: 'Lips forward in a trumpet shape, blow quiet sound like shushing baby.', exampleWord: 'ship', exampleIcon: '🚢', phase: 3, set: 'Digraphs', type: 'digraph' },
  { id: 'p3-th', grapheme: 'th', phonemeIPA: '/θ, ð/', soundAudioText: 'th', mouthTip: 'Tongue tip between front teeth. Soft (thumb 👍) or voiced (this 👈).', exampleWord: 'thumb', exampleIcon: '👍', phase: 3, set: 'Digraphs', type: 'digraph' },
  { id: 'p3-ng', grapheme: 'ng', phonemeIPA: '/ŋ/', soundAudioText: 'ng', mouthTip: 'Back of tongue against roof, air through nose like a ringing gong.', exampleWord: 'ring', exampleIcon: '💍', phase: 3, set: 'Digraphs', type: 'digraph' },

  { id: 'p3-ai', grapheme: 'ai', phonemeIPA: '/eɪ/', soundAudioText: 'ay', mouthTip: 'Open mouth then glide slightly closed saying "ay" as in rainy day.', exampleWord: 'rain', exampleIcon: '🌧️', phase: 3, set: 'Vowels', type: 'digraph' },
  { id: 'p3-ee', grapheme: 'ee', phonemeIPA: '/iː/', soundAudioText: 'ee', mouthTip: 'Big wide happy smile, stretch long "ee" sound like see the bee.', exampleWord: 'tree', exampleIcon: '🌳', phase: 3, set: 'Vowels', type: 'digraph' },
  { id: 'p3-igh', grapheme: 'igh', phonemeIPA: '/aɪ/', soundAudioText: 'eye', mouthTip: 'Three letters making one sound (trigraph)! Open wide and glide to eye.', exampleWord: 'night', exampleIcon: '🌙', phase: 3, set: 'Vowels', type: 'trigraph' },
  { id: 'p3-oa', grapheme: 'oa', phonemeIPA: '/əʊ/', soundAudioText: 'oh', mouthTip: 'Round lips gently as if surprised saying "oh" in the boat.', exampleWord: 'boat', exampleIcon: '⛵', phase: 3, set: 'Vowels', type: 'digraph' },
  { id: 'p3-oo-short', grapheme: 'oo (short)', phonemeIPA: '/ʊ/', soundAudioText: 'oo', mouthTip: 'Short relaxed rounded lips like look in a good book.', exampleWord: 'book', exampleIcon: '📖', phase: 3, set: 'Vowels', type: 'digraph' },
  { id: 'p3-oo-long', grapheme: 'oo (long)', phonemeIPA: '/uː/', soundAudioText: 'ooo', mouthTip: 'Long pushed-forward lips like zoom to the moon.', exampleWord: 'moon', exampleIcon: '🌕', phase: 3, set: 'Vowels', type: 'digraph' },
  { id: 'p3-ar', grapheme: 'ar', phonemeIPA: '/ɑː/', soundAudioText: 'ar', mouthTip: 'Open mouth wide for doctor saying "ah" like a pirate star.', exampleWord: 'star', exampleIcon: '⭐', phase: 3, set: 'Vowels', type: 'digraph' },
  { id: 'p3-or', grapheme: 'or', phonemeIPA: '/ɔː/', soundAudioText: 'or', mouthTip: 'Round open lips like a horn blowing loud.', exampleWord: 'fork', exampleIcon: '🍴', phase: 3, set: 'Vowels', type: 'digraph' },
  { id: 'p3-ur', grapheme: 'ur', phonemeIPA: '/ɜː/', soundAudioText: 'er', mouthTip: 'Relaxed middle tongue like a purring kitten with fur.', exampleWord: 'surf', exampleIcon: '🏄', phase: 3, set: 'Vowels', type: 'digraph' },
  { id: 'p3-ow', grapheme: 'ow', phonemeIPA: '/aʊ/', soundAudioText: 'ow', mouthTip: 'Open wide then purse tight saying "ow" brown cow.', exampleWord: 'cow', exampleIcon: '🐮', phase: 3, set: 'Vowels', type: 'digraph' },
  { id: 'p3-oi', grapheme: 'oi', phonemeIPA: '/ɔɪ/', soundAudioText: 'oy', mouthTip: 'Round lips then glide to smile, boil the oil.', exampleWord: 'coin', exampleIcon: '🪙', phase: 3, set: 'Vowels', type: 'digraph' },
  { id: 'p3-ear', grapheme: 'ear', phonemeIPA: '/ɪə/', soundAudioText: 'ear', mouthTip: 'Glide from short i to soft schwa like hear with your ear.', exampleWord: 'hear', exampleIcon: '👂', phase: 3, set: 'Vowels', type: 'trigraph' },
  { id: 'p3-air', grapheme: 'air', phonemeIPA: '/eə/', soundAudioText: 'air', mouthTip: 'Glide from e to schwa like flying through the air.', exampleWord: 'chair', exampleIcon: '🪑', phase: 3, set: 'Vowels', type: 'trigraph' },
  { id: 'p3-er', grapheme: 'er', phonemeIPA: '/ə/', soundAudioText: 'er', mouthTip: 'Soft unaccented final sound like hammer and ladder.', exampleWord: 'ladder', exampleIcon: '🪜', phase: 3, set: 'Vowels', type: 'digraph' },

  // PHASE 5 (Year 1 New Graphemes & Split Digraphs)
  { id: 'p5-ay', grapheme: 'ay', phonemeIPA: '/eɪ/', soundAudioText: 'ay', mouthTip: 'Alternative spelling for /ai/ found at the end of words like play.', exampleWord: 'play', exampleIcon: '🛝', phase: 5, set: 'Alternatives', type: 'digraph' },
  { id: 'p5-ou', grapheme: 'ou', phonemeIPA: '/aʊ/', soundAudioText: 'ow', mouthTip: 'Alternative spelling for /ow/ as in shout loud.', exampleWord: 'cloud', exampleIcon: '☁️', phase: 5, set: 'Alternatives', type: 'digraph' },
  { id: 'p5-ie', grapheme: 'ie', phonemeIPA: '/aɪ/', soundAudioText: 'eye', mouthTip: 'Alternative spelling for /igh/ like pie and tie.', exampleWord: 'pie', exampleIcon: '🥧', phase: 5, set: 'Alternatives', type: 'digraph' },
  { id: 'p5-ea', grapheme: 'ea', phonemeIPA: '/iː/', soundAudioText: 'ee', mouthTip: 'Alternative spelling for /ee/ as in cup of tea.', exampleWord: 'leaf', exampleIcon: '🍃', phase: 5, set: 'Alternatives', type: 'digraph' },
  { id: 'p5-oy', grapheme: 'oy', phonemeIPA: '/ɔɪ/', soundAudioText: 'oy', mouthTip: 'Alternative spelling for /oi/ at word end like a toy.', exampleWord: 'boy', exampleIcon: '👦', phase: 5, set: 'Alternatives', type: 'digraph' },
  { id: 'p5-ir', grapheme: 'ir', phonemeIPA: '/ɜː/', soundAudioText: 'er', mouthTip: 'Alternative spelling for /ur/ like twirl girl in a skirt.', exampleWord: 'bird', exampleIcon: '🐦', phase: 5, set: 'Alternatives', type: 'digraph' },
  { id: 'p5-ue', grapheme: 'ue', phonemeIPA: '/uː, juː/', soundAudioText: 'yoo', mouthTip: 'Blue glue or statue with a long /ue/ glide.', exampleWord: 'glue', exampleIcon: '🧪', phase: 5, set: 'Alternatives', type: 'digraph' },
  { id: 'p5-aw', grapheme: 'aw', phonemeIPA: '/ɔː/', soundAudioText: 'or', mouthTip: 'Alternative spelling for /or/ like paw on claw.', exampleWord: 'paw', exampleIcon: '🐾', phase: 5, set: 'Alternatives', type: 'digraph' },
  { id: 'p5-wh', grapheme: 'wh', phonemeIPA: '/w/', soundAudioText: 'w', mouthTip: 'Breathe softly through rounded lips for question words: what, when, where.', exampleWord: 'whale', exampleIcon: '🐋', phase: 5, set: 'Alternatives', type: 'digraph' },
  { id: 'p5-ph', grapheme: 'ph', phonemeIPA: '/f/', soundAudioText: 'f', mouthTip: 'Greek root spelling for /f/ like photo and dolphin.', exampleWord: 'dolphin', exampleIcon: '🐬', phase: 5, set: 'Alternatives', type: 'digraph' },

  // Split Digraphs (Magic e)
  { id: 'p5-a-e', grapheme: 'a-e', phonemeIPA: '/eɪ/', soundAudioText: 'ay', mouthTip: 'Split digraph: Magic e jumps over consonant to make letter a say its name!', exampleWord: 'cake', exampleIcon: '🎂', phase: 5, set: 'Split Digraphs', type: 'split-digraph' },
  { id: 'p5-e-e', grapheme: 'e-e', phonemeIPA: '/iː/', soundAudioText: 'ee', mouthTip: 'Split digraph: Makes the e long like Pete and these.', exampleWord: 'these', exampleIcon: '👉', phase: 5, set: 'Split Digraphs', type: 'split-digraph' },
  { id: 'p5-i-e', grapheme: 'i-e', phonemeIPA: '/aɪ/', soundAudioText: 'eye', mouthTip: 'Split digraph: Magic e makes the i say its own name!', exampleWord: 'time', exampleIcon: '⏰', phase: 5, set: 'Split Digraphs', type: 'split-digraph' },
  { id: 'p5-o-e', grapheme: 'o-e', phonemeIPA: '/əʊ/', soundAudioText: 'oh', mouthTip: 'Split digraph: Magic e makes the o say oh like home and stone.', exampleWord: 'home', exampleIcon: '🏡', phase: 5, set: 'Split Digraphs', type: 'split-digraph' },
  { id: 'p5-u-e', grapheme: 'u-e', phonemeIPA: '/uː, juː/', soundAudioText: 'yoo', mouthTip: 'Split digraph: Makes u say huge cube or flute.', exampleWord: 'cube', exampleIcon: '🧊', phase: 5, set: 'Split Digraphs', type: 'split-digraph' },
];

export const DECODABLE_WORDS: DecodableWord[] = [
  // Phase 2 CVC Words
  { word: 'cat', phase: 2, category: 'CVC Words', icon: '🐱', segments: [{ letters: 'c', type: 'single', soundHint: 'k' }, { letters: 'a', type: 'single', soundHint: 'ah' }, { letters: 't', type: 'single', soundHint: 't' }] },
  { word: 'dog', phase: 2, category: 'CVC Words', icon: '🐶', segments: [{ letters: 'd', type: 'single', soundHint: 'd' }, { letters: 'o', type: 'single', soundHint: 'oh' }, { letters: 'g', type: 'single', soundHint: 'g' }] },
  { word: 'sun', phase: 2, category: 'CVC Words', icon: '☀️', segments: [{ letters: 's', type: 'single', soundHint: 's' }, { letters: 'u', type: 'single', soundHint: 'uh' }, { letters: 'n', type: 'single', soundHint: 'n' }] },
  { word: 'pin', phase: 2, category: 'CVC Words', icon: '📍', segments: [{ letters: 'p', type: 'single', soundHint: 'p' }, { letters: 'i', type: 'single', soundHint: 'ih' }, { letters: 'n', type: 'single', soundHint: 'n' }] },
  { word: 'bed', phase: 2, category: 'CVC Words', icon: '🛏️', segments: [{ letters: 'b', type: 'single', soundHint: 'b' }, { letters: 'e', type: 'single', soundHint: 'eh' }, { letters: 'd', type: 'single', soundHint: 'd' }] },
  { word: 'duck', phase: 2, category: 'Digraph ck', icon: '🦆', segments: [{ letters: 'd', type: 'single', soundHint: 'd' }, { letters: 'u', type: 'single', soundHint: 'uh' }, { letters: 'ck', type: 'digraph', soundHint: 'k' }] },
  { word: 'bell', phase: 2, category: 'Double Consonant', icon: '🔔', segments: [{ letters: 'b', type: 'single', soundHint: 'b' }, { letters: 'e', type: 'single', soundHint: 'eh' }, { letters: 'll', type: 'digraph', soundHint: 'l' }] },

  // Phase 3 Digraph Words
  { word: 'ship', phase: 3, category: 'Digraph sh', icon: '🚢', segments: [{ letters: 'sh', type: 'digraph', soundHint: 'sh' }, { letters: 'i', type: 'single', soundHint: 'ih' }, { letters: 'p', type: 'single', soundHint: 'p' }] },
  { word: 'chip', phase: 3, category: 'Digraph ch', icon: '🍟', segments: [{ letters: 'ch', type: 'digraph', soundHint: 'ch' }, { letters: 'i', type: 'single', soundHint: 'ih' }, { letters: 'p', type: 'single', soundHint: 'p' }] },
  { word: 'ring', phase: 3, category: 'Digraph ng', icon: '💍', segments: [{ letters: 'r', type: 'single', soundHint: 'r' }, { letters: 'i', type: 'single', soundHint: 'ih' }, { letters: 'ng', type: 'digraph', soundHint: 'ng' }] },
  { word: 'moth', phase: 3, category: 'Digraph th', icon: '🦋', segments: [{ letters: 'm', type: 'single', soundHint: 'm' }, { letters: 'o', type: 'single', soundHint: 'oh' }, { letters: 'th', type: 'digraph', soundHint: 'th' }] },
  { word: 'rain', phase: 3, category: 'Vowel ai', icon: '🌧️', segments: [{ letters: 'r', type: 'single', soundHint: 'r' }, { letters: 'ai', type: 'digraph', soundHint: 'ay' }, { letters: 'n', type: 'single', soundHint: 'n' }] },
  { word: 'tree', phase: 3, category: 'Vowel ee', icon: '🌳', segments: [{ letters: 't', type: 'single', soundHint: 't' }, { letters: 'r', type: 'single', soundHint: 'r' }, { letters: 'ee', type: 'digraph', soundHint: 'ee' }] },
  { word: 'night', phase: 3, category: 'Trigraph igh', icon: '🌙', segments: [{ letters: 'n', type: 'single', soundHint: 'n' }, { letters: 'igh', type: 'trigraph', soundHint: 'eye' }, { letters: 't', type: 'single', soundHint: 't' }] },
  { word: 'boat', phase: 3, category: 'Vowel oa', icon: '⛵', segments: [{ letters: 'b', type: 'single', soundHint: 'b' }, { letters: 'oa', type: 'digraph', soundHint: 'oh' }, { letters: 't', type: 'single', soundHint: 't' }] },
  { word: 'book', phase: 3, category: 'Short oo', icon: '📖', segments: [{ letters: 'b', type: 'single', soundHint: 'b' }, { letters: 'oo', type: 'digraph', soundHint: 'oo' }, { letters: 'k', type: 'single', soundHint: 'k' }] },
  { word: 'moon', phase: 3, category: 'Long oo', icon: '🌕', segments: [{ letters: 'm', type: 'single', soundHint: 'm' }, { letters: 'oo', type: 'digraph', soundHint: 'ooo' }, { letters: 'n', type: 'single', soundHint: 'n' }] },
  { word: 'star', phase: 3, category: 'Vowel ar', icon: '⭐', segments: [{ letters: 's', type: 'single', soundHint: 's' }, { letters: 't', type: 'single', soundHint: 't' }, { letters: 'ar', type: 'digraph', soundHint: 'ar' }] },

  // Phase 4 Adjacent Consonants / Blends
  { word: 'frog', phase: 4, category: 'Initial Blend', icon: '🐸', segments: [{ letters: 'f', type: 'single', soundHint: 'f' }, { letters: 'r', type: 'single', soundHint: 'r' }, { letters: 'o', type: 'single', soundHint: 'oh' }, { letters: 'g', type: 'single', soundHint: 'g' }] },
  { word: 'milk', phase: 4, category: 'Final Blend', icon: '🥛', segments: [{ letters: 'm', type: 'single', soundHint: 'm' }, { letters: 'i', type: 'single', soundHint: 'ih' }, { letters: 'l', type: 'single', soundHint: 'l' }, { letters: 'k', type: 'single', soundHint: 'k' }] },
  { word: 'toast', phase: 4, category: 'Blend + Digraph', icon: '🍞', segments: [{ letters: 't', type: 'single', soundHint: 't' }, { letters: 'oa', type: 'digraph', soundHint: 'oh' }, { letters: 's', type: 'single', soundHint: 's' }, { letters: 't', type: 'single', soundHint: 't' }] },
  { word: 'lamp', phase: 4, category: 'Final Blend mp', icon: '💡', segments: [{ letters: 'l', type: 'single', soundHint: 'l' }, { letters: 'a', type: 'single', soundHint: 'ah' }, { letters: 'm', type: 'single', soundHint: 'm' }, { letters: 'p', type: 'single', soundHint: 'p' }] },

  // Phase 5 Split Digraphs & Alternatives
  { word: 'cake', phase: 5, category: 'Split Digraph a-e', icon: '🎂', segments: [{ letters: 'c', type: 'single', soundHint: 'k' }, { letters: 'a-e', type: 'split', soundHint: 'ay' }, { letters: 'k', type: 'single', soundHint: 'k' }] },
  { word: 'time', phase: 5, category: 'Split Digraph i-e', icon: '⏰', segments: [{ letters: 't', type: 'single', soundHint: 't' }, { letters: 'i-e', type: 'split', soundHint: 'eye' }, { letters: 'm', type: 'single', soundHint: 'm' }] },
  { word: 'home', phase: 5, category: 'Split Digraph o-e', icon: '🏡', segments: [{ letters: 'h', type: 'single', soundHint: 'h' }, { letters: 'o-e', type: 'split', soundHint: 'oh' }, { letters: 'm', type: 'single', soundHint: 'm' }] },
  { word: 'flute', phase: 5, category: 'Split Digraph u-e', icon: '🪈', segments: [{ letters: 'f', type: 'single', soundHint: 'f' }, { letters: 'l', type: 'single', soundHint: 'l' }, { letters: 'u-e', type: 'split', soundHint: 'ooo' }, { letters: 't', type: 'single', soundHint: 't' }] },
  { word: 'cloud', phase: 5, category: 'Alternative ou', icon: '☁️', segments: [{ letters: 'c', type: 'single', soundHint: 'k' }, { letters: 'l', type: 'single', soundHint: 'l' }, { letters: 'ou', type: 'digraph', soundHint: 'ow' }, { letters: 'd', type: 'single', soundHint: 'd' }] },
  { word: 'play', phase: 5, category: 'Alternative ay', icon: '🛝', segments: [{ letters: 'p', type: 'single', soundHint: 'p' }, { letters: 'l', type: 'single', soundHint: 'l' }, { letters: 'ay', type: 'digraph', soundHint: 'ay' }] },
];

export const OFFICIAL_SCREENING_POOL: ScreeningWord[] = [
  // SECTION 1: SIMPLER WORDS (PHASES 2/3) - 12 ALIEN + 8 REAL
  // Alien Words
  { id: 'sc-1', word: 'vap', isAlien: true, alienName: 'Gork', alienAvatar: '👾', phaseTarget: 2, section: 1, segments: [{ letters: 'v', type: 'single', soundHint: 'v' }, { letters: 'a', type: 'single', soundHint: 'ah' }, { letters: 'p', type: 'single', soundHint: 'p' }] },
  { id: 'sc-2', word: 'ot', isAlien: true, alienName: 'Zorb', alienAvatar: '🛸', phaseTarget: 2, section: 1, segments: [{ letters: 'o', type: 'single', soundHint: 'oh' }, { letters: 't', type: 'single', soundHint: 't' }] },
  { id: 'sc-3', word: 'eck', isAlien: true, alienName: 'Bloop', alienAvatar: '👽', phaseTarget: 2, section: 1, segments: [{ letters: 'e', type: 'single', soundHint: 'eh' }, { letters: 'ck', type: 'digraph', soundHint: 'k' }] },
  { id: 'sc-4', word: 'quemp', isAlien: true, alienName: 'Fizz', alienAvatar: '🪐', phaseTarget: 3, section: 1, segments: [{ letters: 'qu', type: 'digraph', soundHint: 'kw' }, { letters: 'e', type: 'single', soundHint: 'eh' }, { letters: 'm', type: 'single', soundHint: 'm' }, { letters: 'p', type: 'single', soundHint: 'p' }] },
  { id: 'sc-5', word: 'thazz', isAlien: true, alienName: 'Snark', alienAvatar: '👾', phaseTarget: 3, section: 1, segments: [{ letters: 'th', type: 'digraph', soundHint: 'th' }, { letters: 'a', type: 'single', soundHint: 'ah' }, { letters: 'zz', type: 'digraph', soundHint: 'z' }] },
  { id: 'sc-6', word: 'chig', isAlien: true, alienName: 'Nebula', alienAvatar: '🛸', phaseTarget: 3, section: 1, segments: [{ letters: 'ch', type: 'digraph', soundHint: 'ch' }, { letters: 'i', type: 'single', soundHint: 'ih' }, { letters: 'g', type: 'single', soundHint: 'g' }] },
  { id: 'sc-7', word: 'jigh', isAlien: true, alienName: 'Spork', alienAvatar: '👽', phaseTarget: 3, section: 1, segments: [{ letters: 'j', type: 'single', soundHint: 'j' }, { letters: 'igh', type: 'trigraph', soundHint: 'eye' }] },
  { id: 'sc-8', word: 'voap', isAlien: true, alienName: 'Krang', alienAvatar: '🪐', phaseTarget: 3, section: 1, segments: [{ letters: 'v', type: 'single', soundHint: 'v' }, { letters: 'oa', type: 'digraph', soundHint: 'oh' }, { letters: 'p', type: 'single', soundHint: 'p' }] },
  { id: 'sc-9', word: 'zarb', isAlien: true, alienName: 'Pluto', alienAvatar: '👾', phaseTarget: 3, section: 1, segments: [{ letters: 'z', type: 'single', soundHint: 'z' }, { letters: 'ar', type: 'digraph', soundHint: 'ar' }, { letters: 'b', type: 'single', soundHint: 'b' }] },
  { id: 'sc-10', word: 'shup', isAlien: true, alienName: 'Cosmo', alienAvatar: '🛸', phaseTarget: 3, section: 1, segments: [{ letters: 'sh', type: 'digraph', soundHint: 'sh' }, { letters: 'u', type: 'single', soundHint: 'uh' }, { letters: 'p', type: 'single', soundHint: 'p' }] },
  { id: 'sc-11', word: 'woop', isAlien: true, alienName: 'Orbit', alienAvatar: '👽', phaseTarget: 3, section: 1, segments: [{ letters: 'w', type: 'single', soundHint: 'w' }, { letters: 'oo', type: 'digraph', soundHint: 'ooo' }, { letters: 'p', type: 'single', soundHint: 'p' }] },
  { id: 'sc-12', word: 'dair', isAlien: true, alienName: 'Nova', alienAvatar: '🪐', phaseTarget: 3, section: 1, segments: [{ letters: 'd', type: 'single', soundHint: 'd' }, { letters: 'air', type: 'trigraph', soundHint: 'air' }] },

  // Real Words (Section 1)
  { id: 'sc-13', word: 'shin', isAlien: false, phaseTarget: 3, section: 1, segments: [{ letters: 'sh', type: 'digraph', soundHint: 'sh' }, { letters: 'i', type: 'single', soundHint: 'ih' }, { letters: 'n', type: 'single', soundHint: 'n' }] },
  { id: 'sc-14', word: 'gang', isAlien: false, phaseTarget: 3, section: 1, segments: [{ letters: 'g', type: 'single', soundHint: 'g' }, { letters: 'a', type: 'single', soundHint: 'ah' }, { letters: 'ng', type: 'digraph', soundHint: 'ng' }] },
  { id: 'sc-15', word: 'chill', isAlien: false, phaseTarget: 3, section: 1, segments: [{ letters: 'ch', type: 'digraph', soundHint: 'ch' }, { letters: 'i', type: 'single', soundHint: 'ih' }, { letters: 'll', type: 'digraph', soundHint: 'l' }] },
  { id: 'sc-16', word: 'boat', isAlien: false, phaseTarget: 3, section: 1, segments: [{ letters: 'b', type: 'single', soundHint: 'b' }, { letters: 'oa', type: 'digraph', soundHint: 'oh' }, { letters: 't', type: 'single', soundHint: 't' }] },
  { id: 'sc-17', word: 'yell', isAlien: false, phaseTarget: 3, section: 1, segments: [{ letters: 'y', type: 'single', soundHint: 'y' }, { letters: 'e', type: 'single', soundHint: 'eh' }, { letters: 'll', type: 'digraph', soundHint: 'l' }] },
  { id: 'sc-18', word: 'turn', isAlien: false, phaseTarget: 3, section: 1, segments: [{ letters: 't', type: 'single', soundHint: 't' }, { letters: 'ur', type: 'digraph', soundHint: 'er' }, { letters: 'n', type: 'single', soundHint: 'n' }] },
  { id: 'sc-19', word: 'farm', isAlien: false, phaseTarget: 3, section: 1, segments: [{ letters: 'f', type: 'single', soundHint: 'f' }, { letters: 'ar', type: 'digraph', soundHint: 'ar' }, { letters: 'm', type: 'single', soundHint: 'm' }] },
  { id: 'sc-20', word: 'horn', isAlien: false, phaseTarget: 3, section: 1, segments: [{ letters: 'h', type: 'single', soundHint: 'h' }, { letters: 'or', type: 'digraph', soundHint: 'or' }, { letters: 'n', type: 'single', soundHint: 'n' }] },

  // SECTION 2: COMPLEX WORDS (PHASES 4/5) - 8 ALIEN + 12 REAL
  // Alien Words
  { id: 'sc-21', word: 'strump', isAlien: true, alienName: 'Blarg', alienAvatar: '👾', phaseTarget: 4, section: 2, segments: [{ letters: 's', type: 'single', soundHint: 's' }, { letters: 't', type: 'single', soundHint: 't' }, { letters: 'r', type: 'single', soundHint: 'r' }, { letters: 'u', type: 'single', soundHint: 'uh' }, { letters: 'm', type: 'single', soundHint: 'm' }, { letters: 'p', type: 'single', soundHint: 'p' }] },
  { id: 'sc-22', word: 'flarm', isAlien: true, alienName: 'Zizzle', alienAvatar: '🛸', phaseTarget: 4, section: 2, segments: [{ letters: 'f', type: 'single', soundHint: 'f' }, { letters: 'l', type: 'single', soundHint: 'l' }, { letters: 'ar', type: 'digraph', soundHint: 'ar' }, { letters: 'm', type: 'single', soundHint: 'm' }] },
  { id: 'sc-23', word: 'grocks', isAlien: true, alienName: 'Klaatu', alienAvatar: '👽', phaseTarget: 4, section: 2, segments: [{ letters: 'g', type: 'single', soundHint: 'g' }, { letters: 'r', type: 'single', soundHint: 'r' }, { letters: 'o', type: 'single', soundHint: 'oh' }, { letters: 'ck', type: 'digraph', soundHint: 'k' }, { letters: 's', type: 'single', soundHint: 's' }] },
  { id: 'sc-24', word: 'snemp', isAlien: true, alienName: 'Quark', alienAvatar: '🪐', phaseTarget: 4, section: 2, segments: [{ letters: 's', type: 'single', soundHint: 's' }, { letters: 'n', type: 'single', soundHint: 'n' }, { letters: 'e', type: 'single', soundHint: 'eh' }, { letters: 'm', type: 'single', soundHint: 'm' }, { letters: 'p', type: 'single', soundHint: 'p' }] },
  { id: 'sc-25', word: 'phope', isAlien: true, alienName: 'Tadpole', alienAvatar: '👾', phaseTarget: 5, section: 2, segments: [{ letters: 'ph', type: 'digraph', soundHint: 'f' }, { letters: 'o-e', type: 'split', soundHint: 'oh' }, { letters: 'p', type: 'single', soundHint: 'p' }] },
  { id: 'sc-26', word: 'blair', isAlien: true, alienName: 'Starlight', alienAvatar: '🛸', phaseTarget: 5, section: 2, segments: [{ letters: 'b', type: 'single', soundHint: 'b' }, { letters: 'l', type: 'single', soundHint: 'l' }, { letters: 'air', type: 'trigraph', soundHint: 'air' }] },
  { id: 'sc-27', word: 'strow', isAlien: true, alienName: 'Galaxy', alienAvatar: '👽', phaseTarget: 5, section: 2, segments: [{ letters: 's', type: 'single', soundHint: 's' }, { letters: 't', type: 'single', soundHint: 't' }, { letters: 'r', type: 'single', soundHint: 'r' }, { letters: 'ow', type: 'digraph', soundHint: 'oh' }] },
  { id: 'sc-28', word: 'scrawt', isAlien: true, alienName: 'Eclipse', alienAvatar: '🪐', phaseTarget: 5, section: 2, segments: [{ letters: 's', type: 'single', soundHint: 's' }, { letters: 'c', type: 'single', soundHint: 'k' }, { letters: 'r', type: 'single', soundHint: 'r' }, { letters: 'aw', type: 'digraph', soundHint: 'or' }, { letters: 't', type: 'single', soundHint: 't' }] },

  // Real Words (Section 2)
  { id: 'sc-29', word: 'slide', isAlien: false, phaseTarget: 5, section: 2, segments: [{ letters: 's', type: 'single', soundHint: 's' }, { letters: 'l', type: 'single', soundHint: 'l' }, { letters: 'i-e', type: 'split', soundHint: 'eye' }, { letters: 'd', type: 'single', soundHint: 'd' }] },
  { id: 'sc-30', word: 'strike', isAlien: false, phaseTarget: 5, section: 2, segments: [{ letters: 's', type: 'single', soundHint: 's' }, { letters: 't', type: 'single', soundHint: 't' }, { letters: 'r', type: 'single', soundHint: 'r' }, { letters: 'i-e', type: 'split', soundHint: 'eye' }, { letters: 'k', type: 'single', soundHint: 'k' }] },
  { id: 'sc-31', word: 'flame', isAlien: false, phaseTarget: 5, section: 2, segments: [{ letters: 'f', type: 'single', soundHint: 'f' }, { letters: 'l', type: 'single', soundHint: 'l' }, { letters: 'a-e', type: 'split', soundHint: 'ay' }, { letters: 'm', type: 'single', soundHint: 'm' }] },
  { id: 'sc-32', word: 'stone', isAlien: false, phaseTarget: 5, section: 2, segments: [{ letters: 's', type: 'single', soundHint: 's' }, { letters: 't', type: 'single', soundHint: 't' }, { letters: 'o-e', type: 'split', soundHint: 'oh' }, { letters: 'n', type: 'single', soundHint: 'n' }] },
  { id: 'sc-33', word: 'haunt', isAlien: false, phaseTarget: 5, section: 2, segments: [{ letters: 'h', type: 'single', soundHint: 'h' }, { letters: 'au', type: 'digraph', soundHint: 'or' }, { letters: 'n', type: 'single', soundHint: 'n' }, { letters: 't', type: 'single', soundHint: 't' }] },
  { id: 'sc-34', word: 'treat', isAlien: false, phaseTarget: 5, section: 2, segments: [{ letters: 't', type: 'single', soundHint: 't' }, { letters: 'r', type: 'single', soundHint: 'r' }, { letters: 'ea', type: 'digraph', soundHint: 'ee' }, { letters: 't', type: 'single', soundHint: 't' }] },
  { id: 'sc-35', word: 'bright', isAlien: false, phaseTarget: 4, section: 2, segments: [{ letters: 'b', type: 'single', soundHint: 'b' }, { letters: 'r', type: 'single', soundHint: 'r' }, { letters: 'igh', type: 'trigraph', soundHint: 'eye' }, { letters: 't', type: 'single', soundHint: 't' }] },
  { id: 'sc-36', word: 'scaffold', isAlien: false, phaseTarget: 4, section: 2, segments: [{ letters: 's', type: 'single', soundHint: 's' }, { letters: 'c', type: 'single', soundHint: 'k' }, { letters: 'a', type: 'single', soundHint: 'ah' }, { letters: 'ff', type: 'digraph', soundHint: 'f' }, { letters: 'o', type: 'single', soundHint: 'oh' }, { letters: 'l', type: 'single', soundHint: 'l' }, { letters: 'd', type: 'single', soundHint: 'd' }] },
  { id: 'sc-37', word: 'ground', isAlien: false, phaseTarget: 5, section: 2, segments: [{ letters: 'g', type: 'single', soundHint: 'g' }, { letters: 'r', type: 'single', soundHint: 'r' }, { letters: 'ou', type: 'digraph', soundHint: 'ow' }, { letters: 'n', type: 'single', soundHint: 'n' }, { letters: 'd', type: 'single', soundHint: 'd' }] },
  { id: 'sc-38', word: 'crayon', isAlien: false, phaseTarget: 5, section: 2, segments: [{ letters: 'c', type: 'single', soundHint: 'k' }, { letters: 'r', type: 'single', soundHint: 'r' }, { letters: 'ay', type: 'digraph', soundHint: 'ay' }, { letters: 'o', type: 'single', soundHint: 'oh' }, { letters: 'n', type: 'single', soundHint: 'n' }] },
  { id: 'sc-39', word: 'shield', isAlien: false, phaseTarget: 5, section: 2, segments: [{ letters: 'sh', type: 'digraph', soundHint: 'sh' }, { letters: 'ie', type: 'digraph', soundHint: 'ee' }, { letters: 'l', type: 'single', soundHint: 'l' }, { letters: 'd', type: 'single', soundHint: 'd' }] },
  { id: 'sc-40', word: 'dolphin', isAlien: false, phaseTarget: 5, section: 2, segments: [{ letters: 'd', type: 'single', soundHint: 'd' }, { letters: 'o', type: 'single', soundHint: 'oh' }, { letters: 'l', type: 'single', soundHint: 'l' }, { letters: 'ph', type: 'digraph', soundHint: 'f' }, { letters: 'i', type: 'single', soundHint: 'ih' }, { letters: 'n', type: 'single', soundHint: 'n' }] },
];

export const TRICKY_WORDS: TrickyWord[] = [
  // Phase 2 Tricky Words
  { id: 'tw-the', word: 'the', phase: 2, trickyPart: 'e', trickyExplanation: 'The "e" doesn’t say /e/, it makes a soft unaccented "uh" (schwa) sound.', exampleSentence: 'The dog sat on the mat.' },
  { id: 'tw-to', word: 'to', phase: 2, trickyPart: 'o', trickyExplanation: 'The "o" makes an /oo/ sound instead of short /o/.', exampleSentence: 'We went to the shop.' },
  { id: 'tw-I', word: 'I', phase: 2, trickyPart: 'I', trickyExplanation: 'It is a capital letter and says its full name /eye/ all by itself.', exampleSentence: 'I can run fast.' },
  { id: 'tw-no', word: 'no', phase: 2, trickyPart: 'o', trickyExplanation: 'The "o" makes an open long /oh/ sound.', exampleSentence: 'There is no milk left.' },
  { id: 'tw-go', word: 'go', phase: 2, trickyPart: 'o', trickyExplanation: 'The "o" makes a long /oh/ sound instead of short /o/.', exampleSentence: 'Ready, steady, go!' },
  { id: 'tw-into', word: 'into', phase: 2, trickyPart: 'o', trickyExplanation: 'Two small words together: in + to (/too/).', exampleSentence: 'Jump into the pool.' },

  // Phase 3 Tricky Words
  { id: 'tw-he', word: 'he', phase: 3, trickyPart: 'e', trickyExplanation: 'The single "e" makes a long /ee/ sound.', exampleSentence: 'He is my best friend.' },
  { id: 'tw-she', word: 'she', phase: 3, trickyPart: 'e', trickyExplanation: 'The single "e" makes a long /ee/ sound.', exampleSentence: 'She scored a great goal.' },
  { id: 'tw-we', word: 'we', phase: 3, trickyPart: 'e', trickyExplanation: 'The single "e" makes a long /ee/ sound.', exampleSentence: 'We are learning phonics.' },
  { id: 'tw-me', word: 'me', phase: 3, trickyPart: 'e', trickyExplanation: 'The single "e" makes a long /ee/ sound.', exampleSentence: 'Can you see me?' },
  { id: 'tw-be', word: 'be', phase: 3, trickyPart: 'e', trickyExplanation: 'The single "e" makes a long /ee/ sound.', exampleSentence: 'Always be kind.' },
  { id: 'tw-was', word: 'was', phase: 3, trickyPart: 'a and s', trickyExplanation: 'The "a" makes an /o/ sound, and the "s" makes a buzzing /z/ sound!', exampleSentence: 'It was a sunny day.' },
  { id: 'tw-you', word: 'you', phase: 3, trickyPart: 'ou', trickyExplanation: 'The "ou" makes an /oo/ sound.', exampleSentence: 'You did a brilliant job.' },
  { id: 'tw-they', word: 'they', phase: 3, trickyPart: 'ey', trickyExplanation: 'The "ey" makes an /ay/ sound.', exampleSentence: 'They are playing outside.' },
  { id: 'tw-all', word: 'all', phase: 3, trickyPart: 'a', trickyExplanation: 'The "a" makes an /or/ sound before double l.', exampleSentence: 'All the stars were shining.' },
  { id: 'tw-are', word: 'are', phase: 3, trickyPart: 'are', trickyExplanation: 'The whole word just sounds like the letter name "R" (/ar/)!', exampleSentence: 'We are ready.' },
  { id: 'tw-my', word: 'my', phase: 3, trickyPart: 'y', trickyExplanation: 'The "y" acts as a vowel making a long /eye/ sound.', exampleSentence: 'This is my cat.' },
  { id: 'tw-her', word: 'her', phase: 3, trickyPart: 'er', trickyExplanation: 'The "er" makes a purring /er/ sound.', exampleSentence: 'Give her the book.' },

  // Phase 4 Tricky Words
  { id: 'tw-said', word: 'said', phase: 4, trickyPart: 'ai', trickyExplanation: 'The "ai" makes a short /e/ sound instead of /ay/. Rhymes with bed!', exampleSentence: '"Hello," said the teacher.' },
  { id: 'tw-have', word: 'have', phase: 4, trickyPart: 'e', trickyExplanation: 'Looks like a split digraph, but the "a" stays short /ah/. The "e" is silent because English words don’t end in v.', exampleSentence: 'I have two pencils.' },
  { id: 'tw-like', word: 'like', phase: 4, trickyPart: 'i-e', trickyExplanation: 'Split digraph: magic e makes the i say its own name!', exampleSentence: 'I like reading stories.' },
  { id: 'tw-so', word: 'so', phase: 4, trickyPart: 'o', trickyExplanation: 'The "o" makes an open long /oh/ sound.', exampleSentence: 'It was so much fun.' },
  { id: 'tw-do', word: 'do', phase: 4, trickyPart: 'o', trickyExplanation: 'The "o" makes a long /oo/ sound.', exampleSentence: 'What do you want to play?' },
  { id: 'tw-some', word: 'some', phase: 4, trickyPart: 'o and e', trickyExplanation: 'The "o" makes an /uh/ sound like "sum", with a silent e.', exampleSentence: 'Can I have some water?' },
  { id: 'tw-come', word: 'come', phase: 4, trickyPart: 'o and e', trickyExplanation: 'Rhymes with some. The "o" makes a short /uh/ sound.', exampleSentence: 'Come and sit here.' },
  { id: 'tw-little', word: 'little', phase: 4, trickyPart: 'le', trickyExplanation: 'Double tt keeps the i short, and "le" makes an /l/ sound.', exampleSentence: 'A little brown mouse.' },
  { id: 'tw-one', word: 'one', phase: 4, trickyPart: 'o-n-e', trickyExplanation: 'Sounds like "wun" starting with a /w/ sound that is not written!', exampleSentence: 'Number one is first.' },
  { id: 'tw-were', word: 'were', phase: 4, trickyPart: 'ere', trickyExplanation: 'Rhymes with "fur". It sounds like w-er.', exampleSentence: 'We were very happy.' },
  { id: 'tw-there', word: 'there', phase: 4, trickyPart: 'ere', trickyExplanation: 'The "ere" makes an /air/ sound. Rhymes with chair!', exampleSentence: 'Look over there.' },
  { id: 'tw-what', word: 'what', phase: 4, trickyPart: 'a', trickyExplanation: 'The "a" makes an /o/ sound ("wh-o-t").', exampleSentence: 'What is your name?' },
  { id: 'tw-when', word: 'when', phase: 4, trickyPart: 'wh', trickyExplanation: 'The "wh" makes a simple /w/ sound.', exampleSentence: 'When is playtime?' },
  { id: 'tw-out', word: 'out', phase: 4, trickyPart: 'ou', trickyExplanation: 'The "ou" makes an /ow/ sound.', exampleSentence: 'Go out to play.' },

  // Phase 5 Tricky Words
  { id: 'tw-people', word: 'people', phase: 5, trickyPart: 'eo', trickyExplanation: 'The "eo" makes a long /ee/ sound.', exampleSentence: 'Many people visited the park.' },
  { id: 'tw-their', word: 'their', phase: 5, trickyPart: 'eir', trickyExplanation: 'The "eir" makes an /air/ sound for belonging to them.', exampleSentence: 'They put their coats on.' },
  { id: 'tw-could', word: 'could', phase: 5, trickyPart: 'oul', trickyExplanation: 'The "oul" makes a short /oo/ sound with a silent l (O-U-Lucky-Duck!).', exampleSentence: 'She could jump high.' },
  { id: 'tw-would', word: 'would', phase: 5, trickyPart: 'oul', trickyExplanation: 'Same pattern as could. The l is silent.', exampleSentence: 'Would you like an apple?' },
  { id: 'tw-should', word: 'should', phase: 5, trickyPart: 'oul', trickyExplanation: 'Same pattern as could and would.', exampleSentence: 'We should share our toys.' },
];
