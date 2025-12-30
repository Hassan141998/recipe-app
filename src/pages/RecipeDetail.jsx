import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useGlobalContext } from '../context/GlobalState';
import Loader from '../components/Loader';
import { Heart, ShoppingBag, ArrowLeft, Youtube, PlayCircle, Edit } from 'lucide-react'; // Added Edit icon

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);
    const [newImage, setNewImage] = useState('');

    const {
        toggleFavorite,
        isFavorite,
        addToShoppingList,
        customImages,
        addCustomImage
    } = useGlobalContext();

    useEffect(() => {
        api.getRecipeById(id).then(data => {
            setRecipe(data);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="flex-center p-8"><Loader /></div>;
    if (!recipe) return <div className="p-8 text-center">Recipe not found</div>;

    const nutrients = [
        { label: 'Calories', value: '320' },
        { label: 'Protein', value: '25g' },
        { label: 'Carbs', value: '45g' },
        { label: 'Fat', value: '12g' },
    ];

    // Ingredients extraction
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredients${i}`] || recipe[`strIngredient${i}`]; // Handle API inconsistency
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push({ name: ingredient, measure });
        }
    }

    // Determine Image Source
    const displayImage = customImages[id] || recipe.strMealThumb;

    const handleImageSave = () => {
        if (newImage.trim()) {
            addCustomImage(id, newImage);
            setShowEdit(false);
            setNewImage('');
        }
    };

    return (
        <div className="recipe-detail-page fade-in">
            <div className="hero-section">
                <img src={displayImage} alt={recipe.strMeal} className="hero-image" />
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <button className="edit-image-btn" onClick={() => setShowEdit(!showEdit)}>
                    <Edit size={20} />
                </button>
            </div>

            {/* Image Edit Input (Simple overlay) */}
            {showEdit && (
                <div style={{ padding: '1rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                    <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Paste new image URL:</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={newImage}
                            onChange={(e) => setNewImage(e.target.value)}
                            placeholder="https://..."
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)'
                            }}
                        />
                        <button
                            onClick={handleImageSave}
                            style={{
                                background: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                padding: '0 1rem',
                                borderRadius: '8px'
                            }}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}

            <div className="content-container">
                <div className="header-info">
                    <div className="title-row">
                        <h1 className="text-h1">{recipe.strMeal}</h1>
                        <button
                            className={`fav-btn ${isFavorite(recipe.idMeal) ? 'active' : ''}`}
                            onClick={() => toggleFavorite(recipe)}
                        >
                            <Heart size={24} fill={isFavorite(recipe.idMeal) ? "currentColor" : "none"} />
                        </button>
                    </div>
                    <div className="meta-row">
                        <span className="meta-tag">{recipe.strArea}</span>
                        <span className="meta-tag">{recipe.strCategory}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    {recipe.strYoutube && (
                        <a
                            href={recipe.strYoutube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn secondary"
                        >
                            <PlayCircle size={20} /> Watch Video
                        </a>
                    )}
                </div>

                {/* Ingredients */}
                <div className="section">
                    <h2 className="text-h2 mb-4">Ingredients</h2>
                    <div className="ingredients-list">
                        {ingredients.map((ing, idx) => (
                            <div key={idx} className="ingredient-row">
                                <div className="ing-info">
                                    <span className="ing-name">{ing.name}</span>
                                    <span className="ing-measure">{ing.measure}</span>
                                </div>
                                <button
                                    className="add-ing-btn"
                                    onClick={() => addToShoppingList(ing)}
                                >
                                    <ShoppingBag size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Instructions */}
                <div className="section">
                    <h2 className="text-h2 mb-4">Instructions</h2>
                    <p className="instructions-text">
                        {recipe.strInstructions}
                    </p>
                </div>
            </div>

            <style>{`
        .recipe-detail-page {
            padding-bottom: 5rem;
            background: var(--color-bg);
            min-height: 100vh;
        }
        .hero-section {
            position: relative;
            height: 350px;
            width: 100%;
        }
        .hero-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .back-btn {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255,255,255,0.9);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: var(--shadow-md);
            z-index: 10;
        }
        .edit-image-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.6);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            backdrop-filter: blur(4px);
        }
        .content-container {
            border-radius: 30px 30px 0 0;
            background: var(--color-bg);
            margin-top: -30px;
            position: relative;
            z-index: 5;
            padding: 2rem 1.5rem;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
        }
        .title-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.5rem;
        }
        .fav-btn {
            background: none;
            border: none;
            color: var(--color-text-secondary);
            cursor: pointer;
            transition: transform 0.2s;
        }
        .fav-btn.active {
            color: #FF5A5F;
        }
        .fav-btn:active {
            transform: scale(0.8);
        }
        .meta-row {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }
        .meta-tag {
            font-size: 0.85rem;
            color: var(--color-text-secondary);
            background: var(--color-surface);
            padding: 4px 12px;
            border-radius: 100px;
            border: 1px solid var(--color-border);
        }
        .action-buttons {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .action-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.8rem;
            border-radius: 12px;
            font-weight: 600;
            text-decoration: none;
            transition: transform 0.2s;
        }
        .action-btn.secondary {
            background: #FF0000; /* Youtube Red */
            color: white;
        }
        .action-btn:active {
            transform: scale(0.98);
        }
        .mb-4 { margin-bottom: 1rem; }
        .section { margin-bottom: 2.5rem; }
        
        .ingredients-list {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
        }
        .ingredient-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.8rem;
            background: var(--color-surface);
            border-radius: 12px;
            border: 1px solid var(--color-border);
        }
        .ing-info {
            display: flex;
            flex-direction: column;
        }
        .ing-name { font-weight: 500; }
        .ing-measure { font-size: 0.85rem; color: var(--color-text-secondary); }
        .add-ing-btn {
            background: rgba(0,0,0,0.05);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            color: var(--color-text-secondary);
            cursor: pointer;
        }
        .instructions-text {
            line-height: 1.8;
            color: var(--color-text-secondary);
        }
      `}</style>
        </div>
    );
};

export default RecipeDetail;
