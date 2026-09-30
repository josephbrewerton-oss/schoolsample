// src/data/shakespearePlays.ts
/**
 * Zero-Bloat Play-Through Stories: 5-Act Interactive Journeys
 * 
 * Provides lightweight, high-impact narrative walkthroughs of Shakespeare's
 * most studied plays. Each Act contains:
 * - A 2-sentence scene setup
 * - The iconic spoken line with plain English translation
 * - An interactive dramatic choice (The Canon Choice vs. The "What If?" Branch)
 * - The historical 1599 Globe Theatre staging technique
 */

export interface DramaticChoice {
  text: string;
  isCanon: boolean;
  consequence: string;
  modernTakeaway: string;
}

export interface PlayAct {
  act: number;
  actRoman: string;
  title: string;
  setting: string;
  summary: string;
  iconicQuote: {
    verse: string;
    speaker: string;
    modernTranslation: string;
    dramaticSignificance: string;
  };
  decisionPrompt: string;
  choices: DramaticChoice[];
  globeStagingSecret: string;
}

export interface ShakespearePlayStory {
  id: string;
  title: string;
  genre: 'Tragedy' | 'Comedy' | 'History' | 'Romance';
  genreBadgeColor: string;
  tagline: string;
  coreQuestion: string;
  overview: string;
  icon: string;
  themeColor: string;
  acts: PlayAct[];
}

