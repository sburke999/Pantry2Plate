export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface Ingredient {
  id: string;
  name: string;
  baseQty: number | string;
  unit: string;
  note: string;
  badgeColor?: 'primary' | 'secondary' | 'neutral';
  pantryCategory?: string;
}

export interface CookingStep {
  number: number;
  title: string;
  subtext: string;
  description: string;
  image?: string;
  timerSeconds?: number;
  timerLabel?: string;
}

export interface Recipe {
  id: string;
  series: string;
  seriesNumber: string;
  title: string;
  description: string;
  heroImage: string;
  altText: string;
  matchPercentage: number;
  difficulty: DifficultyLevel;
  totalSteps: number;
  totalTime: string;
  baseServings: number;
  servingUnit: string;
  method: string;
  ingredients: Ingredient[];
  pantryBasics: string[];
  chefTipTitle: string;
  chefTipDescription: string;
  platingRitual: string;
  steps: CookingStep[];
  isFeatured?: boolean;
  category: 'Skillet' | 'Pasta' | 'Seafood' | 'Baking' | 'Pantry Staples';
}

export const SAVOR_RECIPES: Recipe[] = [
  {
    id: 'shakshuka-skillet',
    series: 'Artisanal Skillet Series',
    seriesNumber: 'No. 08',
    title: 'Shakshuka Eggs with Blistered Tomatoes & Crusty Sourdough',
    description:
      'Silky poached yolks nested in sweet blistered tomatoes, fragrant garlic, and sharp cracked rosemary. Served smoking hot with thick charred sourdough for dipping.',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuARNE6TG-Sq9IGgAEsRCiwEa-JBSJ-DDQTEsVgMniEKbuN0eVVvy-aEdSmHBfpg9rQw10wx_y24WhXIbKhO1TtmQtEgs_Epuy9RQH53_TYLwnDUDcdB1VWaBRmXbF5E8d_TXTpoLwKpLrP_QS4Y6bpraUo-gZhWgtfrlSVYxysORqGiWe11nn6JqxhZQTS2VO7x9Ws1zhOLrkSWp3S_fXXskRjdsQRNnufDbKGMMlvRk0vi69vGI94S',
    altText:
      'Top down gourmet food photography of vibrant red shakshuka eggs bubbling in a rustic cast iron skillet, golden yellow runny yolks, blistered cherry tomatoes, fresh green rosemary garnish.',
    matchPercentage: 100,
    difficulty: 'Easy',
    totalSteps: 3,
    totalTime: '20 mins',
    baseServings: 2,
    servingUnit: 'Plates',
    method: 'Cast Iron',
    isFeatured: true,
    category: 'Skillet',
    ingredients: [
      {
        id: 'ing-1',
        name: 'Farm Organic Eggs',
        baseQty: 4,
        unit: '',
        note: 'Room Temp',
        badgeColor: 'primary',
        pantryCategory: 'Eggs',
      },
      {
        id: 'ing-2',
        name: 'Cherry Tomatoes',
        baseQty: 1,
        unit: 'cup',
        note: 'Halved',
        badgeColor: 'secondary',
        pantryCategory: 'Cherry Tomatoes',
      },
      {
        id: 'ing-3',
        name: 'Sweet Bell Pepper',
        baseQty: 1,
        unit: '',
        note: 'Diced',
        badgeColor: 'secondary',
        pantryCategory: 'Bell Pepper',
      },
      {
        id: 'ing-4',
        name: 'Extra Virgin Olive Oil',
        baseQty: 1,
        unit: 'tbsp',
        note: 'Cold Pressed',
        badgeColor: 'neutral',
        pantryCategory: 'Olive Oil',
      },
      {
        id: 'ing-5',
        name: 'Fresh Rosemary Sprigs',
        baseQty: 2,
        unit: 'stems',
        note: '2 stems',
        badgeColor: 'secondary',
        pantryCategory: 'Rosemary',
      },
      {
        id: 'ing-6',
        name: 'Artisan Sourdough',
        baseQty: 2,
        unit: 'Thick Slices',
        note: '2 Thick Slices',
        badgeColor: 'primary',
        pantryCategory: 'Sourdough',
      },
    ],
    pantryBasics: ['Flaky sea salt', 'Cracked black pepper'],
    chefTipTitle: "Chef's Flavor Pivot",
    chefTipDescription:
      'Sprinkle 2 tbsp of crumbled feta or sharp farmhouse cheddar directly over the bubbling sauce right before securing the pan lid. It steams into creamy pockets!',
    platingRitual:
      'Serve right in the warm skillet placed on a wooden board. Tear sourdough with fingers.',
    steps: [
      {
        number: 1,
        title: 'Blister & Sauté',
        subtext: '5 minutes • Skillet heat',
        description:
          'Heat 1 tbsp olive oil in a heavy cast-iron skillet over medium-high heat. Add the diced sweet bell peppers and halved cherry tomatoes cut-side down. Let them sear undisturbed for 2 minutes to blister, then toss gently until softened and deeply aromatic.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBHkmOl6TCMfWD9oiPPD4jlv4SFbhfxseT-MQbjzqSxpxXoXMqDDOBWQ_ubVZD7WtZOfxDkLGz-0WMisCAafVIDr40VUTeVqTP1CDydgIZx62KvKKDU_x2snUx_PHZ_0Fnm9f0RUHj4oJn6pf9Y9b1mTYoREyeVRfKPo1625VLQ2GBOGKXIubC-V9XZo2sKU-6nw1lTqQseby6AsXb66aiXGaDqTKDK4sqpJhtsXZOcJatyDBRp8fXZ',
        timerSeconds: 300,
        timerLabel: 'Sauté Timer',
      },
      {
        number: 2,
        title: 'Wells & Eggs',
        subtext: 'Gentle handling • Seasoning',
        description:
          'Use the back of a wooden spoon to press four distinct shallow indentations into the bubbling tomato sauce. Gently crack one egg directly into each well. Scatter flaky sea salt, cracked black pepper, and stripped rosemary leaves over the eggs.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ5yPG8LqIro8IMfvG8otr8oa8UWshYYM77zFs96hRPATz4b61BHjJ9T1SxI-ArOWkeaRamveuqObFa00aAZCOazUC3z9hnCua3USlwzKYqaN-mqGWMw_wj-g1SYHtwCX6k1P91NEIj8oIqpC6rOmcVr2dYLL4gEQ-pGtntB9NcC9FjUgubDx1vT7MSqzteBR74iUd_hzyGQm2C0J3vvjuTgOE9Nzmp-AB9qhgIF1E-YP_HSY1GyTD',
      },
      {
        number: 3,
        title: 'Cover Simmer & Toast',
        subtext: '6 minutes • Low flame',
        description:
          'Turn heat to medium-low, cover with a tight lid, and simmer until whites are just opaque while yolks remain deliciously runny (5 to 6 mins). Simultaneously toast the sourdough slices on a grill pan until golden with blackened edges.',
        timerSeconds: 360,
        timerLabel: 'Poach Timer',
      },
    ],
  },
  {
    id: 'cacio-e-pepe-skillet',
    series: 'Heritage Pasta Series',
    seriesNumber: 'No. 04',
    title: 'Cacio e Pepe with Charred Scallion Butter & Hand-Pulled Pici',
    description:
      'Thick ribbons of pasta bathed in a silky pecorino emulsion, toasted Tellicherry black peppercorns, and an aromatic swirl of charred scallion butter.',
    heroImage: '/src/assets/images/cacio_e_pepe_skillet_1790108037363.jpg',
    altText:
      'Top down gourmet food photography of creamy cacio e pepe pasta swirled in an artisanal skillet, abundant cracked black pepper, finely grated pecorino cheese dusting.',
    matchPercentage: 85,
    difficulty: 'Medium',
    totalSteps: 3,
    totalTime: '18 mins',
    baseServings: 2,
    servingUnit: 'Bowls',
    method: 'Bronze Skillet',
    category: 'Pasta',
    ingredients: [
      {
        id: 'cp-1',
        name: 'Bronze-Die Pici or Bucatini',
        baseQty: 250,
        unit: 'g',
        note: 'Dry or Fresh',
        badgeColor: 'primary',
        pantryCategory: 'Pasta',
      },
      {
        id: 'cp-2',
        name: 'Aged Pecorino Romano',
        baseQty: 1.5,
        unit: 'cups',
        note: 'Finely Grated',
        badgeColor: 'secondary',
        pantryCategory: 'Pecorino',
      },
      {
        id: 'cp-3',
        name: 'Tellicherry Black Peppercorns',
        baseQty: 2,
        unit: 'tsp',
        note: 'Coarsely Crushed',
        badgeColor: 'neutral',
        pantryCategory: 'Black Pepper',
      },
      {
        id: 'cp-4',
        name: 'Cultured Unsalted Butter',
        baseQty: 2,
        unit: 'tbsp',
        note: 'Cold Cubed',
        badgeColor: 'primary',
        pantryCategory: 'Butter',
      },
      {
        id: 'cp-5',
        name: 'Fresh Scallions',
        baseQty: 3,
        unit: 'stalks',
        note: 'Charred & Minced',
        badgeColor: 'secondary',
        pantryCategory: 'Scallions',
      },
    ],
    pantryBasics: ['Starchy pasta cooking water', 'Flaky finishing salt'],
    chefTipTitle: "Chef's Pepper Bloom",
    chefTipDescription:
      'Dry-toast your peppercorns in the hot pan for 60 seconds before adding any fats. The high heat unlocks deep citrusy terpenes hidden in the peppercorn hull!',
    platingRitual:
      'Twirl pasta into warm shallow earthenware bowls using carving tongs. Dust with a final snow of pecorino.',
    steps: [
      {
        number: 1,
        title: 'Toast Peppercorns & Brown Butter',
        subtext: '4 minutes • Medium flame',
        description:
          'In a wide skillet, dry-toast coarsely crushed peppercorns until fragrant and popping. Add butter and finely chopped scallions; let the butter foam and take on a hazelnut aroma.',
        timerSeconds: 240,
        timerLabel: 'Bloom Timer',
      },
      {
        number: 2,
        title: 'Pecorino Slurry Emulsion',
        subtext: '3 minutes • Gentle whisking',
        description:
          'Whisk ½ cup of hot, starchy pasta water into the grated Pecorino in a small ceramic bowl until it transforms into a lump-free velvet paste.',
      },
      {
        number: 3,
        title: 'The Glossy Mantecatura',
        subtext: '2 minutes • Off-heat tossing',
        description:
          'Transfer al dente pasta directly into the skillet with heat turned OFF. Pour in the cheese slurry and vigorously toss with rhythmic circular motions until a creamy, glossy glaze blankets every strand.',
        timerSeconds: 120,
        timerLabel: 'Toss Timer',
      },
    ],
  },
  {
    id: 'pan-seared-trout',
    series: 'Fresh Waters Series',
    seriesNumber: 'No. 12',
    title: 'Pan-Seared Heritage Trout with Brown Butter & Crisped Sage',
    description:
      'Crisp golden skin with fork-tender pink meat, basted in foaming hazelnut brown butter, garden sage leaves, and charred Meyer lemon wedges.',
    heroImage: '/src/assets/images/pan_seared_trout_1790108050372.jpg',
    altText:
      'Artisanal culinary food photography of crispy golden pan-seared river trout fillet resting in a cast iron skillet with nutty foaming brown butter.',
    matchPercentage: 75,
    difficulty: 'Medium',
    totalSteps: 3,
    totalTime: '15 mins',
    baseServings: 2,
    servingUnit: 'Fillets',
    method: 'Cast Iron',
    category: 'Seafood',
    ingredients: [
      {
        id: 'tr-1',
        name: 'Whole River Trout Fillets',
        baseQty: 2,
        unit: 'fillets',
        note: 'Skin-On, Patted Dry',
        badgeColor: 'primary',
        pantryCategory: 'Trout',
      },
      {
        id: 'tr-2',
        name: 'Cultured Sweet Cream Butter',
        baseQty: 3,
        unit: 'tbsp',
        note: 'Cubed',
        badgeColor: 'neutral',
        pantryCategory: 'Butter',
      },
      {
        id: 'tr-3',
        name: 'Fresh Garden Sage Leaves',
        baseQty: 10,
        unit: 'leaves',
        note: 'Whole',
        badgeColor: 'secondary',
        pantryCategory: 'Sage',
      },
      {
        id: 'tr-4',
        name: 'Meyer Lemon',
        baseQty: 1,
        unit: '',
        note: 'Halved for Charring',
        badgeColor: 'secondary',
        pantryCategory: 'Lemon',
      },
    ],
    pantryBasics: ['High-smoke neutral oil', 'Coarse sea salt'],
    chefTipTitle: 'Skin Contact Rule',
    chefTipDescription:
      'Press gently on the fillet with a flexible fish spatula for the first 30 seconds to prevent the skin from curling up. This guarantees end-to-end crackling skin!',
    platingRitual:
      'Spoon bubbling brown butter and crispy sage directly over the glistening fish at the table. Squeeze charred lemon.',
    steps: [
      {
        number: 1,
        title: 'Skin Sear & Press',
        subtext: '4 minutes • High heat',
        description:
          'Get your cast iron shimmering hot with 1 tsp oil. Lay fillets skin-side down moving away from you. Press flat with a spatula for 30s. Cook undisturbed until skin is deep mahogany and releases effortlessly.',
        timerSeconds: 240,
        timerLabel: 'Skin Sear Timer',
      },
      {
        number: 2,
        title: 'The Brown Butter Bast',
        subtext: '3 minutes • Spoon basting',
        description:
          'Flip fillets gently. Drop in butter, whole sage leaves, and lemon halves cut-side down. Tilt skillet and spoon foaming butter continuously over the fish as sage turns crisp.',
        timerSeconds: 180,
        timerLabel: 'Basting Timer',
      },
      {
        number: 3,
        title: 'Rest & Lemon Squeeze',
        subtext: '2 minutes • Residual heat',
        description:
          'Slide onto warm plates immediately to keep the skin from steaming soft. Pour leftover brown butter and crisp sage directly overtop.',
      },
    ],
  },
  {
    id: 'dutch-baby-pancake',
    series: 'Bakeshop Mornings',
    seriesNumber: 'No. 15',
    title: 'Cast Iron Dutch Baby with Caramelized Spiced Pears & Thyme',
    description:
      'Puffed billowy oven pancake with golden custardy center, crowned with skillet-caramelized Bosc pears, warm cinnamon-cardamom butter, and snowy powdered sugar.',
    heroImage: '/src/assets/images/dutch_baby_pancake_1790108064512.jpg',
    altText:
      'Puffed golden brown cast iron Dutch baby pancake fresh from the oven, caramelized spiced pears, powdered sugar dusting, fresh thyme sprigs.',
    matchPercentage: 90,
    difficulty: 'Hard',
    totalSteps: 3,
    totalTime: '25 mins',
    baseServings: 4,
    servingUnit: 'Wedges',
    method: 'Oven Skillet',
    category: 'Baking',
    ingredients: [
      {
        id: 'db-1',
        name: 'Farm Fresh Eggs',
        baseQty: 3,
        unit: '',
        note: 'Room Temp',
        badgeColor: 'primary',
        pantryCategory: 'Eggs',
      },
      {
        id: 'db-2',
        name: 'Whole Milk',
        baseQty: 0.75,
        unit: 'cup',
        note: 'Slightly Warm',
        badgeColor: 'neutral',
        pantryCategory: 'Milk',
      },
      {
        id: 'db-3',
        name: 'Heirloom All-Purpose Flour',
        baseQty: 0.75,
        unit: 'cup',
        note: 'Aerated / Sifted',
        badgeColor: 'neutral',
        pantryCategory: 'Flour',
      },
      {
        id: 'db-4',
        name: 'Bosc Pears',
        baseQty: 2,
        unit: '',
        note: 'Thin Wedges',
        badgeColor: 'secondary',
        pantryCategory: 'Pears',
      },
      {
        id: 'db-5',
        name: 'Pure Maple Syrup',
        baseQty: 3,
        unit: 'tbsp',
        note: 'Grade A Dark',
        badgeColor: 'primary',
        pantryCategory: 'Maple Syrup',
      },
    ],
    pantryBasics: ['Ground cardamom', 'Pure vanilla bean paste', 'Flaky sea salt'],
    chefTipTitle: 'The Preheated Pan Secret',
    chefTipDescription:
      'The skillet must be scorching hot when the batter hits it. The sudden thermal shock drives rapid steam expansion, blowing up those dramatic billowing edges!',
    platingRitual:
      'Dust generously with confectioner sugar at table-side while still puffing steam. Slice into warm rustic wedges.',
    steps: [
      {
        number: 1,
        title: 'Frothy Aeration & Pan Preheat',
        subtext: '5 minutes • High speed blend',
        description:
          'Place cast iron skillet in oven and preheat to 425°F (220°C). Blend eggs, milk, flour, vanilla, and salt on high speed until completely smooth and frothy with air bubbles.',
      },
      {
        number: 2,
        title: 'Puff Bake in Iron',
        subtext: '16 minutes • High heat undisturbed',
        description:
          'Carefully remove sizzling hot skillet. Melt 3 tbsp butter, swirling up the sides. Pour batter in center and return immediately to oven. Bake undisturbed until giant golden peaks form.',
        timerSeconds: 960,
        timerLabel: 'Bake Timer',
      },
      {
        number: 3,
        title: 'Caramelized Pear Crown',
        subtext: '4 minutes • Quick skillet glaze',
        description:
          'In a separate pan, sauté pear wedges in butter and maple syrup with a pinch of cardamom until translucent and amber. Spoon into the crater of the puffed pancake.',
        timerSeconds: 240,
        timerLabel: 'Caramelize Timer',
      },
    ],
  },
];

export const PANTRY_INGREDIENTS = [
  { id: 'Eggs', label: 'Farm Eggs', icon: 'egg' },
  { id: 'Cherry Tomatoes', label: 'Cherry Tomatoes', icon: 'nutrition' },
  { id: 'Bell Pepper', label: 'Bell Peppers', icon: 'restaurant' },
  { id: 'Olive Oil', label: 'Olive Oil', icon: 'water_drop' },
  { id: 'Rosemary', label: 'Fresh Herbs', icon: 'eco' },
  { id: 'Sourdough', label: 'Artisan Bread', icon: 'bakery_dining' },
  { id: 'Pasta', label: 'Bronze Pasta', icon: 'dinner_dining' },
  { id: 'Pecorino', label: 'Pecorino / Parm', icon: 'cookie' },
  { id: 'Black Pepper', label: 'Whole Peppercorns', icon: 'grain' },
  { id: 'Butter', label: 'Cultured Butter', icon: 'breakfast_dining' },
  { id: 'Trout', label: 'Fresh Fish', icon: 'set_meal' },
  { id: 'Milk', label: 'Whole Milk', icon: 'glass_cup' },
  { id: 'Flour', label: 'Flour', icon: 'kitchen' },
];
