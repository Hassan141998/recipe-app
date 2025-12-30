import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import Loader from '../components/Loader';
import { Heart, ShoppingBag, ArrowLeft, Youtube, Clock, MapPin, Tag } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalState';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toggleFavorite, isFavorite, addToShoppingList } = useGlobalContext();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const data = await api.getRecipeById(id);
                setRecipe(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    if (loading) return <Loader />;
    if (!recipe) return <div className="container p-4">Recipe not found</div>;

    // MealDB returns ingredients as strIngredient1, strMeasure1, etc.
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push({ name: ingredient, measure: measure });
        }
    }

    const isFav = isFavorite(recipe.idMeal);

    return (
        <div className="recipe-detail fade-in">
            {/* Hero Image & Back Button */}
            <div className="hero-container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} color="white" />
                </button>
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="hero-image" />
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="text-h1 hero-title">{recipe.strMeal}</h1>
                    <div className="hero-meta">
                        <span className="flex-center gap-2"><MapPin size={16} /> {recipe.strArea}</span>
                        <span className="flex-center gap-2"><Tag size={16} /> {recipe.strCategory}</span>
                    </div>
                </div>
            </div>

            <div className="container content-body">
                {/* Actions */}
                <div className="action-bar">
                    <button
                        className={`btn-icon action-btn ${isFav ? 'active' : ''}`}
                        onClick={() => toggleFavorite(recipe)}
                    >
                        <Heart size={24} fill={isFav ? "currentColor" : "none"} />
                    </button>
                    {recipe.strYoutube && (
                        <a href={recipe.strYoutube} target="_blank" rel="noreferrer" className="btn-icon action-btn youtube">
                            <Youtube size={24} />
                        </a>
                    )}
                </div>

                {/* Ingredients */}
                <section className="section">
                    <h2 className="text-h2">Ingredients</h2>
                    <ul className="ingredient-list">
                        {ingredients.map((ing, idx) => (
                            <li key={idx} className="ingredient-item">
                                <span className="ing-name">{ing.name}</span>
                                <span className="ing-measure">{ing.measure}</span>
                                <button
                                    className="add-shop-btn"
                                    onClick={() => addToShoppingList(ing)}
                                    aria-label="Add to shopping list"
                                >
                                    <ShoppingBag size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Instructions */}
                <section className="section">
                    <h2 className="text-h2">Instructions</h2>
                    <div className="instructions-text">
                        {recipe.strInstructions.split('\r\n').map((step, idx) => (
                            step.trim() && <p key={idx}>{step}</p>
                        ))}
                    </div>
                </section>
            </div>

            <style>{`
        .recipe-detail {
          padding-bottom: 80px;
        }
        .hero-container {
          position: relative;
          height: 350px;
          color: white;
        }
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
        }
        .back-btn {
          position: absolute;
          top: 1rem;
          left: 1rem;
          z-index: 10;
          padding: 8px;
          border-radius: 50%;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(4px);
        }
        .hero-content {
          position: absolute;
          bottom: 2rem;
          left: 1rem;
          right: 1rem;
        }
        .hero-title {
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .hero-meta {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          font-size: 0.9rem;
          opacity: 0.9;
        }
        .content-body {
          margin-top: -1.5rem;
          background: var(--color-bg);
          border-radius: 24px 24px 0 0;
          position: relative;
          padding-top: 2rem;
        }
        .action-bar {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .action-btn {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          width: 44px;
          height: 44px;
          box-shadow: var(--shadow-sm);
        }
        .action-btn.active {
          color: var(--color-primary);
          border-color: var(--color-primary);
          background: #FFF5F5;
        }
        .action-btn.youtube {
          color: #FF0000;
        }
        .section {
          margin-bottom: 2rem;
        }
        .text-h2 {
          margin-bottom: 1rem;
        }
        .ingredient-list {
          list-style: none;
        }
        .ingredient-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-border);
        }
        .ing-name {
          flex: 1;
          font-weight: 500;
        }
        .ing-measure {
          color: var(--color-text-secondary);
          margin-right: 1rem;
        }
        .add-shop-btn {
          color: var(--color-primary);
          padding: 4px;
          border-radius: 4px;
        }
        .add-shop-btn:active {
          background: var(--color-primary);
          color: white;
        }
        .instructions-text p {
          margin-bottom: 1rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }
      `}</style>
        </div>
    );
};

export default RecipeDetail;
