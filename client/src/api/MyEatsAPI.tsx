import { RecipeData } from '../interfaces/RecipeData';
import { useState, useEffect } from "react";
import auth from '../utils/auth';

  const fetchMyEatsFromDB = async (userId: number) => {

    try {
      const response = await fetch(`/api/recipe/${userId}/myeats`);
      console.log(userId)
      if (!response.ok) {
        throw new Error('Failed to fetch saved recipes');
      }
    
      return response.json();
    } catch (err) {
    console.error('Failed to fetch saved recipes:', err);
    return [];
  }
};

  const useSaveRecipeToDB = () => {
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [nextId, setNextId] = useState<number>(1); // Default to 1

    // Fetch recipes on mount and determine next available ID
    useEffect(() => {
      const getNextId = async () => {
        const userId = localStorage.getItem('userId'); 
        const savedRecipes = await fetchMyEatsFromDB(Number(userId));
        const maxId = savedRecipes.reduce((max: any, recipe: any) => Math.max(max, recipe.id), 0);
        setNextId(maxId + 1);
      };

      getNextId();
    }, []);

    const saveRecipeToDB = async (body: RecipeData) => {
      try {
            // Check if the user is logged in before proceeding
    if (!auth.loggedIn()) {
      setSaveMessage("Authentication required to save recipes.");
      return;
    }

    const token = auth.getToken(); // Ensure token is retrieved correctly

    // Ensure ingredients exist before mapping
    const ingredients = Array.isArray(body.extendedIngredients)
      ? body.extendedIngredients.map((ing) => ing.original)
      : [];

    const response = await fetch(`/api/recipe/${token}/neweat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Ensuring authentication
      },
      body: JSON.stringify({
        id: nextId,
        title: body.title,
        image_url: body.image_url || "",
        source_url: body.source_url || "",
        summary: body.summary || "",
        instructions: body.instructions || "",
        extendedIngredients: ingredients,
      }),
    });

    const result = await response.json(); // Extract response JSON for debugging

    if (!response.ok) {
      throw new Error(result.error || "Failed to save recipe");
    }

    setSaveMessage("Recipe Saved Successfully!");
    setNextId((prevId) => prevId + 1);
  } catch (err: any) {
    console.error("Error saving recipe:", err.message); // Log for debugging
    setSaveMessage("Error saving recipe.");
  }
};
      return { saveMessage, saveRecipeToDB };
    };

export { fetchMyEatsFromDB, useSaveRecipeToDB };
