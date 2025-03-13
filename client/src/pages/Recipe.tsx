import { useState, useEffect } from "react";
import { retrieveRecipeDetails } from "../api/RecipeDetailsAPI";
import { useParams } from 'react-router-dom';
import { useSaveRecipeToDB } from '../api/MyEatsAPI';

interface Recipe {
    id: number,
    image: string,
    image_url: string,
    source_url: string,
    summary: string,
    title: string,
    extendedIngredients: Ingredients[],
    instructions: string;
}

interface Ingredients {
    id: number,
    original: string;
}

const Recipe = (_props: any) => {
    const { saveRecipeToDB, saveMessage } = useSaveRecipeToDB();
    const { id } = useParams();
    console.log(id)
    const [_error, setError] = useState(false);
    const [recipe, setRecipe] = useState<Recipe>({
        id: 0,
        image: '',
        image_url: '',
        source_url: '',
        summary: '',
        title: '',
        extendedIngredients: [],
        instructions: ''
    })

    useEffect(() => {
        fetchRecipeDetails()
    }, [])

    const fetchRecipeDetails = async () => {
        try {
            const data = await retrieveRecipeDetails(id!);
            setRecipe(data);
        } catch (err) {
            console.error('Failed to retrieve recipe:', err);
            setError(true);
        }
    };

    const handleSaveRecipe = async () => {
        try {
            await saveRecipeToDB(recipe);
            console.log('Recipe saved successfully');
        } catch (err) {
            console.error('Failed to save recipe:', err);
        }
    };

    return (<div className="recipe">
        <div className='eats-container'>
            <div className='recipe-card'>
                <h1>{recipe.title}</h1>
                <h2>Ingredients</h2>
                <ul>
                    {recipe.extendedIngredients.map(item => (
                        <li key={item.id}>{item.original}</li>
                    ))}
                </ul>
                <p>{recipe.instructions}</p>
                <div className='recipe-col'>
                <button onClick={handleSaveRecipe} className='random-btn'>Save Recipe</button>
                {saveMessage && <p>{saveMessage}</p>}
                </div>
            </div>
            <div className='recipe-img'>
                <img src={recipe.image} alt={recipe.title}></img>
            </div>
        </div>
    </div>);
};

export default Recipe;