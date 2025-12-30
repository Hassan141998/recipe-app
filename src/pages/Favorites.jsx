import React from 'react';
import { useGlobalContext } from '../context/GlobalState';
import RecipeCard from '../components/RecipeCard';
import { Heart } from 'lucide-react';

const Favorites = () => {
    const { favorites } = useGlobalContext();

    return (
        <div className="container p-4 fade-in">
            <header className="mb-6">
                <h1 className="text-h1 flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem' }}>
                    <Heart fill="var(--color-primary)" color="var(--color-primary)" />
                    Favorites
                </h1>
            </header>

            {favorites.length === 0 ? (
                <div className="empty-state">
                    <Heart size={48} color="var(--color-border)" />
                    <p>No favorites yet.</p>
                    <p className="text-small">Save recipes you love to find them here.</p>
                </div>
            ) : (
                <div className="recipe-grid">
                    {favorites.map(recipe => (
                        <RecipeCard key={recipe.idMeal} recipe={recipe} />
                    ))}
                </div>
            )}

            <style>{`
        .p-4 { padding-top: var(--spacing-6); padding-bottom: var(--spacing-6); }
        .mb-6 { margin-bottom: 1.5rem; }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          gap: 1rem;
          color: var(--color-text-secondary);
          text-align: center;
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

export default Favorites;
