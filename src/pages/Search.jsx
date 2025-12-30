import React, { useState, useEffect } from 'react';
import { api } from '../api';
import RecipeCard from '../components/RecipeCard';
import Loader from '../components/Loader';
import { Search as SearchIcon, X, Globe } from 'lucide-react';

const CUISINE_MAPPINGS = {
    'pakistani': {
        area: 'Indian',
        keywords: ['Karahi', 'Biryani', 'Tikka', 'Kebab', 'Nihari', 'Haleem', 'Chaat', 'Kulfi', 'Paratha', 'Naan', 'Daal', 'Pulao']
    },
    'pakistan': {
        area: 'Indian',
        keywords: ['Karahi', 'Biryani', 'Tikka', 'Kebab', 'Nihari', 'Haleem', 'Chaat', 'Kulfi', 'Paratha', 'Naan', 'Daal', 'Pulao']
    },
    // Add other mappings if needed
};

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchMeta, setSearchMeta] = useState('');

    // Fetch categories on mount
    useEffect(() => {
        api.getCategories().then(setCategories).catch(console.error);
    }, []);

    // Search logic
    useEffect(() => {
        const doSearch = async () => {
            setLoading(true);
            setSearchMeta('');
            try {
                let data = [];
                const cleanQuery = query.toLowerCase().trim();

                // 1. Check if it matches a specific Cuisine Mapping (Smart Search)
                if (CUISINE_MAPPINGS[cleanQuery]) {
                    const mapping = CUISINE_MAPPINGS[cleanQuery];
                    setSearchMeta(`Exploring best ${cleanQuery} dishes (Curries, BBQ, Rice & more)`);

                    const apiCalls = [
                        api.getRecipesByArea(mapping.area),
                        ...mapping.keywords.map(k => api.searchRecipes(k))
                    ];

                    const responses = await Promise.all(apiCalls);
                    const allMeals = responses.flat();

                    // Deduplicate by idMeal
                    const uniqueMeals = [...new Map(allMeals.map(m => [m.idMeal, m])).values()];
                    data = uniqueMeals;

                } else if (cleanQuery.length > 2) {
                    // 2. Normal Search checks against known areas or full text
                    const areas = ['American', 'British', 'Canadian', 'Chinese', 'Croatian', 'Dutch', 'Egyptian', 'Filipino', 'French', 'Greek', 'Indian', 'Irish', 'Italian', 'Jamaican', 'Japanese', 'Kenyan', 'Malaysian', 'Mexican', 'Moroccan', 'Polish', 'Portuguese', 'Russian', 'Spanish', 'Thai', 'Tunisian', 'Turkish', 'Unknown', 'Vietnamese'];

                    const areaMatch = areas.find(a => a.toLowerCase() === cleanQuery);
                    if (areaMatch) {
                        setSearchMeta(`Browsing ${areaMatch} Cuisine`);
                        data = await api.getRecipesByArea(areaMatch);
                    } else {
                        data = await api.searchRecipes(query);
                    }
                } else if (activeCategory) {
                    data = await api.getRecipesByCategory(activeCategory);
                }

                setResults(data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(() => {
            if (query.length > 2 || activeCategory) {
                doSearch();
            } else {
                setResults([]);
                setSearchMeta('');
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [query, activeCategory]);

    return (
        <div className="container search-page fade-in">
            <div className="search-header sticky">
                <h1 className="text-h1 mb-4">Find Recipes</h1>

                {/* Search Bar */}
                <div className="search-bar">
                    <SearchIcon size={20} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Type 'Pakistani', 'Italian', or 'Chicken'..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button className="clear-btn" onClick={() => setQuery('')}>
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="filters-scroll hide-scrollbar mt-4">
                    {categories.slice(0, 10).map(cat => (
                        <button
                            key={cat.idCategory}
                            className={`filter-chip ${activeCategory === cat.strCategory ? 'active' : ''}`}
                            onClick={() => {
                                setQuery(''); // Clear query when selecting category
                                setActiveCategory(prev => prev === cat.strCategory ? null : cat.strCategory);
                            }}
                        >
                            {cat.strCategory}
                        </button>
                    ))}
                </div>
            </div>

            <div className="results-area mt-6">
                {searchMeta && <div className="meta-tag flex-center gap-2 mb-4"><Globe size={14} /> {searchMeta}</div>}

                {loading ? (
                    <div className="flex-center p-8"><Loader /></div>
                ) : (
                    <>
                        {results.length > 0 ? (
                            <div className="recipe-grid">
                                {results.map(meal => (
                                    <RecipeCard key={meal.idMeal} meal={meal} recipe={meal} />
                                ))}
                            </div>
                        ) : (
                            (query.length > 2 || activeCategory) && (
                                <div className="empty-state text-center p-8">
                                    <p className="text-small">No recipes found.</p>
                                </div>
                            )
                        )}

                        {/* Initial State / Suggestions */}
                        {!query && !activeCategory && (
                            <div className="empty-state text-center p-8">
                                <p className="text-small">Try searching for "Chicken", "Pakistani", or select a category.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
        .search-page {
          padding-top: var(--spacing-6);
        }
        .text-center { text-align: center; }
        .p-8 { padding: 2rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-6 { margin-top: 1.5rem; }
        
        .sticky {
          position: sticky;
          top: 0;
          background: var(--color-bg);
          z-index: 20;
          padding-bottom: 1rem;
        }

        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-input {
          width: 100%;
          padding: 12px 40px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          font-size: var(--font-size-base);
          transition: border-color var(--transition-fast);
        }
        .search-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--color-text-secondary);
        }
        .clear-btn {
          position: absolute;
          right: 12px;
          padding: 4px;
          color: var(--color-text-secondary);
        }
        
        .filters-scroll {
          display: flex;
          gap: var(--spacing-2);
          overflow-x: auto;
          white-space: nowrap;
          padding-bottom: 4px;
        }
        .filter-chip {
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }
        .filter-chip.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        .recipe-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: var(--spacing-4);
        }
        .meta-tag {
          font-size: var(--font-size-sm);
          color: var(--color-primary);
          background: rgba(255, 107, 107, 0.1);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          display: inline-flex;
          font-weight: 500;
        }
      `}</style>
        </div>
    );
};

export default Search;