export const SHAKESPEARE_PLAY_STORIES: ShakespearePlayStory[] = [
  {
    id: 'macbeth',
    title: 'Macbeth',
    genre: 'Tragedy',
    genreBadgeColor: '#dc2626',
    tagline: 'Vaulting ambition, bloodguilt, and the prophecy on the blasted heath.',
    coreQuestion: 'Can you commit murder to seize destiny, or does crime consume the criminal?',
    overview: 'Returning triumphant from civil war, Scottish general Macbeth meets three weird sisters who hail him as future king. Spurred by his ruthless wife, he murders King Duncan and spirals into tyrannical paranoia.',
    icon: '👑',
    themeColor: '#7f1d1d',
    acts: [
      {
        act: 1,
        actRoman: 'Act I',
        title: 'The Prophecy on the Heath',
        setting: 'A blasted Scottish heath, thunder and lightning',
        summary: 'Macbeth and Banquo encounter three supernatural weird sisters who hail Macbeth as Thane of Cawdor and King hereafter, while Banquo will father a royal dynasty.',
        iconicQuote: {
          verse: 'Fair is foul, and foul is fair: Hover through the fog and filthy air.',
          speaker: 'The Three Witches',
          modernTranslation: 'Good will turn evil, and evil will seem good: let us drift through the murky, tainted mist.',
          dramaticSignificance: 'Establishes the moral inversion of the tragedy where deceit masquerades as virtue.',
        },
        decisionPrompt: 'King Duncan confirms you are indeed the new Thane of Cawdor! The witches’ first prediction has come true immediately. What do you do?',
        choices: [
          {
            text: 'Write to Lady Macbeth and nurture the secret seed of seizing the crown by force.',
            isCanon: true,
            consequence: 'Lady Macbeth invokes spirits to unsex her and steel Macbeth’s wavering resolve to assassinate King Duncan while he sleeps as their guest.',
            modernTakeaway: 'Ambition unchecked by moral principle immediately invites ruin.',
          },
          {
            text: 'Heed Banquo’s warning that "instruments of darkness tell us truths to betray us in deepest consequence."',
            isCanon: false,
            consequence: 'Had Macbeth listened to Banquo, Duncan would have lived, Scotland would have known peace, and Macbeth would have died an honored warrior.',
            modernTakeaway: 'True wisdom questions convenient prophecies.',
          },
        ],
        globeStagingSecret: 'Real gunpowder smoke was pumped through the trapdoor ("Hell") to create the blasted heath, filling the open Globe with sulfur smell.',
      },
      {
        act: 2,
        actRoman: 'Act II',
        title: 'The Murder of King Duncan',
        setting: 'Inverness Castle, past midnight',
        summary: 'Duncan sleeps in the guest chamber. Macbeth hallucinates a floating dagger dripping with blood before creeping inside to commit regicide.',
        iconicQuote: {
          verse: 'Will all great Neptune’s ocean wash this blood clean from my hand? No, this my hand will rather the multitudinous seas incarnadine.',
          speaker: 'Macbeth',
          modernTranslation: 'Could the vast ocean wash this blood from my hands? No, my hands would turn the green seas blood red.',
          dramaticSignificance: 'Blood symbolizes permanent psychological and moral guilt that water can never cleanse.',
        },
        decisionPrompt: 'The murder is done, but in your panic, you carried the bloody daggers out of the bedroom instead of framing Duncan’s drugged guards! What do you do?',
        choices: [
          {
            text: 'Refuse to return to the chamber in sheer terror; Lady Macbeth grabs the daggers to smear the sleeping guards herself.',
            isCanon: true,
            consequence: 'Macduff arrives at dawn, discovers the slaughtered sovereign, and the loud knocking at the gate mimics the heartbeat of judgment.',
            modernTakeaway: 'The immediate aftermath of crime produces paralysis and psychological disintegration.',
          },
          {
            text: 'Toss the daggers in the courtyard moat and wake the servants claiming you heard screams.',
            isCanon: false,
            consequence: 'A cool-headed coverup might have delayed suspicion, but Macbeth’s trembling hands and guilt-stricken face would still betray him.',
            modernTakeaway: 'The body and voice unconsciously broadcast guilt.',
          },
        ],
        globeStagingSecret: 'The sudden loud knocking at the southern gate was hammered on the wooden timbers behind the Frons Scenae, making the 3,000 groundlings jump in unison.',
      },
      {
        act: 3,
        actRoman: 'Act III',
        title: 'The Ghost at the Royal Banquet',
        setting: 'The Great Hall of the Royal Palace at Forres',
        summary: 'Crown in hand, Macbeth fears Banquo’s heirs will inherit his throne. He hires murderers to kill Banquo and his young son Fleance, then holds a grand feast.',
        iconicQuote: {
          verse: 'Thou canst not say I did it: never shake thy gory locks at me.',
          speaker: 'Macbeth',
          modernTranslation: 'You cannot accuse me of doing this: don’t shake your bloody head of hair at me!',
          dramaticSignificance: 'Macbeth loses public control of his sanity as Banquo’s mangled ghost occupies the empty royal chair.',
        },
        decisionPrompt: 'Banquo’s ghost enters and sits in your throne. None of your Scottish lords can see it—only you! What do you do?',
        choices: [
          {
            text: 'Scream and rant at empty air in front of your entire nobility until Lady Macbeth dismisses the court in chaos.',
            isCanon: true,
            consequence: 'The lords realize their new king is either insane or a blood-soaked murderer. Suspicion turns into rebellion led by Macduff.',
            modernTakeaway: 'Guilt will always break through the facade of public power.',
          },
          {
            text: 'Toast your guests, laugh off the vision as war fatigue, and change the subject to taxes.',
            isCanon: false,
            consequence: 'Macbeth is incapable of such composure—his conscience has turned his own mind into an inescapable torture chamber.',
            modernTakeaway: 'A tyrant cannot conceal the ghosts he creates.',
          },
        ],
        globeStagingSecret: 'The actor playing Banquo arose through the stage trapdoor with theatrical chalk-white face paint and fake animal blood poured over his neck.',
      },
      {
        act: 4,
        actRoman: 'Act IV',
        title: 'The Cauldron of False Security',
        setting: 'A dark cave, a boiling cauldron',
        summary: 'Desperate for reassurance, Macbeth returns to the witches. They summon three floating apparitions that offer deceitful riddles of invulnerability.',
        iconicQuote: {
          verse: 'Be bloody, bold, and resolute; laugh to scorn the power of man, for none of woman born shall harm Macbeth.',
          speaker: 'Second Apparition (Bloody Child)',
          modernTranslation: 'Be violent, daring, and fearless; sneer at human opposition, for no man born naturally of woman can ever harm Macbeth.',
          dramaticSignificance: 'Equivocation: the prophecy is technically true but completely misleading.',
        },
        decisionPrompt: 'Hearing you cannot be killed by any man of woman born, nor until Great Birnam Wood moves to Dunsinane Hill, how do you rule Scotland?',
        choices: [
          {
            text: 'Believe you are an untouchable god; order the immediate slaughter of Macduff’s wife, children, and household.',
            isCanon: true,
            consequence: 'This monstrous slaughter unites all Scottish refugees with the English army under Prince Malcolm, determined to destroy the tyrant.',
            modernTakeaway: 'Arrogance and false certainty breed senseless cruelty.',
          },
          {
            text: 'Fortify your castle, offer royal pardons to the rebels, and seek peace with England.',
            isCanon: false,
            consequence: 'Too late: by Act IV, Macbeth admits "I am in blood stepped in so far that returning were as tedious as go o’er."',
            modernTakeaway: 'Tyranny becomes an addiction to violence.',
          },
        ],
        globeStagingSecret: 'Real animal bones and stage props were tossed into an actual smoking bronze cauldron on stage to mesmerize the groundlings.',
      },
      {
        act: 5,
        actRoman: 'Act V',
        title: 'Birnam Wood & The Fall of the Tyrant',
        setting: 'Dunsinane Castle under siege',
        summary: 'Lady Macbeth dies offstage by her own hand. Malcolm orders each soldier to hew down a tree branch from Birnam Wood to conceal their numbers as they march on Dunsinane.',
        iconicQuote: {
          verse: 'Tomorrow, and tomorrow, and tomorrow, creeps in this petty pace from day to day... Life’s but a walking shadow, a poor player.',
          speaker: 'Macbeth',
          modernTranslation: 'Tomorrow creeps forward one sluggish day at a time... Life is merely a fleeting shadow, a pitiful actor.',
          dramaticSignificance: 'The ultimate tragic realization of nihility: evil promised everything and delivered hollow ashes.',
        },
        decisionPrompt: 'A messenger gasps that Birnam Wood is moving! Macduff corners you and reveals he was "from his mother’s womb untimely ripped" (born by Caesarean section!). What do you do?',
        choices: [
          {
            text: 'Refuse to surrender or kiss the ground before young Malcolm; fight to the death with warlike shield.',
            isCanon: true,
            consequence: 'Macduff slays Macbeth in single combat and brings his severed head on a pike. Malcolm is crowned rightful King of Scotland at Scone.',
            modernTakeaway: 'The moral order is restored, but the tragedy mourns what Macbeth could have been.',
          },
          {
            text: 'Drop your sword, beg Malcolm for monastic exile, and spend your days praying for Duncan’s soul.',
            isCanon: false,
            consequence: 'Macbeth’s warrior spirit would never permit living as a caged exhibit for the jeering crowd.',
            modernTakeaway: 'A tragic hero meets his fate on his feet.',
          },
        ],
        globeStagingSecret: 'Actors carrying real pine branches charged across the thrust stage to replicate an advancing forest right in front of the spectators.',
      },
    ],
  },
  {
    id: 'romeo-juliet',
    title: 'Romeo & Juliet',
    genre: 'Romance',
    genreBadgeColor: '#ec4899',
    tagline: 'Star-crossed passion, ancient blood feuds, and the poison of impetuous haste.',
    coreQuestion: 'Can youthful love triumph over inherited hatred, or does haste destroy hope?',
    overview: 'In Renaissance Verona, the noble families of Montague and Capulet are locked in a lethal street feud. When young Romeo Montague falls instantly in love with Juliet Capulet at a masked ball, their secret marriage sets off a chain reaction of tragedy.',
    icon: '💔',
    themeColor: '#831843',
    acts: [
      {
        act: 1,
        actRoman: 'Act I',
        title: 'The Verona Feud & The Masked Ball',
        setting: 'Verona town square, then the Capulet mansion',
        summary: 'Prince Escalus decrees death for anyone caught brawling in the streets. Heartbroken over Rosaline, Romeo is persuaded by Benvolio and Mercutio to crash the Capulets’ masked feast.',
        iconicQuote: {
          verse: 'Did my heart love till now? forswear it, sight! For I ne’er saw true beauty till this night.',
          speaker: 'Romeo',
          modernTranslation: 'Did I ever truly love before? Forget it, eyes! For I never witnessed real beauty until tonight.',
          dramaticSignificance: 'Immediate, intoxicating romantic revelation that replaces Romeo’s adolescent infatuation.',
        },
        decisionPrompt: 'At the party, Romeo touches Juliet’s hand, but fiery Tybalt recognizes Romeo’s Montague voice through his mask! What does Romeo do?',
        choices: [
          {
            text: 'Share a tender rhyming sonnet with Juliet and kiss her twice before finding out she is a Capulet.',
            isCanon: true,
            consequence: 'Romeo is consumed by destiny: "My life is my foe’s debt!" Juliet learns her only love sprung from her only hate.',
            modernTakeaway: 'Love disregards family frontiers.',
          },
          {
            text: 'Slip out the side entrance immediately to avoid provoking Lord Capulet or starting a sword fight.',
            isCanon: false,
            consequence: 'Romeo lives safely, but the transcendent romance never blossoms.',
            modernTakeaway: 'Safety avoids danger, but love takes wild risks.',
          },
        ],
        globeStagingSecret: 'Actors wore genuine Venetian masks and performed a synchronized courtly pavane dance across the thrust stage.',
      },
      {
        act: 2,
        actRoman: 'Act II',
        title: 'The Balcony & The Secret Vows',
        setting: 'Capulet orchard, moonlit night',
        summary: 'Romeo scales the orchard wall and overhears Juliet confessing her love to the night stars on her high balcony. They pledge eternal fidelity and plan a clandestine wedding.',
        iconicQuote: {
          verse: 'O Romeo, Romeo! wherefore art thou Romeo? Deny thy father and refuse thy name; or, if thou wilt not, be but sworn my love, and I’ll no longer be a Capulet.',
          speaker: 'Juliet',
          modernTranslation: 'O Romeo, Romeo! Why must you be a Montague? Disown your father and cast off your family name; or swear you love me, and I will stop being a Capulet.',
          dramaticSignificance: '"Wherefore" means *why*—why must the person she loves bear the name of her family’s mortal enemy?',
        },
        decisionPrompt: 'Juliet warns that her kinsmen will execute Romeo if they find him in the orchard. Romeo says her eyes are more dangerous than twenty swords. What next?',
        choices: [
          {
            text: 'Arrange for Friar Laurence to secretly wed them that very afternoon in hope of healing the family feud.',
            isCanon: true,
            consequence: 'Friar Laurence agrees, hoping the alliance will turn the household hatred into pure love.',
            modernTakeaway: 'Even holy intentions can overlook worldly dangers.',
          },
          {
            text: 'Wait two years until Juliet turns sixteen and ask Lord Capulet for permission.',
            isCanon: false,
            consequence: 'Patience would have avoided the bloodshed, but passion operates on an urgent clock.',
            modernTakeaway: 'Youthful passion demands the immediate present.',
          },
        ],
        globeStagingSecret: 'Juliet stood on the Tarras (the elevated balcony wall), looking down upon Romeo in the pit surrounded by torches.',
      },
      {
        act: 3,
        actRoman: 'Act III',
        title: 'The Blood in the Street & Banishment',
        setting: 'Verona street under blazing afternoon heat',
        summary: 'Newly married Romeo refuses to fight Tybalt. An enraged Mercutio steps in and is mortally wounded under Romeo’s arm. In grief and fury, Romeo kills Tybalt.',
        iconicQuote: {
          verse: 'A plague o’ both your houses! They have made worms’ meat of me... O, I am fortune’s fool!',
          speaker: 'Mercutio & Romeo',
          modernTranslation: 'A curse upon both your families! They’ve made me food for worms... Oh, I am destiny’s helpless plaything!',
          dramaticSignificance: 'The hinge of the play: the romantic comedy dies with Mercutio and collapses into inevitable tragedy.',
        },
        decisionPrompt: 'Tybalt lies dead. The Prince arrives. Instead of execution, the Prince sentences Romeo to immediate banishment to Mantua. What do you do?',
        choices: [
          {
            text: 'Spend one passionate wedding night with Juliet in her chamber, then flee before sunrise to Mantua.',
            isCanon: true,
            consequence: 'Their tearful dawn parting is accompanied by the lark singing, oblivious that Lord Capulet has ordered Juliet to marry Count Paris in two days.',
            modernTakeaway: 'Joy and catastrophe arrive together.',
          },
          {
            text: 'Refuse to leave Verona; barricade yourself in the Capulet garden and demand an audience with the Prince.',
            isCanon: false,
            consequence: 'The Prince’s city watch would have captured Romeo and beheaded him before nightfall.',
            modernTakeaway: 'Exile was mercy in the eyes of Renaissance law.',
          },
        ],
        globeStagingSecret: 'Real steel rapiers and daggers were used in rapid, choreographed stage combat that sparks flew across the wooden boards.',
      },
      {
        act: 4,
        actRoman: 'Act IV',
        title: 'The Friar’s Sleeping Draught',
        setting: 'Friar Laurence’s cell, then Juliet’s bedchamber',
        summary: 'Threatened with being cast out onto the streets by her furious father if she refuses to marry Count Paris, Juliet goes to Friar Laurence with a dagger, ready to take her own life.',
        iconicQuote: {
          verse: 'Give me, give me! O tell not me of fear! Love give me strength! and strength shall help afford.',
          speaker: 'Juliet',
          modernTranslation: 'Give it to me, give it to me! Do not talk to me of fear! Love will grant me strength, and strength will rescue me.',
          dramaticSignificance: 'Juliet displays immense moral bravery, consenting to simulate death and wake among rotting ancestral corpses.',
        },
        decisionPrompt: 'Friar Laurence gives Juliet a vial of distilled herbs that will put her into a deathlike coma for 42 hours. What does she do?',
        choices: [
          {
            text: 'Drink the potion alone in her bed so her family believes she died of grief, while the Friar dispatches a letter to Romeo.',
            isCanon: true,
            consequence: 'Her nurse finds her cold body the next morning; the wedding feast turns into a funeral procession to the Capulet crypt.',
            modernTakeaway: 'Desperate circumstances inspire desperate gambles.',
          },
          {
            text: 'Confess the secret marriage to her parents and Count Paris, trusting in Christian forgiveness.',
            isCanon: false,
            consequence: 'Lord Capulet would have banished Juliet or locked her in a convent, but both children would have lived.',
            modernTakeaway: 'Fear of parental wrath often exceeds the fear of death.',
          },
        ],
        globeStagingSecret: 'The discovery space curtain was pulled open to reveal Juliet’s bed surrounded by black mourning tapestries.',
      },
      {
        act: 5,
        actRoman: 'Act V',
        title: 'The Tomb & The Tragedy of Seconds',
        setting: 'A dark churchyard; the Capulet family vault',
        summary: 'Friar John is quarantined due to the plague; the letter never reaches Mantua! Romeo hears only that Juliet is dead. He buys deadly apothecary poison and rushes to Verona.',
        iconicQuote: {
          verse: 'Here’s to my love! O true apothecary! Thy drugs are quick. Thus with a kiss I die... Yea, noise? then I’ll be brief. O happy dagger! This is thy sheath.',
          speaker: 'Romeo & Juliet',
          modernTranslation: 'Here is a toast to my love! O honest apothecary, your poison is swift. And so with a kiss, I die... Wait, voices? Then I must act quickly. O blessed dagger! My body is your sheath.',
          dramaticSignificance: 'The ultimate tragedy of timing: Romeo swallows the poison just minutes before Juliet awakes from the potion.',
        },
        decisionPrompt: 'Romeo breaks into the tomb and sees Juliet radiant in death. He has the vial of lethal poison in his hand. What does he do?',
        choices: [
          {
            text: 'Drink the poison immediately in overwhelming despair, kiss her lips, and expire by her side.',
            isCanon: true,
            consequence: 'Juliet awakens moments later, finds Romeo dead with the empty cup, and drives Romeo’s dagger into her heart.',
            modernTakeaway: 'The Capulets and Montagues gaze upon their dead children and finally drop their weapons in grief, erecting golden statues in their memory.',
          },
          {
            text: 'Sit quietly holding her hand for ten minutes to weep and say prayers.',
            isCanon: false,
            consequence: 'Juliet would have opened her eyes, Romeo would have dropped the poison, and they would have fled together to Mantua!',
            modernTakeaway: 'A few moments of patience could have conquered the tragedy.',
          },
        ],
        globeStagingSecret: 'A prop stone tomb was placed over the main trapdoor, with torches illuminating the two lovers lying side by side.',
      },
    ],
  },
  {
    id: 'hamlet',
    title: 'Hamlet',
    genre: 'Tragedy',
    genreBadgeColor: '#7c3aed',
    tagline: 'The Ghost of Elsinore, the poisoned cup, and the mystery of existence.',
    coreQuestion: 'When confronted with corrupt authority, is it nobler to suffer or to strike back?',
    overview: 'Prince Hamlet of Denmark mourns the sudden death of his father and the hasty marriage of his mother Gertrude to his uncle Claudius. When his father’s ghost appears on the castle ramparts claiming Claudius poisoned him, Hamlet vows revenge but is paralyzed by existential contemplation.',
    icon: '💀',
    themeColor: '#4c1d95',
    acts: [
      {
        act: 1,
        actRoman: 'Act I',
        title: 'The Ghost on the Ramparts',
        setting: 'The freezing battlements of Elsinore Castle, midnight',
        summary: 'Sentries witness an armored apparition resembling the late King. Hamlet joins the watch, encounters the spirit, and hears the terrifying truth of his father’s murder.',
        iconicQuote: {
          verse: 'Something is rotten in the state of Denmark... The serpent that did sting thy father’s life now wears his crown.',
          speaker: 'Marcellus & The Ghost',
          modernTranslation: 'Something is deeply corrupt in the government of Denmark... The snake that poisoned your father is currently wearing his royal crown.',
          dramaticSignificance: 'Reveals the central corruption of the court: regicide and fratricide covered by state pomp.',
        },
        decisionPrompt: 'The ghost commands you: "Revenge his foul and most unnatural murder, but taint not thy mind nor let thy soul contrive against thy mother." What do you do?',
        choices: [
          {
            text: 'Swear your companions to secrecy on your sword-hilt and adopt an "antic disposition" (feigned madness).',
            isCanon: true,
            consequence: 'Hamlet acts unhinged, confusing the court, testing Ophelia, and buying time to verify if the ghost was honest or a devil.',
            modernTakeaway: 'Pretending to be mad allows one to speak uncomfortable truths to power.',
          },
          {
            text: 'Draw your sword immediately, storm the banqueting hall, and challenge Uncle Claudius in front of the court.',
            isCanon: false,
            consequence: 'Hamlet would have been cut down by the royal Swiss guards as an assassin, with no proof of Claudius’s hidden crime.',
            modernTakeaway: 'Revenge against an entrenched monarch requires verifiable evidence.',
          },
        ],
        globeStagingSecret: 'The ghost spoke through an echo megaphone beneath the stage planks ("Hell"), giving his voice a hollow, subterranean rumble.',
      },
      {
        act: 2,
        actRoman: 'Act II',
        title: 'Antic Madness & The Actors Arrive',
        setting: 'The corridors of Elsinore Castle',
        summary: 'Claudius summons Hamlet’s schoolfellows Rosencrantz and Guildenstern to spy on him. Lord Chamberlain Polonius believes Hamlet is mad for love of Ophelia. A troop of traveling players arrives.',
        iconicQuote: {
          verse: 'Though this be madness, yet there is method in ’t... What a piece of work is a man! how noble in reason! how infinite in faculty!',
          speaker: 'Polonius & Hamlet',
          modernTranslation: 'Even if this is insanity, there is a sharp logic behind it... What a masterpiece is a human being! How noble in reason, how infinite in talent!',
          dramaticSignificance: 'Contrasts Renaissance humanist ideals of human greatness against Hamlet’s profound disgust with corruption.',
        },
        decisionPrompt: 'The traveling actors perform a speech about the fall of Troy with tears in their eyes. Hamlet realizes an actor wept for fictional Hecuba while he has taken no action for his murdered father! What does he do?',
        choices: [
          {
            text: 'Write extra dialogue for the actors to stage a play depicting the exact murder of his father to watch Claudius’s reaction.',
            isCanon: true,
            consequence: '"The play’s the thing wherein I’ll catch the conscience of the King!" Hamlet sets up an empirical psychological test.',
            modernTakeaway: 'Art can serve as an unmasking mirror for guilty consciences.',
          },
          {
            text: 'Abandon revenge entirely, charter a ship back to Wittenberg university, and resume philosophy studies.',
            isCanon: false,
            consequence: 'Hamlet would have lived in peace as a scholar, but Danish justice would have remained buried in Claudius’s lies.',
            modernTakeaway: 'Conscience often refuses to let us walk away from injustice.',
          },
        ],
        globeStagingSecret: 'The traveling troupe performed right on the thrust stage, playing a play-within-a-play while the real actors sat as spectators.',
      },
      {
        act: 3,
        actRoman: 'Act III',
        title: 'The Mousetrap & The Bedchamber',
        setting: 'The Great Hall, then Queen Gertrude’s private chamber',
        summary: 'Before the play, Hamlet contemplates suicide. The play is performed; Claudius leaps up, crying for light! Later, Hamlet confronts his mother in her room and accidentally kills Polonius hiding behind the tapestry.',
        iconicQuote: {
          verse: 'To be, or not to be, that is the question: Whether ’tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.',
          speaker: 'Hamlet',
          modernTranslation: 'To live, or to cease existing—that is the fundamental choice: is it more dignified to endure the brutal injuries of fate, or to fight back against an ocean of troubles?',
          dramaticSignificance: 'The most celebrated soliloquy in literature: weighing the pain of mortal life against the fear of the unknown after death.',
        },
        decisionPrompt: 'On his way to Gertrude’s room, Hamlet finds Claudius kneeling alone in prayer. It is the perfect moment to kill him without guards! What does Hamlet do?',
        choices: [
          {
            text: 'Sheathe the sword, refusing to kill him while praying because his soul might go straight to heaven instead of paying for his sins.',
            isCanon: true,
            consequence: 'Hamlet walks away. Claudius rises, admitting his words flew up but his thoughts remained below—his prayer was empty!',
            modernTakeaway: 'Over-intellectualizing an opportunity often leads to missing it completely.',
          },
          {
            text: 'Thrust the blade through Claudius’s back and avenge your father instantly.',
            isCanon: false,
            consequence: 'Claudius would have died, saving Polonius, Ophelia, Gertrude, Laertes, and Hamlet from the massacre in Act V.',
            modernTakeaway: 'Hamlet’s hesitation is both his tragic flaw and the core of his humanity.',
          },
        ],
        globeStagingSecret: 'Polonius hid behind a real embroidered Arras cloth hung from the gallery; when Hamlet stabbed it, the fabric billowed with dust.',
      },
      {
        act: 4,
        actRoman: 'Act IV',
        title: 'Ophelia’s Madness & The Poisoned Plot',
        setting: 'The castle garden, then the riverbank',
        summary: 'Claudius exiles Hamlet to England with secret letters ordering his execution. Hamlet escapes via pirates. Broken by her father’s death and Hamlet’s cruelty, Ophelia drowns in the brook. Laertes returns seeking blood.',
        iconicQuote: {
          verse: 'There’s rosemary, that’s for remembrance; pray, love, remember: and there is pansies, that’s for thoughts... Good night, sweet ladies, good night.',
          speaker: 'Ophelia',
          modernTranslation: 'Here is rosemary, that is for remembering; please remember: and here are pansies for thoughts... Good night, gracious ladies, good night.',
          dramaticSignificance: 'Ophelia hands out symbolic flowers that subtly condemn the guilt and adultery of the court.',
        },
        decisionPrompt: 'Claudius manipulates grief-stricken Laertes into a treacherous plot against Hamlet: an exhibition fencing match where Laertes’ sword is unbuttoned and dipped in lethal venom. What do they prepare?',
        choices: [
          {
            text: 'Agree to poison the sword tip AND prepare a poisoned chalice of wine in case Hamlet gets thirsty.',
            isCanon: true,
            consequence: 'A redundant trap of pure evil that will backfire fatally on both conspirators.',
            modernTakeaway: 'Villainy relies on excessive insurance that poisons its own architects.',
          },
          {
            text: 'Demand a fair, honorable trial by combat before the High Court of Denmark.',
            isCanon: false,
            consequence: 'Laertes would have maintained his honor as a knight rather than becoming Claudius’s pawn.',
            modernTakeaway: 'Blind grief makes people susceptible to political manipulation.',
          },
        ],
        globeStagingSecret: 'Ophelia entered wearing white with wild flowers woven into her unpinned hair, singing Elizabethan folk ballads.',
      },
      {
        act: 5,
        actRoman: 'Act V',
        title: 'The Graveyard & The Final Carnage',
        setting: 'A churchyard with open graves, then the duel in the castle hall',
        summary: 'Hamlet contemplates the skull of Yorick. At the duel, Gertrude unknowingly drinks the poisoned cup. Laertes wounds Hamlet with the poisoned rapier; in the scuffle, Hamlet takes Laertes’ sword and strikes him back.',
        iconicQuote: {
          verse: 'Alas, poor Yorick! I knew him, Horatio: a fellow of infinite jest, of most excellent fancy... The rest is silence.',
          speaker: 'Hamlet',
          modernTranslation: 'Alas, poor Yorick! I knew him well, Horatio: a man of endless humor and wondrous wit... What remains is silence.',
          dramaticSignificance: 'Acceptance of mortality: emperors and jesters turn equally into clay.',
        },
        decisionPrompt: 'Dying of poison, Laertes confesses the whole plot: "The King, the King’s to blame!" Queen Gertrude lies dead. What is Hamlet’s final act?',
        choices: [
          {
            text: 'Stab Claudius with the envenomed point AND force him to drink the remaining poisoned wine, completing the vengeance.',
            isCanon: true,
            consequence: 'Hamlet names Prince Fortinbras of Norway as the rightful new king and dies in Horatio’s arms: "Good night, sweet prince."',
            modernTakeaway: 'Justice is finally accomplished, but at the cost of the entire Danish royal house.',
          },
          {
            text: 'Forgive Claudius, sit on the throne, and issue a royal decree abolishing the monarchy.',
            isCanon: false,
            consequence: 'Hamlet’s duty was blood revenge demanded by the ghost; forgiveness was not an option in Elizabethan revenge tragedy.',
            modernTakeaway: 'The tragedy fulfills its grim promise of total catharsis.',
          },
        ],
        globeStagingSecret: 'Real human bones and earth were shoveled out of the trapdoor during the Gravedigger scene to provide tactile realism.',
      },
    ],
  },
  {
    id: 'midsummer',
    title: 'A Midsummer Night’s Dream',
    genre: 'Comedy',
    genreBadgeColor: '#059669',
    tagline: 'Fairy enchantments, lover mix-ups, and the donkey-headed weaver in the forest.',
    coreQuestion: 'How does imagination transform reality, and why is love both foolish and magical?',
    overview: 'Four young Athenian lovers flee into a moonlit enchanted forest to escape strict laws. In the woods, fairy king Oberon and mischievous sprite Puck deploy a magical purple flower that makes people fall passionately in love with the first creature they see upon waking.',
    icon: '🧚',
    themeColor: '#064e3b',
    acts: [
      {
        act: 1,
        actRoman: 'Act I',
        title: 'The Law of Athens & The Flight',
        setting: 'The palace of Duke Theseus, Athens',
        summary: 'Hermia refuses to marry Demetrius because she loves Lysander. Her father demands her execution under Athenian law. Hermia and Lysander plan to elope through the enchanted woods.',
        iconicQuote: {
          verse: 'The course of true love never did run smooth... Love looks not with the eyes, but with the mind; and therefore is winged Cupid painted blind.',
          speaker: 'Lysander & Helena',
          modernTranslation: 'True love has never experienced an easy path... Love sees with the imagination rather than physical sight, which is why Cupid is depicted blind.',
          dramaticSignificance: 'The core axiom of the comedy: love is an irrational, subjective trick of the human mind.',
        },
        decisionPrompt: 'Helena is desperately in love with Demetrius, who scorns her. Hermia confides their secret escape plan to Helena. What does Helena do?',
        choices: [
          {
            text: 'Betray Hermia’s secret to Demetrius so he pursues them into the woods, just for an excuse to follow him.',
            isCanon: true,
            consequence: 'All four lovers end up chasing each other through the pitch-black forest, straight into the realm of the fairies.',
            modernTakeaway: 'Jealousy makes lovers act against their friends.',
          },
          {
            text: 'Wish Hermia and Lysander Godspeed, stay in Athens, and find a sensible new partner.',
            isCanon: false,
            consequence: 'Sensible decisions have no place in romantic comedy! The magical mayhem requires all four lovers in the forest.',
            modernTakeaway: 'Comedy thrives on chaotic emotional impulses.',
          },
        ],
        globeStagingSecret: 'Actors dressed in ancient Greek chitons while the working-class artisans wore rough Elizabethan woolens.',
      },
      {
        act: 2,
        actRoman: 'Act II',
        title: 'Puck & The Purple Love-Juice',
        setting: 'The enchanted forest, fairy realm',
        summary: 'Fairy King Oberon and Queen Titania are quarreling. Oberon orders sprite Puck to fetch the magical flower "Love-in-Idleness," whose juice rubbed on sleeping eyelids induces instant mad love.',
        iconicQuote: {
          verse: 'I’ll put a girdle round about the earth in forty minutes... Fetch me that flower; the herb I showed thee once: The juice of it on sleeping eyelids laid.',
          speaker: 'Puck & Oberon',
          modernTranslation: 'I will circle the globe in forty minutes... Bring me that flower I showed you before: its juice squeezed onto sleeping eyelids.',
          dramaticSignificance: 'Showcases Puck’s effortless supernatural speed and the introduction of the comic catalyst.',
        },
        decisionPrompt: 'Oberon tells Puck to find an Athenian youth (Demetrius) who is cruelty rejecting a lady. Puck finds Lysander asleep next to Hermia wearing Athenian clothes! What does Puck do?',
        choices: [
          {
            text: 'Assume Lysander is the right man and squeeze the purple flower juice onto his sleeping eyelids.',
            isCanon: true,
            consequence: 'Helena wanders by, Lysander wakes up, instantly falls madly in love with Helena, and abandons Hermia in the woods!',
            modernTakeaway: 'Mistaken identity is the engine of farce.',
          },
          {
            text: 'Double-check his face, ask for identification, and wait until he finds Demetrius.',
            isCanon: false,
            consequence: 'If Puck had been competent, there would be no play! His honest blunders create the masterpiece.',
            modernTakeaway: 'Puck’s gleeful incompetence creates comic art.',
          },
        ],
        globeStagingSecret: 'Puck leaped from the Heavens down a rope or darted between the twin pillars to convey supernatural agility.',
      },
      {
        act: 3,
        actRoman: 'Act III',
        title: 'The Ass-Head & Queen in Love',
        setting: 'Deep in the woods, near Queen Titania’s bower',
        summary: 'Six bumbling working-class artisans (the Mechanicals) rehearse a terrible play for the Duke. Puck transforms loud-mouthed weaver Nick Bottom into a donkey! Bewitched Titania awakes and falls in love with him.',
        iconicQuote: {
          verse: 'Lord, what fools these mortals be!... I pray thee, gentle mortal, sing again: Mine ear is much enamour’d of thy note; so is mine eye enthralled to thy shape.',
          speaker: 'Puck & Queen Titania',
          modernTranslation: 'Good Lord, what ridiculous idiots these humans are!... Please, sweet human, sing again: my ear is captivated by your melody, and my eye is enchanted by your beauty.',
          dramaticSignificance: 'The height of absurd comedy: the proud Fairy Queen caressing a foolish man with donkey ears eating hay.',
        },
        decisionPrompt: 'Puck also enchants Demetrius so both men are now furiously in love with Helena! Hermia thinks Helena stole Lysander; Helena thinks all three are mocking her! What happens?',
        choices: [
          {
            text: 'A wild, hilarious four-way screaming argument where the men try to duel and the women try to scratch each other’s eyes out.',
            isCanon: true,
            consequence: 'Puck watches in delight: "This their jangling I esteem a sport!" Oberon scolds Puck and orders him to fix the confusion.',
            modernTakeaway: 'Human lovers look completely ridiculous from a detached perspective.',
          },
          {
            text: 'They sit down in a circle and calmly discuss boundary issues with an Athenian mediator.',
            isCanon: false,
            consequence: 'Romantic confusion must peak in complete comic exhaustion before harmony can be restored.',
            modernTakeaway: 'Comedy requires characters to reach absolute fever pitch.',
          },
        ],
        globeStagingSecret: 'A realistic papier-mâché donkey head with moving ears and open mouth was fitted over the actor playing Bottom.',
      },
      {
        act: 4,
        actRoman: 'Act IV',
        title: 'Oberon’s Compassion & Morning Light',
        setting: 'The forest at daybreak; sounds of hunting horns',
        summary: 'Having obtained the child he wanted from Titania, Oberon feels pity. He removes the spell from her eyes, Puck removes Bottom’s donkey head, and the lovers awaken to the morning horns of Duke Theseus.',
        iconicQuote: {
          verse: 'I have had a dream, past the wit of man to say what dream it was: man is but an ass, if he go about to expound this dream.',
          speaker: 'Nick Bottom',
          modernTranslation: 'I experienced a dream that is beyond human intelligence to explain: a man is a fool if he tries to interpret this dream.',
          dramaticSignificance: 'Poetic wonder: even the most foolish artisan has touched the divine magic of imagination.',
        },
        decisionPrompt: 'Duke Theseus finds the four lovers asleep together in harmony. Lysander loves Hermia; Demetrius loves Helena. Egeus still demands Hermia’s punishment. What does Theseus rule?',
        choices: [
          {
            text: 'Overrule Egeus’s harsh law: decree that all three couples will be married together in a triple royal wedding feast.',
            isCanon: true,
            consequence: 'Law yields to love; Athens and the forest unite in celebration.',
            modernTakeaway: 'Wise leaders know when to let compassion supersede outdated laws.',
          },
          {
            text: 'Enforce Athenian law strictly and send Hermia to a nunnery.',
            isCanon: false,
            consequence: 'Comedy requires a festive wedding ending; enforcing punishment would ruin the comic harmony.',
            modernTakeaway: 'A comedy always ends with a wedding feast.',
          },
        ],
        globeStagingSecret: 'Real brass hunting horns were sounded from the upper gallery to signal the break of dawn and the retreat of the night spirits.',
      },
      {
        act: 5,
        actRoman: 'Act V',
        title: 'Pyramus & Thisbe & Puck’s Blessing',
        setting: 'The Great Hall of the Athenian Palace',
        summary: 'At the wedding feast, the artisans perform their hilarious tragedy of *Pyramus and Thisbe*. The audience roars with laughter. At midnight, the fairies enter to bless the marriages.',
        iconicQuote: {
          verse: 'If we shadows have offended, think but this, and all is mended, that you have but slumbered here while these visions did appear.',
          speaker: 'Puck',
          modernTranslation: 'If we actors have caused any offense, just remember this: pretend you were merely asleep here while these dreams appeared.',
          dramaticSignificance: 'The famous epilogue breaking the fourth wall: the theatre itself is a shared midsummer dream.',
        },
        decisionPrompt: 'The actors conclude their terrible play. The clock strikes midnight ("fairy time"). Puck steps down to the front edge of the thrust stage to speak to the audience. What does he ask for?',
        choices: [
          {
            text: 'Ask the audience to clap their hands ("Give me your hands, if we be friends") to seal the theatrical bond.',
            isCanon: true,
            consequence: 'The Globe erupts into thunderous applause, uniting commoners, nobles, and actors in shared joy.',
            modernTakeaway: 'Theatre is a communal pact of goodwill.',
          },
          {
            text: 'Demand an extra admission fee before anyone can leave the yard.',
            isCanon: false,
            consequence: 'The groundlings would have pelted him with stale hazelnuts!',
            modernTakeaway: 'A gracious bow wins hearts every time.',
          },
        ],
        globeStagingSecret: 'Candles in lanterns were carried by fairy actors in darkness to create magical dancing firelight across the wooden amphitheater.',
      },
    ],
  },
  {
    id: 'the-tempest',
    title: 'The Tempest',
    genre: 'Romance',
    genreBadgeColor: '#0284c7',
    tagline: 'Sorcery, shipwreck, forgiveness, and the breaking of the magic staff.',
    coreQuestion: 'When you possess absolute power over your enemies, is revenge sweet or is forgiveness divine?',
    overview: 'Exiled on an uncharted Mediterranean island for twelve years, sorcerer Prospero uses his magic books and aerial spirit Ariel to summon a tempest that shipwrecks his treacherous brother Antonio and the King of Naples onto his shores.',
    icon: '⚡',
    themeColor: '#075985',
    acts: [
      {
        act: 1,
        actRoman: 'Act I',
        title: 'The Shipwreck & The Island',
        setting: 'A storm-tossed galleon at sea, then an enchanted island',
        summary: 'Thunder and lightning smash the royal ship. Prospero reveals to his daughter Miranda that he was once Duke of Milan until his brother Antonio usurped his throne with the help of Alonso, King of Naples.',
        iconicQuote: {
          verse: 'What cares these roarers for the name of king? To cabin: silence! trouble us not... O, I have suffered with those that I saw suffer.',
          speaker: 'Boatswain & Miranda',
          modernTranslation: 'What do these roaring waves care about the title of king? Get to your cabins, quiet! Stop bothering us... Oh, I suffered with those I watched suffering.',
          dramaticSignificance: 'Nature’s tempest levels all social hierarchies: kings and sailors drown alike.',
        },
        decisionPrompt: 'Miranda weeps for the drowned sailors. Prospero touches her with his magic mantle and assures her that no soul has perished. What does he ask Ariel to do with Prince Ferdinand?',
        choices: [
          {
            text: 'Lead Ferdinand alone with singing music to Prospero’s cell so he and Miranda meet and fall in love at first sight.',
            isCanon: true,
            consequence: 'Ferdinand hears Ariel’s song ("Full fathom five thy father lies") and sees Miranda, thinking she is the goddess of the island.',
            modernTakeaway: 'Love can heal ancient political wounds.',
          },
          {
            text: 'Drown Ferdinand in the surf to punish King Alonso with the loss of his heir.',
            isCanon: false,
            consequence: 'Prospero is not a villain; his magic seeks reconciliation rather than bloody revenge.',
            modernTakeaway: 'True authority seeks restoration, not carnage.',
          },
        ],
        globeStagingSecret: 'Metal thunder-sheets were shaken in the Heavens while squibs (small fireworks) were ignited on wires to simulate lightning strikes.',
      },
      {
        act: 2,
        actRoman: 'Act II',
        title: 'The Conspiracy & The Monster',
        setting: 'Another part of the island, desolate marshes',
        summary: 'King Alonso weeps for his supposedly drowned son. Wicked Antonio plots with Sebastian to assassinate Alonso while he sleeps to seize the crown of Naples. Meanwhile, jester Trinculo finds earthy monster Caliban.',
        iconicQuote: {
          verse: 'Misery acquaints a man with strange bedfellows... What have we here? a man or a fish? dead or alive? A strange fish!',
          speaker: 'Trinculo',
          modernTranslation: 'Misfortune introduces a person to bizarre companions... What do we have here? A human or a fish? A strange fish!',
          dramaticSignificance: 'Comic relief satirizing colonialism: Europeans immediately consider exploiting the native island inhabitant for carnival profit.',
        },
        decisionPrompt: 'Caliban tastes wine from drunken butler Stephano and worships him as a god dropped from the moon. Caliban promises to guide them to murder Prospero! How does Caliban plead?',
        choices: [
          {
            text: 'Plead with Stephano: "First to possess his books; for without them he’s but a sot, as I am."',
            isCanon: true,
            consequence: 'Caliban understands that Prospero’s sole source of power is his library of learning.',
            modernTakeaway: 'Knowledge and books are the ultimate sources of sovereignty.',
          },
          {
            text: 'Attack Prospero with his bare hands right away.',
            isCanon: false,
            consequence: 'Ariel’s invisible spirits would have pinched Caliban with cramps and side-stitches immediately.',
            modernTakeaway: 'Direct force is helpless against intellectual mastery.',
          },
        ],
        globeStagingSecret: 'The actor playing Caliban wore fish scales and animal hides, speaking in poetic blank verse that astonished audiences.',
      },
      {
        act: 3,
        actRoman: 'Act III',
        title: 'The Harpy’s Phantom Banquet',
        setting: 'Rocky cliff tops of the island',
        summary: 'Exhausted and starving, the King and his courtiers are tempted by a magical feast set out by dancing spirits. As they reach for food, Ariel descends as a monstrous Harpy with thunder claps.',
        iconicQuote: {
          verse: 'You are three men of sin, whom Destiny... hath caused to belch up you on this island; where man doth not inhabit.',
          speaker: 'Ariel as Harpy',
          modernTranslation: 'You are three sinful men, whom Fate has caused the sea to vomit up onto this uninhabited island.',
          dramaticSignificance: 'Prospero confronts his usurpers with their crimes through supernatural moral judgment.',
        },
        decisionPrompt: 'The courtiers draw their swords against Ariel, but their blades are rendered miraculously heavy and frozen in mid-air. What happens to King Alonso?',
        choices: [
          {
            text: 'He is struck with overwhelming guilt and runs toward the sea, remembering how he cast Prospero and infant Miranda adrift.',
            isCanon: true,
            consequence: 'True repentance begins: Alonso acknowledges his sin and seeks to atone.',
            modernTakeaway: 'Confrontation with guilt is the necessary precursor to forgiveness.',
          },
          {
            text: 'He laughs at the bird and tries to barbecue it over a driftwood fire.',
            isCanon: false,
            consequence: 'The courtiers are completely unhinged by terror; defiance in front of divine judgment is impossible.',
            modernTakeaway: 'Guilt strips tyrants of their swagger.',
          },
        ],
        globeStagingSecret: 'Ariel was lowered on a mechanical rope harness from the Heavens wearing giant feathered harpy wings that clapped over the banquet table.',
      },
      {
        act: 4,
        actRoman: 'Act IV',
        title: 'The Vision of Ceres & The Realization',
        setting: 'Outside Prospero’s cell',
        summary: 'Prospero gives his blessing to Ferdinand and Miranda. He conjures a sparkling classical masque of Roman goddesses (Iris, Ceres, Juno) to bless their union with abundance, but suddenly remembers Caliban’s conspiracy.',
        iconicQuote: {
          verse: 'We are such stuff as dreams are made on, and our little life is rounded with a sleep... The cloud-capped towers, the gorgeous palaces, the solemn temples, the great globe itself... shall dissolve.',
          speaker: 'Prospero',
          modernTranslation: 'We are made of the exact same material as dreams, and our small lifespan is framed by sleep... The tallest towers, splendid palaces, holy temples, and even this theatre itself will vanish into thin air.',
          dramaticSignificance: 'Shakespeare’s bittersweet farewell to the stage: art, theatre, and mortal empires are all transient illusions.',
        },
        decisionPrompt: 'Caliban, Stephano, and Trinculo sneak toward the cell, but are distracted by glitzy royal costumes hanging on a lime tree. What does Prospero unleash?',
        choices: [
          {
            text: 'Summon spirits in the shape of hunting dogs ("Mountain! Silver! Fury!") to chase the drunkards through briars and mud.',
            isCanon: true,
            consequence: 'The clowns are routed in comic terror, soaked in filthy horse ponds.',
            modernTakeaway: 'Greed for cheap glitter always distracts fools from their goals.',
          },
          {
            text: 'Execute all three for treason on the spot.',
            isCanon: false,
            consequence: 'Prospero’s trajectory is transcendence, not retribution.',
            modernTakeaway: 'True power laughs at petty treason rather than slaughtering it.',
          },
        ],
        globeStagingSecret: 'Actors mimicked baying hunting hounds, barking through megaphones from all sides of the amphitheater.',
      },
      {
        act: 5,
        actRoman: 'Act V',
        title: 'The Staff Broken & Universal Freedom',
        setting: 'Prospero’s enchanted circle',
        summary: 'All enemies stand paralyzed in Prospero’s magic circle. Ariel reports that if Prospero saw their sorrow, his heart would tender. Prospero makes the supreme moral choice: virtue over vengeance.',
        iconicQuote: {
          verse: 'The rarer action is in virtue than in vengeance... I’ll break my staff, bury it certain fathoms in the earth, and deeper than did ever plummet sound I’ll drown my book.',
          speaker: 'Prospero',
          modernTranslation: 'The nobler deed lies in forgiveness rather than revenge... I will snap my magic staff, bury it deep in the earth, and drown my spellbook deeper than any anchor ever dropped.',
          dramaticSignificance: 'The ultimate climax of Shakespeare’s career: renouncing supernatural dominance to embrace mortal vulnerability and Christian forgiveness.',
        },
        decisionPrompt: 'Prospero reveals himself to his brother Antonio and King Alonso. Alonso restores Milan to him and begs forgiveness. Prospero turns to Ariel. What is his final promise?',
        choices: [
          {
            text: 'Grant Ariel absolute, unconditional freedom to the elements, and ask the audience to set himself free with their applause.',
            isCanon: true,
            consequence: '"To the elements be free, and fare thou well!" Prospero returns to Milan as a mortal man whose every third thought shall be his grave.',
            modernTakeaway: 'Freedom is the highest gift power can bestow.',
          },
          {
            text: 'Keep Ariel as his servant in Milan to help govern the city with psychic surveillance.',
            isCanon: false,
            consequence: 'Prospero’s entire journey is about learning to let go: of power, of magic, of his daughter, and of grievance.',
            modernTakeaway: 'To master life is to master the art of release.',
          },
        ],
        globeStagingSecret: 'Prospero took off his velvet wizard robe on stage, leaving him in a simple nobleman’s doublet, snapping a wooden rod in two with a sharp crack.',
      },
    ],
  },
  {
    id: 'julius-caesar',
    title: 'Julius Caesar',
    genre: 'History',
    genreBadgeColor: '#b45309',
    tagline: 'The Ides of March, the Roman Senate assassination, and Antony’s rhetoric.',
    coreQuestion: 'Can you assassinate a dictator to save a democracy without destroying the republic?',
    overview: 'As Julius Caesar’s military triumphs threaten to turn the Roman Republic into an autocracy, noble senator Marcus Brutus is persuaded by Cassius to join a conspiracy of patriots. They assassinate Caesar in the Senate on the Ides of March, sparking civil war.',
    icon: '🗡️',
    themeColor: '#78350f',
    acts: [
      {
        act: 1,
        actRoman: 'Act I',
        title: 'The Ides of March Warning',
        setting: 'A crowded street in Rome during the festival of Lupercal',
        summary: 'A soothsayer calls out from the crowd warning Caesar to beware the Ides of March. Meanwhile, Cassius begins testing noble Brutus, pointing out that Caesar is merely a mortal man who gets fevers and almost drowned.',
        iconicQuote: {
          verse: 'Beware the ides of March... The fault, dear Brutus, is not in our stars, but in ourselves, that we are underlings.',
          speaker: 'Soothsayer & Cassius',
          modernTranslation: 'Be on your guard on March 15th... The blame, dear Brutus, does not lie in our destiny, but in our own passivity that allows us to be subservient.',
          dramaticSignificance: 'Challenges fatalism: free citizens are responsible when they allow tyrants to accumulate unchecked power.',
        },
        decisionPrompt: 'Crowds cheer as Mark Antony offers Caesar a symbolic laurel crown three times. Caesar reluctantly refuses each time. What does Brutus conclude?',
        choices: [
          {
            text: 'Worry that Caesar will eventually accept absolute imperial power, extinguishing Roman democratic liberty.',
            isCanon: true,
            consequence: 'Brutus agrees to meet Cassius at midnight to discuss how to preserve the Republic.',
            modernTakeaway: 'Authoritarian power rarely stops expanding on its own.',
          },
          {
            text: 'Congratulate Caesar on his coronation and ask for an appointment as governor of Gaul.',
            isCanon: false,
            consequence: 'Brutus’s ancestral honor and dedication to the Republic would never allow him to become a sycophant.',
            modernTakeaway: 'Principled leaders place democratic ideals above personal profit.',
          },
        ],
        globeStagingSecret: 'Actors wore authentic Roman wool togas draped over Elizabethan doublets, carrying laurel wreaths.',
      },
      {
        act: 2,
        actRoman: 'Act II',
        title: 'The Orchard at Midnight',
        setting: 'Brutus’s orchard, thunder and meteors blazing in the sky',
        summary: 'Brutus paces in the dark, wrestling with his love for Caesar versus his love for Rome. The conspirators arrive in cloaks. Cassius suggests also assassinating Mark Antony, but Brutus refuses.',
        iconicQuote: {
          verse: 'It must be by his death: and for my part, I know no personal cause to spurn at him, but for the general... Let’s be sacrificers, but not butchers, Caius.',
          speaker: 'Brutus',
          modernTranslation: 'His death is the only solution: and for my part, I have no personal grievance against him, but act solely for the public welfare... Let us be principled sacrificers, not savage butchers.',
          dramaticSignificance: 'Brutus’s idealism is his fatal flaw: he attempts to commit a violent political murder with pristine ethical purity.',
        },
        decisionPrompt: 'Cassius urges: "Let Antony and Caesar fall together!" Antony is Caesar’s shrewdest general. What does Brutus decree?',
        choices: [
          {
            text: 'Spare Antony: "Antony is but a limb of Caesar; when the head is off, what can the arm do?"',
            isCanon: true,
            consequence: 'Spared Antony will turn the entire Roman populace against the conspirators in Act III.',
            modernTakeaway: 'Underestimating a political opponent out of moral pride is disastrous.',
          },
          {
            text: 'Assassinate Mark Antony alongside Caesar in the Senate.',
            isCanon: false,
            consequence: 'The conspiracy would have seized total control of Rome without opposition, but Brutus would have felt morally compromised.',
            modernTakeaway: 'Political coups rarely remain neat or contained.',
          },
        ],
        globeStagingSecret: 'Portia (Brutus’s wife) knelt on the cold stage boards to plead for his confidence, highlighting the human cost of conspiracy.',
      },
      {
        act: 3,
        actRoman: 'Act III',
        title: 'The Senate Blood & Antony’s Speech',
        setting: 'The Roman Senate House (Capitol), then the Forum',
        summary: 'On the morning of the Ides of March, Caesar enters the Senate. The conspirators surround him with petitions, draw their daggers, and strike. Antony arrives, feigns friendship, and is permitted to speak at Caesar’s funeral.',
        iconicQuote: {
          verse: 'Et tu, Brute? Then fall, Caesar!... Friends, Romans, countrymen, lend me your ears; I come to bury Caesar, not to praise him.',
          speaker: 'Caesar & Mark Antony',
          modernTranslation: 'Even you, Brutus? Then die, Caesar!... Friends, citizens of Rome, give me your attention; I come to lay Caesar in his grave, not to deliver praise.',
          dramaticSignificance: 'The greatest rhetorical masterclass in English: Antony uses irony, Caesar’s bloody cloak, and his will to incite a violent mutiny while pretending to be impartial.',
        },
        decisionPrompt: 'Antony shows the mob the 33 knife holes in Caesar’s mantle and reveals Caesar bequeathed 75 drachmas to every Roman citizen in his will. What does the crowd do?',
        choices: [
          {
            text: 'Riot through the streets of Rome with torches: "Revenge! About! Seek! Burn! Fire! Kill! Slay! Let not a traitor live!"',
            isCanon: true,
            consequence: 'Brutus and Cassius are driven out of Rome at gallop as Antony and Octavius Caesar form a triumvirate.',
            modernTakeaway: 'Mob emotion easily overpowers abstract intellectual reason.',
          },
          {
            text: 'Politely thank Antony, take their money, and vote for Brutus in the next election.',
            isCanon: false,
            consequence: 'Antony understood mass psychology: people are moved by grief, blood, and indignation, not constitutional debates.',
            modernTakeaway: 'Rhetoric is the sharpest weapon in political conflict.',
          },
        ],
        globeStagingSecret: 'Pig’s blood stored in bladders inside Caesar’s tunic burst onto the actors’ hands as they struck one after another.',
      },
      {
        act: 4,
        actRoman: 'Act IV',
        title: 'The Quarrel in the Tent & Caesar’s Ghost',
        setting: 'Military camp near Sardis, Asia Minor',
        summary: 'In exile with their rebel legions, Brutus and Cassius argue bitterly in Brutus’s military tent over bribery and money. They reconcile after Brutus reveals his wife Portia swallowed hot coals in despair. That night, Caesar’s ghost appears.',
        iconicQuote: {
          verse: 'There is a tide in the affairs of men, which, taken at the flood, leads on to fortune... Thou shalt see me at Philippi.',
          speaker: 'Brutus & Caesar’s Ghost',
          modernTranslation: 'There is a tide in human opportunities: if you ride it when it crests, it carries you to success... You will see me again at Philippi.',
          dramaticSignificance: 'Brutus overrules Cassius’s military judgment to march to Philippi, walking directly into their doom.',
        },
        decisionPrompt: 'At midnight, while Brutus reads by candlelight, a spectral apparition of murdered Caesar enters his tent. "I am thy evil spirit, Brutus." What does Brutus do?',
        choices: [
          {
            text: 'Face the specter calmly: "Why, I will see thee at Philippi then," and immediately order his generals to march at dawn.',
            isCanon: true,
            consequence: 'The army marches to the plains of Philippi to meet Antony and Octavius in decisive battle.',
            modernTakeaway: 'Stoic courage faces guilt and fate without fleeing.',
          },
          {
            text: 'Flee the tent in terror, surrender his legions, and plead for clemency from Octavius.',
            isCanon: false,
            consequence: 'Brutus was a Roman Stoic philosopher; even when confronted by the supernatural, he refuses to lose composure.',
            modernTakeaway: 'Stoicism prioritizes dignity over self-preservation.',
          },
        ],
        globeStagingSecret: 'The taper candle was dimmed with a hidden shutter to signal the entrance of a ghost, as Elizabethan audiences believed flames turned blue in the presence of spirits.',
      },
      {
        act: 5,
        actRoman: 'Act V',
        title: 'The Battle of Philippi & The Noblest Roman',
        setting: 'The battlefield of Philippi, northern Greece',
        summary: 'The battle turns against the conspirators. Cassius misinterprets the scout report and orders his servant to slay him. Seeing all lost, Brutus runs upon his own sword rather than be paraded through Rome in chains.',
        iconicQuote: {
          verse: 'Caesar, now be still: I killed not thee with half so good a will... This was the noblest Roman of them all.',
          speaker: 'Brutus & Mark Antony',
          modernTranslation: 'Caesar, rest in peace now: I did not slay you with even half the willingness with which I take my own life... This was the noblest Roman of them all.',
          dramaticSignificance: 'Antony’s final tribute: while the other conspirators acted out of envy, Brutus alone acted out of sincere devotion to the public good.',
        },
        decisionPrompt: 'Antony and young Octavius stand over Brutus’s fallen body. How do the victorious commanders treat the dead rebel leader?',
        choices: [
          {
            text: 'Order full military honors for Brutus: "His life was gentle, and the elements so mixed in him that Nature might stand up and say to all the world, ‘This was a man!’"',
            isCanon: true,
            consequence: 'Brutus’s body lies in Octavius’s tent with all respect, bringing the tragedy to an honorable close.',
            modernTakeaway: 'Even bitter enemies can recognize genuine integrity and honor.',
          },
          {
            text: 'Throw his body to the dogs and celebrate in the taverns.',
            isCanon: false,
            consequence: 'Shakespearean tragedy always ends with restoration of order and dignified eulogy for the fallen hero.',
            modernTakeaway: 'Magnanimity in victory distinguishes great statesmanship.',
          },
        ],
        globeStagingSecret: 'Real drums, trumpets, and alarums sounded from the balcony while actors staged fast-paced Roman shield-and-gladius clashes.',
      },
    ],
  },
];
