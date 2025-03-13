import Recipe from './../models/recipe.js';
import { Op } from 'sequelize';
import UserEats from './../models/userEats.js';

class Data {
  async findAll() {
    return await Recipe.findAll();
  }

  async findById(id: number) {
    return await Recipe.findByPk(id);
  }

  async getUserRecipes(user_id: number) {
    const savedRecipes = await UserEats.findAll({
      where: {
        user_id: {
        [Op.eq]: user_id,
        },
      },
      include: [Recipe],
    });

    return savedRecipes;
  }

  async findOne(user_id: number, eatId: number) {
    const userEat = await UserEats.findOne({
      where: {
        id: eatId,
        user_id: {
          [Op.eq]: user_id,
        },
      },
    });
    return userEat;
  }

  async findByTitle(title: string) {
    return await Recipe.findAll({
      where: {
        title: {
        [Op.iLike]: `%${title}%`,
        },
      },
    });
  }

  async saveRecipe(details: any) {
    const recipe = await this.createOrUpdate(details);

    // Associate the recipe with the user in UserEats
    await UserEats.findOrCreate({
      where: {
        user_id: details.user_id,
        spoonacular_id: details.spoonacular_id || 0, // Ensure correct lookup
      },
      defaults: {
        user_id: details.user_id,
        spoonacular_id: details.spoonacular_id || 0,
        title: details.title,
        summary: details.summary,
        instructions: details.instructions || 'Oh no! Instructions missing',
        ingredients: details.ingredients.map((ing: any) => ({
          id: ing.id,
          original: ing.original,
        })), // Ensure correct structure for JSONB
        image_url: details.image || null,
        source_url: details.sourceUrl || null,
      },
    });

    return recipe;
  }

  async createOrUpdate(details: any) {
    const ingredientsJson = details.extendedIngredients.map((ing: any) => ({
      id: ing.id,
      original: ing.original,
    }));

    const [dbEats] = await Recipe.findOrCreate({
      where: { id: details.id },
      defaults: {
        id: details.id,
        title: details.title,
        image_url: details.image,
        source_url: details.sourceUrl,
        summary: details.summary,
        instructions: details.instructions || 'Oh no! Instructions missing',
        ingredients: ingredientsJson,
      },
    });

    return dbEats;
  }

  async createUserEat(details: {
    id: number;
    title: string;
    image_url?: string;
    source_url?: string;
    summary?: string;
    instructions: string;
    ingredients: { id: number; original: string }[];
    user_id: number;
    spoonacular_id?: number;
  }) {
    const userEat = await UserEats.create({
      id: details.id,
      title: details.title,
      image_url: details.image_url || '',
      source_url: details.source_url || '',
      summary: details.summary || '',
      instructions: details.instructions,
      ingredients: details.ingredients.map((ing) => ({
        id: ing.id,
        original: ing.original,
      })),
      user_id: details.user_id,
      spoonacular_id: details.spoonacular_id || 0,
    });

    return userEat;
  }

  async storeRecipesFromAPI(recipes: any[]) {
    for (const recipe of recipes) {
      await Recipe.findOrCreate({
        where: { id: recipe.id },
        defaults: {
          id: recipe.id,
          title: recipe.title,
          image_url: recipe.image,
          source_url: '',
          summary: '',
          instructions: recipe.instructions || 'Oh no! Instructions missing',
          ingredients: [],
        },
      });
    }
  }
}

export default new Data();
