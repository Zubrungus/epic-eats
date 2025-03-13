import { useState, type FormEvent, type ChangeEvent } from 'react';
import RecipeAPI from '../api/RecipeAPI';
import auth from '../utils/auth';

interface Recipe {
    title: string;
    image_url: string;
    source_url: string;
    summary: string;
    instructions: string;
    extendedIngredients: Ingredients[];
}

interface Ingredients {
    id: number,
    original: string;
}

const NewEat = () => {
  const [recipeData, setRecipeData] = useState<Recipe>({
    title: '',
    image_url: '',
    source_url: '',
    summary: '',
    instructions: '',
    extendedIngredients: [], 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { name, value } = e.target;

    if (name === 'ingredients' && index !== undefined) {
        const newIngredients = recipeData.extendedIngredients.map((ingredient, i) =>
            i === index ? { ...ingredient, original: value } : ingredient
          );
      setRecipeData({ ...recipeData, extendedIngredients: newIngredients });
    } else {
      setRecipeData({ ...recipeData, [name]: value });
    }
  };

  const addIngredientField = () => {
    setRecipeData({ ...recipeData, extendedIngredients: [...recipeData.extendedIngredients, { id: Date.now(), original: '' }] });
  };

  const removeIngredientField = (index: number) => {
    const newIngredients = recipeData.extendedIngredients.filter((_, i) => i !== index);
    setRecipeData({ ...recipeData, extendedIngredients: newIngredients });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const userId = auth.getToken();
      if (!userId) {
        throw new Error('User ID not found in local storage');
      }
      
      await RecipeAPI.createRecipe(recipeData);
      setSuccess('Recipe created successfully!');
      setRecipeData({
        title: '',
        image_url: '',
        source_url: '',
        summary: '',
        instructions: '',
        extendedIngredients: [],
      });
    } catch (err) {
      setError('Failed to create recipe. Please try again later.');
      console.error('Recipe creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='form-container'>
      <form className='form recipe-form' onSubmit={handleSubmit}>
        <h1>Create New Recipe</h1>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className='form-group'>
          <input
            placeholder='Title'
            className='form-input'
            type='text'
            name='title'
            value={recipeData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className='form-group'>
          <input
            placeholder='Image URL'
            className='form-input'
            type='text'
            name='image_url'
            value={recipeData.image_url}
            onChange={handleChange}
          />
        </div>

        <div className='form-group'>
          <input
            placeholder='Source URL (e.g., original recipe link)'
            className='form-input'
            type='text'
            name='source_url'
            value={recipeData.source_url}
            onChange={handleChange}
          />
        </div>

        <div className='form-group'>
          <textarea
            placeholder='Summary (Short description of the recipe)'
            className='form-input'
            name='summary'
            value={recipeData.summary}
            onChange={handleChange}
          />
        </div>

        <div className='form-group'>
          <textarea
            placeholder='Instructions'
            className='form-input'
            name='instructions'
            value={recipeData.instructions}
            onChange={handleChange}
            required
          />
        </div>

        <div className='form-group'>
          <label>Ingredients:</label>
          {recipeData.extendedIngredients.map((ingredient, index) => (
            <div key={ingredient.id} className="ingredient-input">
              <input
                type="text"
                placeholder={`Ingredient ${index + 1}`}
                className="form-input"
                name="ingredients"
                value={ingredient.original}
                onChange={(e) => handleChange(e, index)}
              />
              <button type="button" onClick={() => removeIngredientField(index)}>-</button>
            </div>
          ))}
          <button type="button" onClick={addIngredientField}>
            + Add Ingredient
          </button>
        </div>

        <div className='form-group'>
          <button className='save-recipe-btn' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Recipe'}
          </button>
          
        </div>
      </form>
    </div>
  );
};

export default NewEat;