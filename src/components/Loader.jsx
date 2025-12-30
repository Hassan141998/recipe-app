import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = () => {
    return (
        <div className="flex-center" style={{ padding: '2rem', width: '100%', height: '100%' }}>
            <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
            <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Loader;
