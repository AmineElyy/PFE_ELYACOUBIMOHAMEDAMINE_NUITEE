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
            console.log("RAW API RESPONSE:", JSON.stringify(response, null, 2));
            
            // LiteAPI renvoie les données statiques dans 'hotels' et les tarifs dans 'data'
            const staticHotels = response?.hotels || [];
            const ratesData = response?.data || [];
            
            // Création d'un dictionnaire (Map) pour accélérer la recherche des infos O(1)
            const staticMap = new Map();
            staticHotels.forEach(h => staticMap.set(h.id, h));
            
            const mappedHotels = ratesData.map(rateObj => {
                const staticInfo = staticMap.get(rateObj.hotelId) || {};
                
                let minPrice = Infinity;
                let currency = "EUR";
                let offerId = null;
                
                if (rateObj.roomTypes && rateObj.roomTypes.length > 0) {
                    rateObj.roomTypes.forEach(room => {
                        const price = room.retailRate?.total?.[0]?.amount 
                                      || room.offerRetailRate?.amount 
                                      || room.retailRate?.suggestedSellingPrice?.[0]?.amount 
                                      || Infinity;
                        const roomCurrency = room.retailRate?.total?.[0]?.currency 
                                             || room.offerRetailRate?.currency 
                                             || "EUR";
                                             
                        if (price < minPrice) {
                            minPrice = price;
                            currency = roomCurrency;
                            offerId = room.offerId || null;
                        }
                    });
                }
                
                if (minPrice === Infinity) minPrice = 0;

                return {
                    id: rateObj.hotelId,
                    name: staticInfo.name || "Hôtel Inconnu",
                    main_photo: staticInfo.main_photo,
                    thumbnail: staticInfo.thumbnail,
                    address: staticInfo.address,
                    rating: staticInfo.rating,
                    min_rate: {
                        price: minPrice,
                        currency: currency,
                        offerId: offerId
                    },
                    raw_rooms: rateObj.roomTypes
                };
            });
            
            setHotels(mappedHotels);
        } catch (error) {
            console.error("Erreur de recherche", error);
            alert("Erreur lors de la recherche des hôtels.");
        } finally {
            setLoading(false);
        }
    };

    const filteredHotels = React.useMemo(() => {
        return hotels.filter(hotel => {
            const price = hotel.min_rate?.price || 0;
            const rating = hotel.rating || hotel.star_rating || 0;
            // En sandbox, si le prix est 0 (non fourni), on l'affiche quand même pour pouvoir tester
            const priceMatch = price === 0 || (price >= filters.minPrice && price <= filters.maxPrice);
            return priceMatch && rating >= filters.minRating;
        });
    }, [hotels, filters]);

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
