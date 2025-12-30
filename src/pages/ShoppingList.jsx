import React from 'react';
import { useGlobalContext } from '../context/GlobalState';
import { Trash2, CheckSquare, Square } from 'lucide-react';

const ShoppingList = () => {
    const { shoppingList, toggleIngredient, removeIngredient } = useGlobalContext();

    return (
        <div className="container p-4 fade-in">
            <header className="mb-6">
                <h1 className="text-h1">Shopping List</h1>
                <p className="text-small">{shoppingList.length} items</p>
            </header>

            {shoppingList.length === 0 ? (
                <div className="empty-state">
                    <div className="icon-box">
                        <CheckSquare size={32} />
                    </div>
                    <p>Your list is empty.</p>
                    <p className="text-small">Add ingredients from recipe details.</p>
                </div>
            ) : (
                <ul className="shopping-list">
                    {shoppingList.map(item => (
                        <li key={item.id} className={`list-item ${item.checked ? 'checked' : ''}`}>
                            <button
                                className="check-btn"
                                onClick={() => toggleIngredient(item.id)}
                            >
                                {item.checked ? <CheckSquare color="var(--color-primary)" /> : <Square color="var(--color-text-secondary)" />}
                            </button>

                            <div className="item-details" onClick={() => toggleIngredient(item.id)}>
                                <span className="item-name">{item.name}</span>
                                <span className="item-measure">{item.measure}</span>
                            </div>

                            <button
                                className="delete-btn"
                                onClick={() => removeIngredient(item.id)}
                            >
                                <Trash2 size={18} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <style>{`
        .p-4 { padding-top: var(--spacing-6); padding-bottom: var(--spacing-6); }
        .mb-6 { margin-bottom: 1.5rem; }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          gap: 1rem;
          color: var(--color-text-secondary);
        }
        .icon-box {
          width: 64px;
          height: 64px;
          background: var(--color-surface);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-border);
        }
        .shopping-list {
          list-style: none;
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          overflow: hidden;
        }
        .list-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--color-border);
          transition: background-color var(--transition-fast);
        }
        .list-item:last-child {
          border-bottom: none;
        }
        .list-item.checked .item-name {
          text-decoration: line-through;
          color: var(--color-text-secondary);
        }
        .check-btn {
          padding: 4px;
          margin-right: 0.5rem;
        }
        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }
        .item-name {
          font-weight: 500;
        }
        .item-measure {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
        }
        .delete-btn {
          padding: 8px;
          color: var(--color-text-secondary);
          opacity: 0.5;
          transition: opacity var(--transition-fast);
        }
        .delete-btn:hover {
          opacity: 1;
          color: var(--color-error);
        }
      `}</style>
        </div>
    );
};

export default ShoppingList;
