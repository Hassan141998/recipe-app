import React, { useEffect, useState } from 'react';
import { api } from '../api';
import RecipeCard from '../components/RecipeCard';
import Loader from '../components/Loader';
import { Globe } from 'lucide-react';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState({ type: 'all', value: 'All' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, ar, rand] = await Promise.all([
                    api.getCategories(),
                    api.getAreas(),
                    api.getRandomRecipes(6)
                ]);
                setCategories(cats);

                // Add "Pakistani" manually if not present
                const hasPakistani = ar.some(a => a.strArea === 'Pakistani');
                const areasWithCustom = hasPakistani ? ar : [{ strArea: 'Pakistani' }, ...ar];

                // Filter areas to prioritize meaningful ones
                const prioritize = ['Pakistani', 'Turkish', 'Indian', 'Moroccan', 'Japanese', 'Italian', 'Mexican'];
                const sortedAreas = areasWithCustom.sort((a, b) => {
                    const aP = prioritize.indexOf(a.strArea);
                    const bP = prioritize.indexOf(b.strArea);

                    if (aP !== -1 && bP !== -1) return aP - bP;
                    if (aP !== -1) return -1;
                    if (bP !== -1) return 1;

                    return a.strArea.localeCompare(b.strArea);
                });
                setAreas(sortedAreas);
                setTrending(rand);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFilterClick = async (type, value) => {
        setActiveFilter({ type, value });
        setLoading(true);
        try {
            let recipes;
            if (type === 'all') {
                recipes = await api.getRandomRecipes(6);
            } else if (type === 'category') {
                recipes = await api.getRecipesByCategory(value);
            } else if (type === 'area') {
                if (value === 'Pakistani') {
                    recipes = await api.getPakistaniMeals();
                } else {
                    recipes = await api.getRecipesByArea(value);
                }
            }
            setTrending(recipes);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading && categories.length === 0) return <Loader />;

    return (
        <div className="container home-page fade-in">
            <header className="home-header">
                <h1 className="text-h1">What would you<br />like to cook?</h1>
            </header>

            {/* Categories Horizontal Scroll */}
            <section className="categories-section">
                <div className="section-header flex-center" style={{ justifyContent: 'space-between', marginBottom: '0.5rem', paddingLeft: '4px' }}>
                    <h3 className="section-title">Categories</h3>
                </div>
                <div className="categories-scroll hide-scrollbar">
                    <button
                        className={`category-pill ${activeFilter.type === 'all' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('all', 'All')}
                    >
                        All
                    </button>
                    {categories.slice(0, 10).map(cat => (
                        <button
                            key={cat.idCategory}
                            className={`category-pill ${activeFilter.type === 'category' && activeFilter.value === cat.strCategory ? 'active' : ''}`}
                            onClick={() => handleFilterClick('category', cat.strCategory)}
                        >
                            <img src={cat.strCategoryThumb} alt="" className="cat-thumb" />
                            {cat.strCategory}
                        </button>
                    ))}
                </div>
            </section>

            {/* Cuisines Horizontal Scroll */}
            <section className="categories-section">
                <div className="section-header flex-center" style={{ justifyContent: 'space-between', marginBottom: '0.5rem', paddingLeft: '4px' }}>
                    <h3 className="section-title flex-center gap-2"><Globe size={16} /> Cuisines</h3>
                </div>
                <div className="categories-scroll hide-scrollbar">
                    {areas.map(area => (
                        <button
                            key={area.strArea}
                            className={`category-pill ${activeFilter.type === 'area' && activeFilter.value === area.strArea ? 'active' : ''}`}
                            onClick={() => handleFilterClick('area', area.strArea)}
                        >
                            {area.strArea}
                        </button>
                    ))}
                </div>
            </section>

            {/* Recipe Grid */}
            <section className="trending-section">
                <h2 className="text-h2" style={{ marginBottom: '1rem' }}>
                    {activeFilter.type === 'all' ? 'Trending Now' :
                        activeFilter.type === 'area' ? `${activeFilter.value} Cuisine` :
                            `${activeFilter.value} Recipes`}
                </h2>
                {loading ? (
                    <Loader />
                ) : (
                    <div className="recipe-grid">
                        {trending.length > 0 ? trending.map(recipe => (
                            <RecipeCard key={recipe.idMeal} recipe={recipe} />
                        )) : <p>No recipes found.</p>}
                    </div>
                )}
            </section>

            <style>{`
        .home-page {
          padding-top: var(--spacing-6);
          padding-bottom: var(--spacing-8);
        }
        .home-header {
          margin-bottom: var(--spacing-6);
        }
        .categories-section {
          margin-bottom: var(--spacing-6);
          margin-left: -1rem; /* Full bleed on mobile */
          margin-right: -1rem;
          padding: 0 1rem;
        }
        .section-title {
           font-size: var(--font-size-base);
           font-weight: 600;
           color: var(--color-text-main);
        }
        .categories-scroll {
          display: flex;
          gap: var(--spacing-3);
          overflow-x: auto;
          padding-bottom: var(--spacing-2);
          scroll-behavior: smooth;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .category-pill {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          padding: var(--spacing-2) var(--spacing-4);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          font-weight: 500;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }
        .category-pill.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        .cat-thumb {
          width: 20px;
          height: 20px;
          object-fit: contain;
          border-radius: 50%;
        }
        .recipe-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: var(--spacing-4);
        }
      `}</style>
        </div>
    );
};

export default Home;
