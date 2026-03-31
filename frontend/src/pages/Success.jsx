import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Success = () => {
    const location = useLocation();
    const { bookingId, hotel } = location.state || {};

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 p-8 md:p-12 max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
                <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Réservation Confirmée !</h1>
            
            {bookingId ? (
                <>
                    <p className="text-lg text-gray-600 mb-8">
                        Merci pour votre réservation. Votre voyage est sécurisé.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left border border-gray-200">
                        <div className="text-sm text-gray-500 mb-1">Numéro de confirmation API</div>
                        <div className="text-xl font-mono font-bold text-gray-800 break-all">{bookingId}</div>
                    </div>
                </>
            ) : (
                <p className="text-lg text-gray-600 mb-8">
                    La réservation a été traitée avec succès, mais aucun ID n'est disponible.
                </p>
            )}

            <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow transition-colors">
                Faire une nouvelle recherche
            </Link>
        </div>
    );
};

export default Success;
