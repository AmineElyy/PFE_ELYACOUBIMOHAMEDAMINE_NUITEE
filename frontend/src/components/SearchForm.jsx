import React, { useState, useEffect } from 'react';
import { getPlaces, searchRates } from '../services/api';
import { MapPin, Calendar, Users, Search } from 'lucide-react';

const SearchForm = ({ onSearch }) => {
    const [cityQuery, setCityQuery] = useState('');
    const [cityId, setCityId] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [adults, setAdults] = useState(2);

    useEffect(() => {
        let active = true;
        const fetchPlaces = async () => {
            if (cityQuery.length > 2) {
                try {
                    const data = await getPlaces(cityQuery);
                    if (active) {
                        setSuggestions(data?.data || []);
                        setShowSuggestions(true);
                    }
                } catch (e) {
                    if (active) console.error("Places API error", e);
                }
            } else {
                if (active) {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            }
        };
        const timeoutId = setTimeout(() => fetchPlaces(), 500);
        return () => {
            active = false;
            clearTimeout(timeoutId);
        };
    }, [cityQuery]);

    const handleSelectCity = (city) => {
        setCityQuery(city.displayName || city.name);
        setCityId(city.placeId || city.id);
        setShowSuggestions(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const payload = {
            checkin,
            checkout,
            occupancies: [{ adults: parseInt(adults) }],
            currency: 'EUR',
            guestNationality: 'FR'
        };

        if (cityId) {
            payload.placeId = cityId;
        } else {
            payload.aiSearch = cityQuery; // Utilise la recherche intelligente si la ville n'est pas selectionnée
        }

        onSearch(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-md text-gray-800 relative">
            <div className="flex-1 relative">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-3 py-2">
                    <MapPin className="text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Où allez-vous ?" 
                        className="bg-transparent outline-none w-full"
                        value={cityQuery}
                        onChange={(e) => { setCityQuery(e.target.value); setCityId(''); }}
                        required
                    />
                </div>
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 max-h-60 overflow-y-auto rounded shadow-lg text-left">
                        {suggestions.map((city, index) => (
                            <li 
                                key={city.placeId || city.id || index} 
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                                onClick={() => handleSelectCity(city)}
                            >
                                {city.displayName || city.name || city.cityName} {city.formattedAddress ? `, ${city.formattedAddress}` : (city.countryCode ? `, ${city.countryCode}` : '')}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-3 py-2">
                <Calendar className="text-gray-400 w-5 h-5" />
                <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} className="bg-transparent outline-none" required />
            </div>

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-3 py-2">
                <Calendar className="text-gray-400 w-5 h-5" />
                <input type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} className="bg-transparent outline-none" required />
            </div>

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-3 py-2">
                <Users className="text-gray-400 w-5 h-5" />
                <input type="number" min="1" value={adults} onChange={(e) => setAdults(e.target.value)} className="bg-transparent outline-none w-16" required />
            </div>

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded flex items-center gap-2 transition-colors">
                <Search className="w-5 h-5" />
                Rechercher
            </button>
        </form>
    );
};

export default SearchForm;
