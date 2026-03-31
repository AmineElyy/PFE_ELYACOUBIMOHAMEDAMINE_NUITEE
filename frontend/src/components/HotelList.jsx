import React from 'react';
import HotelCard from './HotelCard';

const HotelList = ({ hotels }) => {
    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-xl text-gray-800">{hotels.length} établissements trouvés</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {hotels.map((hotel, idx) => (
                    <HotelCard key={hotel.hotel_id || idx} hotel={hotel} />
                ))}
            </div>
        </div>
    );
};

export default HotelList;
