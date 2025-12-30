import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalState';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import ShoppingList from './pages/ShoppingList';
import RecipeDetail from './pages/RecipeDetail';

function App() {
  return (
    <Router>
      <GlobalProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/shop" element={<ShoppingList />} />
          </Route>
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </GlobalProvider>
    </Router>
  );
}

export default App;
