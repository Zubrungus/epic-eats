import { useState, useEffect } from "react";
import { retrieveRandomRecipe } from "../api/RandomRecipeAPI";
import { retrieveEditorsRecipe } from "../api/EditorsRecipeAPI";
import { fetchMealType } from "../api/MealRecipeAPI";


interface Recipe {
    image: string,
    title: string,
    extendedIngredients: Ingredients[],
    instructions: string;
}

interface Ingredients {
    id: number,
    original: string;
}

const Home = (_props: any) => {
    const [randomRecipe, setRandomRecipe] = useState<Recipe>({
        image: '',
        title: '',
        extendedIngredients: [],
        instructions: ''
    })
    const [editorRecipe, setEditorRecipe] = useState<Recipe>({
        image: '',
        title: '',
        extendedIngredients: [],
        instructions: ''
    })
    const [_error, setError] = useState(false);

    useEffect(() => {
        fetchRandomRecipe()
    }, [])

    // onclick call fetch random recipe

    const fetchRandomRecipe = async () => {
        try {
            const data = await retrieveRandomRecipe()
            setRandomRecipe(data)
        } catch (err) {
            console.error('Failed to retrieve Random Recipe', err);
            setError(true);
        }
    }

    useEffect(() => {
        fetchEditorsRecipe()
    }, [])

    // onclick call fetch random recipe

    const fetchEditorsRecipe = async () => {
        try {
            const data = await retrieveEditorsRecipe()
            setEditorRecipe(data)
        } catch (err) {
            console.error("Failed to retrieve Editor's Eats", err);
            setError(true);
        }
    }

    return (
        <>
        <h1>Recipes focused on making every cook feel epic</h1>
        <section className='eats-container'>
            <div className='recipe-col'>
            <section className='recipe-card'>
                <div>
                    <h3>Try this Epic Eat:</h3>
                    <h1>{randomRecipe.title}</h1>
                    <img className='recipe-img' src={randomRecipe.image}></img>
                </div>
                <div>
                    <h2>Ingredients</h2>
                    <ul>
                        {randomRecipe.extendedIngredients.map(item => (
                            <li key={item.id}>{item.original}</li>
                        ))}
                    </ul>
                    <p>{randomRecipe.instructions}</p>
                </div>
            </section>
            <section className='recipe-card'>
                <div>
                    <h3>Try this Editor's Eats:</h3>
                    <h1>{editorRecipe.title}</h1>
                    <img className='recipe-img' src={editorRecipe.image}></img>
                </div>
                <div>
                    <h2>Ingredients</h2>
                    <ul>
                        {editorRecipe.extendedIngredients.map(item => (
                            <li key={item.id}>{item.original}</li>
                        ))}
                    </ul>
                    <p>{editorRecipe.instructions}</p>
                </div>
            </section>
            </div>
            <div className='btn-col'>
                <button className='meal-button random-btn' onClick={() => fetchRandomRecipe()}>Get another Epic Eat</button>
                <button className='meal-button' onClick={() => fetchMealType ('breakfast')}>Breakfast</button>
                <button className='meal-button' onClick={() => fetchMealType ('lunch')}>Lunch</button>
                <button className='meal-button' onClick={() => fetchMealType ('dinner')}>Dinner</button>
                <button className='meal-button' onClick={() => fetchMealType ('snack')}>Snack</button>
            </div>
            </section>
        </>
    );
}

export default Home;