export type OakCatalogue = Record<string, Record<string, string[]>>;

export const DEFAULT_OAK_CATALOGUE: OakCatalogue = {
  'Key Stage 1': {
    'English': ['Phonics & Simple Sentences', 'Capital Letters & Full Stops', 'Story Sequencing'],
    'Mathematics': ['Addition & Subtraction within 20', '2D & 3D Shapes', 'Place Value to 50'],
    'Science': ['Seasonal Changes', 'Animals and Humans', 'Materials and Properties'],
    'History': ['Changes Within Living Memory', 'Significant Historical Figures'],
    'Geography': ['Our Local Area', 'The Four Seasons & Weather Patterns'],
  },
  'Key Stage 2': {
    'Mathematics': ['Fractions and Decimals', 'Place Value and Rounding', 'Long Division & Multiplication', 'Perimeter and Area'],
    'English': ['Fronted Adverbials & Commas', 'Direct Speech Punctuation', 'Reading Comprehension: Inference'],
    'Science': ['States of Matter', 'The Water Cycle', 'Forces and Magnets', 'Earth and Space', 'Electricity & Circuits'],
    'History': ['Ancient Egypt & Pharaohs', 'The Roman Empire & Britain', 'The Vikings & Anglo-Saxons'],
    'Geography': ['Rivers & The Water Cycle', 'Volcanoes and Earthquakes', 'World Biomes & Climate Zones'],
    'Computing': ['Scratch Block Programming', 'Online Safety & Digital Literacy', 'Algorithms & Sequencing'],
  },
  'Key Stage 3': {
    'Mathematics': ['Algebraic Expressions & Indices', 'Linear Equations', 'Probability & Venn Diagrams', 'Pythagoras Theorem'],
    'Science': ['Atomic Structure & Periodic Table', 'Cell Biology & Microscopy', 'Energy Transfers & Conservation'],
    'English': ['Shakespeare: Key Themes', 'Gothic Literature', 'Persuasive Writing & Rhetoric'],
    'History': ['The Norman Conquest (1066)', 'The Industrial Revolution', 'The Transatlantic Slave Trade'],
    'Geography': ['Plate Tectonics & Hazards', 'Urbanisation & Mega Cities', 'Glacial Landscapes'],
    'Modern Foreign Languages': ['French: Present Tense & Daily Routine', 'Spanish: Free Time & Hobbies'],
  },
  'Key Stage 4 (GCSE)': {
    'Mathematics': ['Quadratic Equations & Graphs', 'Trigonometry (SOH CAH TOA)', 'Circle Theorems', 'Simultaneous Equations'],
    'Chemistry': ['Balancing Chemical Equations', 'Electrolysis & Electrolytes', 'Quantitative Chemistry & Moles'],
    'Physics': ['Newtonian Mechanics & Force', 'Waves and Electromagnetic Spectrum', 'Radioactivity & Half-Life'],
    'Biology': ['Genetics and Inheritance', 'Photosynthesis & Plant Transport', 'Homeostasis and Response'],
    'Religious Studies': ['Christian Practices & Sacraments', 'Ethics: Peace, Conflict and Justice'],
  }
};