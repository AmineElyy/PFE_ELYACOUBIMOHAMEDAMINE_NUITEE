import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';
import HotelList from '../components/HotelList';
import Filters from '../components/Filters';
import Loader from '../components/Loader';
import { searchRates } from '../services/api';

const Home = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ minPrice: 0, maxPrice: 10000, minRating: 0 });

    const handleSearch = async (payload) => {
        setLoading(true);
        try {
            const response = await searchRates(payload);
            // DEBUG: Log raw response to see structure from LiteAPI
            console.log("RAW API RESPONSE:", JSON.stringify(response, null, 2));
            setHotels(response?.data || []);
        } catch (error) {
            console.error("Erreur de recherche", error);
            alert("Erreur lors de la recherche des hôtels.");
        } finally {
            setLoading(false);
        }
    };

    const filteredHotels = hotels.filter(hotel => {
        const price = hotel.min_rate?.price || 0;
        const rating = hotel.rating || hotel.star_rating || 0;
        // En sandbox, si le prix est 0 (non fourni), on l'affiche quand même pour pouvoir tester le flux complet
        const priceMatch = price === 0 || (price >= filters.minPrice && price <= filters.maxPrice);
        return priceMatch && rating >= filters.minRating;
    });

    return (
        <div className="flex flex-col gap-6">
            <section className="bg-slate-800 rounded-xl p-8 text-white shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-center">Trouvez votre hôtel idéal</h2>
                <SearchForm onSearch={handleSearch} />
            </section>
            
            <div className="flex flex-col md:flex-row gap-8 mt-6">
                <aside className="w-full md:w-64 flex-shrink-0">
                    <Filters filters={filters} setFilters={setFilters} />
                </aside>
                
                <section className="flex-1">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader />
                        </div>
                    ) : hotels.length > 0 ? (
                        <HotelList hotels={filteredHotels} />
                    ) : (
                        <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow border border-gray-100">
                            Faites une recherche pour voir les hôtels disponibles.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Home;
