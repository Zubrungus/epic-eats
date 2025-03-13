import dotenv from 'dotenv'
dotenv.config();

export class CompactRecipe {
    id: number;
    title: string;
    image: string;

    constructor(
        id: number,
        title: string,
        image: string,

    ) {
        this.id = id;
        this.title = title;
        this.image = image;
    }
}

class RecipeSearchService {
    private baseURL?: string = process.env.BASE_URL;
    private apiKey?: string = process.env.VITE_SPOONS_KEY;

    async fetchSearchResults(searchQuery: string) {
        const parsedQuery = searchQuery.replace(/\s/g, '_');

        const searchResponse = await fetch(`${this.baseURL}/recipes/complexSearch?query=${parsedQuery}&apiKey=${this.apiKey}`);
        const parsedSearchResponse = await searchResponse.json();

        const searchArray: CompactRecipe[] = [];

        for (let i = 0; i < parsedSearchResponse.results.length; i++) {
            const individualResult = new CompactRecipe(parsedSearchResponse.results[i].id, parsedSearchResponse.results[i].title, parsedSearchResponse.results[i].image);
            searchArray.push(individualResult);
        }

        return searchArray;
    }

    async fetchFullInformation(id: string){
        const searchResponse = await fetch(`${this.baseURL}/recipes/${id}/information?includeNutrition=true&apiKey=${this.apiKey}`);
        const parsedSearchResponse = await searchResponse.json();

        return parsedSearchResponse;
    }

    async fetchRandomRecipe(){
        const randomResponse = await fetch(`${this.baseURL}/recipes/random?includeNutrition=true&apiKey=${this.apiKey}&number=1`)
        const parsedRandom = await randomResponse.json();

        return parsedRandom.recipes[0];
    }

    async fetchMealType (searchQuery: string) {
        const meal = searchQuery.replace(/\s/g, '_');

        const searchResponse = await fetch(`${this.baseURL}/recipes/complexSearch?query=${meal}&apiKey=${this.apiKey}`);
        const parsedRandom = await searchResponse.json();

        return parsedRandom.recipes[0];
}}

export default new RecipeSearchService();
