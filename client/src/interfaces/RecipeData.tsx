export interface RecipeData {
    id: number | null;
    title: string | null;
    image_url: string | null;
    source_url: string |null;
    summary: string |null;
    instructions: string |null;
    extendedIngredients: Ingredients[];
  }

  interface Ingredients {
    id: number,
    original: string;
}