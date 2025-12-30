import { pakistaniRecipes } from './data/pakistaniRecipes';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Helpers
const isAllowed = (meal) => {
    if (!meal) return false;
    const restricted = ['pork', 'bacon', 'ham', 'lard', 'pig', 'hog'];
    const text = (meal.strMeal + ' ' + (meal.strCategory || '') + ' ' + (meal.strTags || '')).toLowerCase();
    return !restricted.some(r => text.includes(r));
};

export const api = {
    getRandomRecipes: async (count = 5) => {
        // Return a mix of local Pakistani + API
        const localRandom = pakistaniRecipes.sort(() => 0.5 - Math.random()).slice(0, 2);

        // API only returns 1 random meal per call, so we parallelize
        const promises = Array.from({ length: count }, () =>
            fetch(`${BASE_URL}/random.php`).then(res => res.json())
        );
        const results = await Promise.all(promises);
        const apiMeals = results.map(r => r.meals ? r.meals[0] : null).filter(m => m && isAllowed(m));

        return [...localRandom, ...apiMeals].slice(0, count);
    },

    getCategories: async () => {
        // Filter pork category out
        const res = await fetch(`${BASE_URL}/categories.php`);
        const data = await res.json();
        return data.categories.filter(c => c.strCategory !== 'Pork');
    },

    searchRecipes: async (query) => {
        // 1. Search Local Data First
        const lowerQ = query.toLowerCase();
        const localMatches = pakistaniRecipes.filter(r =>
            r.strMeal.toLowerCase().includes(lowerQ) ||
            (r.strDescription && r.strDescription.toLowerCase().includes(lowerQ)) ||
            (r.strArea && r.strArea.toLowerCase() === lowerQ) ||
            (r.strIngredients1 && r.strIngredients1.toLowerCase().includes(lowerQ)) // etc
        );

        // 2. Search API
        const res = await fetch(`${BASE_URL}/search.php?s=${query}`);
        const data = await res.json();
        const apiMatches = (data.meals || []).filter(isAllowed);

        // 3. Merge
        // Use Map to deduplicate by ID if ID collides (unlikely with "PK..." ids)
        return [...localMatches, ...apiMatches];
    },

    getRecipesByCategory: async (category) => {
        if (category === 'Pork') return [];
        const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
        const data = await res.json();
        return (data.meals || []).filter(isAllowed);
    },

    getRecipesByArea: async (area) => {
        if (area === 'Pakistani') {
            return api.getPakistaniMeals();
        }
        const res = await fetch(`${BASE_URL}/filter.php?a=${area}`);
        const data = await res.json();
        return (data.meals || []).filter(isAllowed);
    },

    getRecipeById: async (id) => {
        // Check local
        const local = pakistaniRecipes.find(r => r.idMeal === id);
        if (local) return local;

        const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
        const data = await res.json();
        const meal = data.meals ? data.meals[0] : null;
        return isAllowed(meal) ? meal : null;
    },

    getAreas: async () => {
        try {
            const res = await fetch(`${BASE_URL}/list.php?a=list`);
            const data = await res.json();
            const areas = data.meals || [];
            // Add Pakistani if missing
            if (!areas.some(a => a.strArea === 'Pakistani')) {
                areas.unshift({ strArea: 'Pakistani' });
            }
            return areas;
        } catch (e) {
            return [{ strArea: 'Pakistani' }];
        }
    },

    // Custom aggregator for Pakistani cuisine
    getPakistaniMeals: async () => {
        // 1. Use Local Data (Guaranteed)
        // 2. Supplement with Search/Area filtering (Optimistic)
        const keywords = ['Karahi', 'Biryani', 'Tikka', 'Kebab', 'Nihari', 'Haleem', 'Chaat', 'Kulfi', 'Paratha', 'Naan', 'Daal', 'Pulao'];

        try {
            const apiCalls = [
                api.getRecipesByArea('Indian'), // Base
                ...keywords.map(k => fetch(`${BASE_URL}/search.php?s=${k}`).then(r => r.json()).then(d => d.meals || []))
            ];

            const responses = await Promise.all(apiCalls);
            const allApiMeals = responses.flat();

            // Deduplicate API meals
            const uniqueApiMeals = [...new Map(allApiMeals.map(m => [m.idMeal, m])).values()];
            const filteredApi = uniqueApiMeals.filter(isAllowed);

            // Merge LOCAL + API
            // Filter API results to remove duplicates if they somehow match local by name (unlikely but good practice)
            // Actually, just concat for now.
            return [...pakistaniRecipes, ...filteredApi];

        } catch (e) {
            console.error("Error fetching Pakistani meals", e);
            return pakistaniRecipes; // Fallback to at least showing local data
        }
    }
};
