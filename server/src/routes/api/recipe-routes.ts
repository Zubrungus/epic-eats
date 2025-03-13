import express from 'express';
import type { Request, Response } from 'express';
import { CompactRecipe,  } from '../../service/recipeService.js';
import RecipeSearchService from '../../service/recipeService.js';
import Data from '../data.js';
import { User } from '../../models/index.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

//Look at value of q and return array of compact recipes
router.get('/search/*', async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        console.log(`Search Query: ${query}`);

        //check database for search result before making api call
        const dbEats = await Data.findByTitle(query);

        if (dbEats.length >= 20) {
            const searchArray: CompactRecipe[] = dbEats.map((recipe) => ({
                id: recipe.id,
                title: recipe.title,
                image: recipe.image_url,
            }));
            console.log('Returning results from DB')
            return res.json(searchArray);
        }
       //if no or not engough results are found call Spoonacular API
       console.log('Not enough results in DB. Calling Spoonacular API...');
        const searchArray: CompactRecipe[] = await RecipeSearchService.fetchSearchResults(query);
        
        //store results to DB
        await Data.storeRecipesFromAPI(searchArray);
        return res.json(searchArray);

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
        return;
    }
});

router.get('/:id/information', async (req: Request, res: Response) =>{
    try{

        const fullInformation = await RecipeSearchService.fetchFullInformation(req.params.id);

        res.json(fullInformation);

    } catch(err){
        console.error(err);
        res.status(500).json(err);
    }

})

router.get('/random', async (_req: Request, res: Response) =>{
    try{
        const randomInformation = await RecipeSearchService.fetchRandomRecipe();

        res.json(randomInformation);
    } catch(err){
        console.error(err);
        res.status(500).json(err);
    }
});

// POST /users/:id/myeats - Save a new recipe
router.post('/:id/neweat', authenticateToken, async (req: Request, res: Response) => {
  console.log('Received User:', req.user); 
  if (!req.user) {
    res.status(401).json({ message: 'User not authenticated' });  // Ensure user is authenticated
    return;
  }
  const { userId } = req.params;
  const newRecipe = req.body;
    console.log('Saving new recipe:', newRecipe);

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if the recipe already exists for the user
    const existingEat = await Data.findOne(user.id, newRecipe.id);

    console.log(existingEat, user.id, newRecipe.id);

    if (existingEat) {
      res.status(400).json({ message: 'Recipe already added to My Eats' });
      return;
    }

    // ✅ Save the recipe with userId
    const savedRecipe = await Data.saveRecipe({ ...newRecipe, userId: user.id });
    res.status(201).json(savedRecipe);

  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get('/editor', async (_req: Request, res: Response) =>{
    try{
        const editorInformation = {
            "title": "Sausage and Egg Breakfast Burrito",
            "image": "https://img.spoonacular.com/recipes/1096058-556x370.jpg",
            "extendedIngredients": [
                {
                  "id": 7036,
                  "original": "1/4 lb of ground hot Italian sausage",
                },
                {
                  "id": 10611282,
                  "original": "1/4 cup of diced white onion",
                },
                {
                  "id": 11215,
                  "original": "3 cloves of garlic minced",
                },
                {
                  "id": 10311821,
                  "original": "3 mini sweet peppers julienned",
                },
                {
                  "id": 11979,
                  "original": "1/2 jalapeno diced",
                },
                {
                  "id": 1082047,
                  "original": "1/2 teaspoon of kosher salt",
                },
                {
                  "id": 2027,
                  "original": "1/2 teaspoon of oregano",
                },
                {
                  "id": 1002030,
                  "original": "fresh ground pepper to taste",
                },
                {
                  "id": 10218364,
                  "original": "1 large flour tortilla",
                },
                {
                  "id": 1123,
                  "original": "1 large egg",
                },
                {
                  "id": 1001,
                  "original": "1 tbsp butter",
                },
                {
                  "id": 1016168,
                  "original": "Sriracha to taste",
                }
              ],
              "instructions": "Heat a pan to medium to high heat and add the sausage, diced onion, minced garlic, and julienned mini peppers. Break up sausage into small pieces as you cook it and the veggies, stirring often. After about 5 minutes, add the salt, oregano, and pepper and continue cooking for another 10-12 minutes until the sausage is completely cooked. In a separate small pan, heat to medium and add butter. Melt butter until it begins to sizzle a little add the egg. Let the egg cook, untouched for a couple of minutes. As the outside of the egg whites begins to set, cover the pan to let the top of the whites cook (by steaming the egg a bit), but keeping a nice runny yolk, 5-7 minutes. Lay tortilla flat and add sausage mixture. Top with the fried egg and sriracha. Wrap it up and dig in!",
        }

        res.json(editorInformation);
    } catch(err){
        console.error(err);
        res.status(500).json(err);
        return;
    }
});

router.get('/:id/myeats', authenticateToken, async (req, res) => {
  try {
    const userId = req.query.userId as string; 
    console.log(`Fetching saved recipes for user: ${userId}`);

    // Fetch the saved recipes from the database
    const savedRecipes = await Data.getUserRecipes(Number(userId));
    res.status(200).json(savedRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }});


export { router as recipeRouter };
