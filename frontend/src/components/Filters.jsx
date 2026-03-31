import React from 'react';

const Filters = ({ filters, setFilters }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4 border-b pb-2">Filtres</h3>
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix max ({filters.maxPrice}€)</label>
                <input 
                    type="range" 
                    min="10" max="2000" step="10"
                    value={filters.maxPrice} 
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Note minimum (+{filters.minRating}⭐)</label>
                <input 
                    type="range" 
                    min="0" max="5" step="1"
                    value={filters.minRating} 
                    onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default Filters;
