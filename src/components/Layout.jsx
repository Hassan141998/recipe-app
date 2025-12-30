import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const Layout = () => {
    return (
        <div className="app-shell">
            <main className="content-area">
                <Outlet />
            </main>
            <BottomNavigation />

            <style>{`
        .app-shell {
          min-height: 100vh;
          background-color: var(--color-bg);
          padding-bottom: 70px; /* Space for bottom nav */
        }
        .content-area {
          max-width: 800px;
          margin: 0 auto;
          min-height: 100vh;
        }
      `}</style>
        </div>
    );
};

export default Layout;
