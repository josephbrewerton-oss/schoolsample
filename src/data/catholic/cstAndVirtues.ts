// src/data/catholic/cstAndVirtues.ts
// St Joseph's Catholic Life & Faith Sanctuary
// Catholic Social Teaching (CST) Principles & School Patron Virtues

export interface CSTPrinciple {
  id: string;
  title: string;
  childTitle: string;
  icon: string;
  scripture: string;
  summary: string;
  schoolAction: string;
}

export const CST_PRINCIPLES: CSTPrinciple[] = [
  {
    id: 'human-dignity',
    title: 'Dignity of the Human Person',
    childTitle: 'Everyone is Loved & Precious to God (Human Dignity)',
    icon: '👑',
    scripture: 'Genesis 1:27 — "So God created mankind in his own image."',
    summary: 'Every single person is made by God and is deeply loved. No matter where you come from, what you look like, or what you are good at, you are special and have infinite worth in God’s eyes.',
    schoolAction: 'We treat every classmate with kindness and respect, help anyone who is feeling left out, and say NO to bullying.',
  },
  {
    id: 'common-good',
    title: 'The Common Good',
    childTitle: 'Thinking of Everyone, Not Just Ourselves (Common Good)',
    icon: '🤝',
    scripture: '1 Corinthians 12:26 — "If one part suffers, every part suffers with it."',
    summary: 'True happiness happens when we make sure everyone in our class and community has what they need to be safe, healthy, and happy — not just a lucky few.',
    schoolAction: 'We share school toys, take turns, tidy up after ourselves, and think about how our actions make the whole classroom feel.',
  },
  {
    id: 'solidarity',
    title: 'Solidarity & Global Neighbour',
    childTitle: 'We Are One Big World Family (Solidarity)',
    icon: '🌍',
    scripture: 'Luke 10:29-37 — The Parable of the Good Samaritan',
    summary: 'God made us all brothers and sisters across the planet. Loving our neighbour means caring about children living across the ocean just as much as our best friends next door.',
    schoolAction: 'We support CAFOD and our local foodbank, pray for refugee families, and celebrate friends from every culture.',
  },
  {
    id: 'subsidiarity',
    title: 'Subsidiarity & Participation',
    childTitle: 'Everyone Has a Voice & Role (Participation)',
    icon: '🗣️',
    scripture: 'Exodus 18:21 — Choosing wise community leaders',
    summary: 'Everyone, including children, should have a voice in things that affect them. Leaders should listen closely to the people they are helping.',
    schoolAction: 'Our School Council and Eco-monitors share children’s ideas in school meetings and help make our school a happier place.',
  },
  {
    id: 'option-for-poor',
    title: 'Preferential Option for the Poor',
    childTitle: 'Helping Those in Greatest Need (Option for the Poor)',
    icon: '🤲',
    scripture: 'Matthew 25:40 — "Whatever you did for one of the least of these, you did for me."',
    summary: 'Jesus always spent His time with the poor, sick, and lonely. He taught us that the most important test of love is how we look after those who need help the most.',
    schoolAction: 'We collect warm winter coats, donate food, and make sure every child can take part in fun school activities and trips.',
  },
  {
    id: 'dignity-of-work',
    title: 'Dignity of Work & Rights of Workers',
    childTitle: 'Valuing Hard Work & Fairness (Workers’ Rights)',
    icon: '🛠️',
    scripture: 'Genesis 2:15 — The Lord God put man in the Garden to care for it',
    summary: 'Working and learning helps us use our God-given talents. Everyone who works deserves fair pay, safe conditions, and a friendly thank-you.',
    schoolAction: 'We smile and say "thank you" to our school cooks, cleaners, and caretakers every day, and choose Fairtrade snacks.',
  },
  {
    id: 'care-for-creation',
    title: 'Care for God’s Creation (Laudato Si’)',
    childTitle: 'Looking After Our Beautiful Earth (Laudato Si’)',
    icon: '🌱',
    scripture: 'Psalm 24:1 — "The earth is the Lord’s, and everything in it."',
    summary: 'Pope Francis wrote a special letter called Laudato Si’ reminding us that the Earth is our wonderful common home. We are called to protect nature, oceans, and animals for the future.',
    schoolAction: 'We plant school wildflowers for bees, switch off lights, recycle paper, and pick up litter in the playground.',
  },
];

export interface SchoolVirtue {
  name: string;
  icon: string;
  patronExample: string;
  definition: string;
  reflectionQuestion: string;
}

export const SCHOOL_VIRTUES: SchoolVirtue[] = [
  {
    name: 'Quiet Kindness & Staying Humble (Like St Joseph)',
    icon: '🪵',
    patronExample: 'St Joseph was a hard-working carpenter who faithfully cared for Jesus and Mary without ever boasting or seeking praise.',
    definition: 'Doing the right thing quietly because it is good, with an honest modesty and a peaceful heart.',
    reflectionQuestion: 'Can you do a secret act of kindness today without telling anyone?',
  },
  {
    name: 'Kindness & Forgiving Others (Compassion & Mercy)',
    icon: '❤️',
    patronExample: 'Jesus washed His disciples’ feet at the Last Supper and forgave those who hurt Him, showing that love never gives up.',
    definition: 'Noticing when someone is struggling or hurting, and gently stepping forward to comfort them.',
    reflectionQuestion: 'Who in our class looks lonely or left out, and how can you invite them into your game?',
  },
  {
    name: 'Trusting God & Daily Prayer (Faithfulness)',
    icon: '🕯️',
    patronExample: 'Our Blessed Mother Mary trusted God completely and whispered her joyful "Yes" to God at the Annunciation.',
    definition: 'Starting each morning with prayer, trusting God with our whole heart, and keeping our promises.',
    reflectionQuestion: 'Have you taken a quiet minute today to chat to Jesus in your own words, just like a friend?',
  },
  {
    name: 'Fairness & Telling the Truth (Justice & Integrity)',
    icon: '⚖️',
    patronExample: 'The Prophets and Saints bravely stood up for truth and fairness, even when it was difficult.',
    definition: 'Speaking the honest truth, playing by fair rules, and admitting our mistakes with courage.',
    reflectionQuestion: 'How can you be a fair player when playing games and taking turns on the school pitch?',
  },
  {
    name: 'Cheerful Sharing & Bringing Joy (Generosity & Joy)',
    icon: '✨',
    patronExample: 'St Francis of Assisi gave away all worldly riches to share Christ’s joy with the poorest of the poor.',
    definition: 'Sharing our time, laughter, talents, and treats cheerfully without holding anything back.',
    reflectionQuestion: 'What talent has God blessed you with that you can use to bring a big smile to someone today?',
  },
];
