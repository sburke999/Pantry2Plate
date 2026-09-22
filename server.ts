import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Shared Gemini client utility on the server with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Procedural recipe engine fallback if Gemini API is offline or without key
function generateProceduralRecipe(
  ingredients: string[],
  mealStyle = 'Artisanal Skillet',
  difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium',
  photoTitle = 'Pantry Photo'
) {
  const ingList = ingredients.length > 0 ? ingredients : ['Farm Eggs', 'Cherry Tomatoes', 'Rosemary', 'Olive Oil'];
  const primary = ingList[0] || 'Produce';
  const secondary = ingList[1] || 'Fresh Herbs';

  const title = `${primary} & ${secondary} Rustic ${mealStyle.replace('Artisanal ', '')}`;
  const seriesNumber = `No. P-${Math.floor(10 + Math.random() * 90)}`;

  return {
    id: `photo-recipe-${Date.now()}`,
    series: 'Photo Pantry Creation',
    seriesNumber,
    title,
    description: `A fragrant, golden skillet dish crafted specifically from ingredients found in your ${photoTitle.toLowerCase()}. Sizzled until edges caramelize with rich savory depth and fresh garden aroma.`,
    difficulty,
    totalSteps: 3,
    totalTime: difficulty === 'Easy' ? '14 mins' : difficulty === 'Medium' ? '22 mins' : '35 mins',
    baseServings: 2,
    servingUnit: 'Portions',
    method: 'Sizzling Cast Iron',
    category: 'Skillet' as const,
    source: 'photo-generated' as const,
    createdFromPhotoTitle: photoTitle,
    ingredients: ingList.map((name, i) => ({
      id: `ing-${i}-${Date.now()}`,
      name,
      baseQty: i === 0 ? 3 : i === 1 ? 1 : 2,
      unit: i === 0 ? 'units' : i === 1 ? 'cup' : 'tbsp',
      note: i === 0 ? 'freshly prepared' : 'roughly chopped',
      pantryCategory: name,
    })),
    pantryBasics: ['Flaky sea salt', 'Cracked black pepper', 'Cold-pressed olive oil'],
    chefTipTitle: 'Mastering Residual Pan Heat',
    chefTipDescription:
      'Cast iron holds intense thermal inertia. Pull your skillet off direct flame 60 seconds before you think it is done; the carryover heat will finish delicate ingredients without scorching.',
    platingRitual: 'Serve straight from the seasoned skillet onto a warm trivet with a final drizzle of raw peppery oil and warm crusty dipping bread.',
    steps: [
      {
        number: 1,
        title: 'Thermal Iron Preheat & Base Sizzle',
        subtext: '4 minutes • Medium flame',
        description: `Warm your heavy skillet over medium heat until a bead of water dances. Coat the surface with oil or butter and introduce ${secondary} until fragrant and crackling.`,
        timerSeconds: 240,
        timerLabel: 'Preheat & Bloom',
        proTip: 'Never rush the preheat; even iron heat prevents sticking.',
      },
      {
        number: 2,
        title: `Caramelize & Fold ${primary}`,
        subtext: '7 minutes • Steady simmer',
        description: `Add the ${primary} to the blistering pan. Allow golden crusts to develop before gently swirling and seasoning with sea salt and coarse pepper.`,
        timerSeconds: 420,
        timerLabel: 'Sauté Timer',
      },
      {
        number: 3,
        title: 'Rest & Herbaceous Crown',
        subtext: '3 minutes • Off heat finish',
        description: `Remove from heat. Scatter any remaining fresh herbs, cracked peppercorns, or cheese atop the bubbling center. Let settle before serving.`,
        timerSeconds: 180,
        timerLabel: 'Rest Timer',
      },
    ],
  };
}

