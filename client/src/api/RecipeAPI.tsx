import auth from '../utils/auth';

const RecipeAPI = {
  createRecipe: async (recipeData: {
    id?: number;
    title: string;
    image_url?: string;
    source_url?: string;
    summary?: string;
    instructions: string;
    extendedIngredients: object[];
  }) => {
    try {
    const userId = auth.getToken();
    const response = await fetch(`/api/recipe/${userId}/neweat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`,
      },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      throw new Error('Failed to save recipe');
    }}
    catch (err) {
      console.error('Error from data retrieval: ', err);
      return Promise.reject('Could not relay search term to server');
    }
  },
  
  retrieveRecipeDetails: async (id: string) => {
    try {
      const response = await fetch(
        `/recipes/${id}/information`,
      );
      // destructure response.  api call returns object with 1 key (results), whose value is the array of objects(recipes) we are inteerested in.
      const result = await response.json();
  
      if(!response.ok) {
        throw new Error('invalid API response, check network tab!');
      }
  
      return result;
    } catch (err) {
      console.log('Error from data retrieval: ', err);
      return Promise.reject('Could not relay search term to server');
    }
  },
  };

  export default RecipeAPI;