import React, { createContext, useContext, useEffect, useState } from 'react';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    // Favorites Logic
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (recipe) => {
        setFavorites(prev => {
            const exists = prev.find(item => item.idMeal === recipe.idMeal);
            if (exists) {
                return prev.filter(item => item.idMeal !== recipe.idMeal);
            }
            return [...prev, recipe];
        });
    };

    const isFavorite = (id) => {
        return favorites.some(item => item.idMeal === id);
    };

    // Shopping List Logic
    const [shoppingList, setShoppingList] = useState(() => {
        const saved = localStorage.getItem('shoppingList');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    }, [shoppingList]);

    const addToShoppingList = (ingredient) => {
        setShoppingList(prev => {
            // Avoid exact duplicates if desired, or allow them. simpler to allow/check
            if (prev.find(item => item.name === ingredient.name)) return prev;
            return [...prev, { ...ingredient, checked: false, id: Date.now() }];
        });
    };

    const toggleIngredient = (id) => {
        setShoppingList(prev => prev.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const removeIngredient = (id) => {
        setShoppingList(prev => prev.filter(item => item.id !== id));
    };


    // Custom Images Logic
    const [customImages, setCustomImages] = useState(() => {
        const saved = localStorage.getItem('customImages');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('customImages', JSON.stringify(customImages));
    }, [customImages]);

    const addCustomImage = (id, url) => {
        setCustomImages(prev => ({ ...prev, [id]: url }));
    };

    const value = {
        favorites,
        toggleFavorite,
        isFavorite,
        shoppingList,
        addToShoppingList,
        toggleIngredient,
        removeIngredient,
        customImages,
        addCustomImage
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};
