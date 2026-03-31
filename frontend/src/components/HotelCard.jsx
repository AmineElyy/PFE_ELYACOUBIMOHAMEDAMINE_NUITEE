import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const HotelCard = ({ hotel }) => {
    // LiteAPI parsing (assuming standard structures)
    const name = hotel.name || hotel.hotel_name || "Hôtel Inconnu";
    const image = hotel.main_photo || hotel.thumbnail || hotel.hotel_image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    const rating = hotel.rating || hotel.star_rating || 0;
    const price = hotel.min_rate?.price || 0;
    const currency = hotel.min_rate?.currency || "EUR";
    const id = hotel.id || hotel.hotel_id || "1";
    const address = hotel.address || "Emplacement par défaut";

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 overflow-hidden relative">
                <img src={image} alt={name} className="w-full h-full object-cover transition-transform hover:scale-105" />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    {rating > 0 ? rating : 'N/A'}
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-1 truncate">{name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{address}</p>
                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <span className="text-gray-500 text-xs block">{price > 0 ? "À partir de" : "Tarif"}</span>
                        <span className="font-bold text-xl text-blue-600">
                            {price > 0 ? `${price} ${currency}` : "Non disponible"}
                        </span>
                    </div>
                    <Link to={`/hotel/${id}`} state={{ hotel }} className="bg-blue-50 text-blue-600 font-medium px-4 py-2 rounded hover:bg-blue-100 transition-colors">
                        Voir plus
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;
