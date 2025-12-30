import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
    return (
        <Link to={`/recipe/${recipe.idMeal}`} className="recipe-card">
            <div className="card-image-container">
                <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="card-image"
                    loading="lazy"
                />
                <div className="card-overlay" />
            </div>
            <div className="card-content">
                <h3 className="card-title line-clamp-2">{recipe.strMeal}</h3>
                <div className="card-meta">
                    {recipe.strArea && <span className="tag">{recipe.strArea}</span>}
                    {recipe.strCategory && <span className="tag">{recipe.strCategory}</span>}
                </div>
            </div>

            <style>{`
        .recipe-card {
          display: block;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--color-surface);
          box-shadow: var(--shadow-md);
          transition: transform var(--transition-fast);
          position: relative;
        }
        .recipe-card:active {
          transform: scale(0.98);
        }
        .card-image-container {
          position: relative;
          aspect-ratio: 4/3;
        }
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%);
        }
        .card-content {
          padding: var(--spacing-3);
        }
        .card-title {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--color-text-main);
          margin-bottom: var(--spacing-1);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-meta {
          display: flex;
          gap: var(--spacing-2);
          flex-wrap: wrap;
        }
        .tag {
          font-size: 10px;
          padding: 2px 6px;
          background: var(--color-bg);
          border-radius: var(--radius-sm);
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
        </Link>
    );
};

export default RecipeCard;
