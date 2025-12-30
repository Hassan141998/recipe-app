import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, ShoppingBag } from 'lucide-react';

const BottomNavigation = () => {
    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/search', label: 'Search', icon: Search },
        { path: '/favorites', label: 'Favorites', icon: Heart },
        { path: '/shop', label: 'Shop', icon: ShoppingBag },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <item.icon size={24} />
                    <span className="nav-label">{item.label}</span>
                </NavLink>
            ))}

            <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: var(--color-surface);
          border-top: 1px solid var(--color-border);
          display: flex;
          justify-content: space-around;
          align-items: center;
          z-index: 50;
          box-shadow: 0 -1px 3px rgba(0,0,0,0.05);
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          font-size: 10px;
          gap: 4px;
          flex: 1;
          height: 100%;
        }
        .nav-item.active {
          color: var(--color-primary);
        }
        .nav-label {
          font-weight: 500;
        }
      `}</style>
        </nav>
    );
};

export default BottomNavigation;
