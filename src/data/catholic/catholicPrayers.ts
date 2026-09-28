// src/data/catholic/catholicPrayers.ts
// St Joseph's Catholic Life & Faith Sanctuary
// Foundational Prayers for Pupils & First Holy Communion Preparation

export interface CatholicPrayer {
  id: string;
  title: string;
  occasion: string;
  text: string;
  missingWords: string[];
}

export const CATHOLIC_PRAYERS: CatholicPrayer[] = [
  {
    id: 'act-of-contrition',
    title: 'The Act of Contrition',
    occasion: 'During First Reconciliation / Before Holy Communion',
    text: 'O my God, I thank you for loving me. I am sorry for all my sins, for not loving others and not loving you. Help me to live like Jesus and not sin again. Amen.',
    missingWords: ['loving', 'sorry', 'sins', 'Jesus', 'sin']
  },
  {
    id: 'guardian-angel',
    title: 'Prayer to My Guardian Angel',
    occasion: 'Morning and Evening Daily Protection',
    text: 'Angel of God, my guardian dear, to whom God’s love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.',
    missingWords: ['Angel', 'love', 'side', 'guard', 'guide']
  },
  {
    id: 'centurion-prayer',
    title: 'The Centurion’s Prayer of Humility',
    occasion: 'Right before receiving Holy Communion at every Mass',
    text: 'Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed.',
    missingWords: ['worthy', 'roof', 'word', 'soul', 'healed']
  },
  {
    id: 'confiteor',
    title: 'The Confiteor (I Confess)',
    occasion: 'Penitential Rite at the start of Mass',
    text: 'I confess to almighty God and to you, my brothers and sisters, that I have greatly sinned, in my thoughts and in my words, in what I have done and in what I have failed to do, through my fault, through my fault, through my most grievous fault.',
    missingWords: ['confess', 'sinned', 'thoughts', 'words', 'fault']
  },
  {
    id: 'anima-christi',
    title: 'Thanksgiving Prayer (A Child’s Anima Christi)',
    occasion: 'Quiet reflection after receiving Holy Communion',
    text: 'Soul of Christ, make me holy. Body of Christ, save me. Blood of Christ, fill my heart with love. Water from the side of Christ, wash me clean. Passion of Christ, give me strength. O good Jesus, hear my prayer. Keep me close to you always, and never let me be separated from you. Amen.',
    missingWords: ['Soul', 'Body', 'love', 'Jesus', 'separated']
  }
];