// POST endpoint: Generate custom recipe from photo ingredients
app.post('/api/generate-recipe', async (req: Request, res: Response) => {
  const {
    ingredients = [],
    mealStyle = 'Artisanal Skillet',
    difficulty = 'Medium',
    photoTitle = 'Pantry Photo',
    photoUrl = '',
  } = req.body;

  const ingredientNames: string[] = Array.isArray(ingredients)
    ? ingredients.map((i) => (typeof i === 'string' ? i : i.name || '')).filter(Boolean)
    : [];

  const safeIngredients =
    ingredientNames.length > 0 ? ingredientNames : ['Farm Eggs', 'Cherry Tomatoes', 'Olive Oil', 'Rosemary'];

  // Try calling Gemini if configured
  if (ai) {
    try {
      const prompt = `Create an elevated, artisanal culinary recipe for a home cook using these specific ingredients that were photographed in their pantry or fridge:
Ingredients available from photo: ${safeIngredients.join(', ')}.
Requested Cooking Style: ${mealStyle}.
Target Difficulty: ${difficulty}.
Context: Savor is an artisanal cooking journal focusing on cast iron, heritage pan methods, sensory descriptions, and tactile rituals.
Requirements:
1. Make the dish realistic and delicious, highlighting the photographed ingredients.
2. Provide exact ingredient measurements (quantities) scaled for 2-4 servings.
3. Include 3 or 4 clear cooking steps with active timers in seconds (e.g., 180, 360, 480 seconds).
4. Provide a Chef's pro tip with culinary wisdom and a sensory plating ritual.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an award-winning artisanal chef. You write evocative, precise, and inspiring culinary recipes for home cooks using cast iron and skillet methods. Output valid JSON matching the schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Artisanal mouthwatering title' },
              series: { type: Type.STRING, description: 'e.g. Photo Pantry Series' },
              seriesNumber: { type: Type.STRING, description: 'e.g. No. P-05' },
              description: { type: Type.STRING, description: 'Evocative sensory description' },
              difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
              totalSteps: { type: Type.INTEGER },
              totalTime: { type: Type.STRING, description: 'e.g. 20 mins' },
              baseServings: { type: Type.INTEGER },
              servingUnit: { type: Type.STRING, description: 'e.g. Portions or Bowls' },
              method: { type: Type.STRING, description: 'e.g. Cast Iron Sear' },
              category: {
                type: Type.STRING,
                enum: ['Skillet', 'Pasta', 'Seafood', 'Baking', 'Pantry Staples'],
              },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    quantity: { type: Type.STRING },
                    note: { type: Type.STRING },
                    pantryCategory: { type: Type.STRING },
                  },
                  required: ['id', 'name', 'quantity'],
                },
              },
              pantryBasics: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              chefTipTitle: { type: Type.STRING },
              chefTipDescription: { type: Type.STRING },
              platingRitual: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    number: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    subtext: { type: Type.STRING },
                    description: { type: Type.STRING },
                    timerSeconds: { type: Type.INTEGER },
                    timerLabel: { type: Type.STRING },
                    proTip: { type: Type.STRING },
                  },
                  required: ['number', 'title', 'subtext', 'description'],
                },
              },
            },
            required: [
              'title',
              'series',
              'seriesNumber',
              'description',
              'difficulty',
              'totalSteps',
              'totalTime',
              'baseServings',
              'servingUnit',
              'method',
              'category',
              'ingredients',
              'pantryBasics',
              'chefTipTitle',
              'chefTipDescription',
              'platingRitual',
              'steps',
            ],
          },
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        const normalizedIngredients = (parsed.ingredients || []).map((ing: any, i: number) => {
          let baseQty: number | string = 1;
          let unit = '';
          if (ing.quantity) {
            const match = String(ing.quantity).match(/^([\d./]+)\s*(.*)$/);
            if (match) {
              baseQty = isNaN(Number(match[1])) ? match[1] : Number(match[1]);
              unit = match[2] || '';
            } else {
              unit = String(ing.quantity);
            }
          }
          return {
            id: ing.id || `ing-${i}-${Date.now()}`,
            name: ing.name,
            baseQty: ing.baseQty !== undefined ? ing.baseQty : baseQty,
            unit: ing.unit || unit || 'portions',
            note: ing.note || '',
            pantryCategory: ing.pantryCategory || ing.name,
          };
        });

        const fullRecipe = {
          ...parsed,
          ingredients: normalizedIngredients,
          id: `recipe-ai-${Date.now()}`,
          heroImage: photoUrl || '/src/assets/images/fridge_crisper_shelf_1790108743704.jpg',
          altText: `Photo of ${parsed.title}`,
          matchPercentage: 100,
          source: 'photo-generated',
          createdFromPhotoTitle: photoTitle,
        };

        return res.json({ recipe: fullRecipe, engine: 'gemini-3.8-flash' });
      }
    } catch (err) {
      console.warn('Gemini generation encountered an issue, falling back to culinary generator:', err);
    }
  }

  // Procedural culinary generator fallback
  const recipe = generateProceduralRecipe(safeIngredients, mealStyle, difficulty as any, photoTitle);
  if (photoUrl) {
    (recipe as any).heroImage = photoUrl;
  } else {
    (recipe as any).heroImage = '/src/assets/images/fridge_crisper_shelf_1790108743704.jpg';
  }
  (recipe as any).matchPercentage = 100;

  return res.json({ recipe, engine: 'procedural-culinary' });
});

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY') });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Savor server running on port ${PORT}`);
  });
}

startServer();
