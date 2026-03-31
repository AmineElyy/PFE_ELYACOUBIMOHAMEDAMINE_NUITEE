import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { getHotelDetails, prebookHotel } from '../services/api';
import { ArrowLeft, Star, MapPin } from 'lucide-react';
import Loader from '../components/Loader';

const Details = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const searchHotelData = location.state?.hotel || null;
    
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [prebookLoading, setPrebookLoading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await getHotelDetails(id);
                const fullHotelDetails = response?.data || response;
                // Merge search data (which has rates) with rich details
                setHotel({ ...searchHotelData, ...fullHotelDetails });
            } catch (error) {
                console.error("Erreur de détails", error);
                if (searchHotelData) setHotel(searchHotelData);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, searchHotelData]);

    if (loading) return <div className="flex justify-center items-center h-[60vh]"><Loader /></div>;
    if (!hotel) return <div className="text-center py-20 text-gray-500">Hôtel introuvable.</div>;

    const handlePrebook = async () => {
        // Find the first available offerId (assuming hotel.rates exists from sandbox payload)
        // If rates is missing, we use a fake one or fail gracefully.
        let offerId = null;
        if (hotel.rates && hotel.rates.length > 0) {
            offerId = hotel.rates[0].offerId;
        } else if (hotel.min_rate?.offerId) {
            offerId = hotel.min_rate.offerId;
        }

        if (!offerId) {
            alert("Aucune offre disponible pour cet hôtel à ces dates. (Mode Sandbox)");
            return;
        }

        setPrebookLoading(true);
        try {
            const response = await prebookHotel({ offerId, usePaymentSdk: false });
            // The response should contain a prebookId
            const prebookId = response?.data?.prebookId || response?.prebookId;
            if (prebookId) {
                // Navigate to Checkout page with prebookId and price info
                navigate(`/checkout/${prebookId}`, { state: { hotel, bookingDetails: response.data || response } });
            } else {
                throw new Error("prebookId introuvable dans la réponse");
            }
        } catch (error) {
            console.error("Erreur de pré-réservation", error);
            alert("Impossible de pré-réserver cet hôtel (Erreur API).");
        } finally {
            setPrebookLoading(false);
        }
    };

    const name = hotel.name || "Détails de l'hôtel";
    const description = hotel.description || "Aucune description disponible pour cet établissement.";
    const rating = hotel.rating || hotel.star_rating || 0;
    const address = hotel.address || "Adresse inconnue";
    const mainImage = hotel.main_photo || hotel.main_image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6 md:p-8">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux résultats
            </Link>
            
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
                    <div className="flex items-center text-gray-500 gap-4">
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="font-semibold">{rating} étoiles</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-5 h-5" />
                            <span>{address}</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={handlePrebook}
                    disabled={prebookLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-wait text-white font-bold py-3 px-8 rounded-lg shadow-sm transition-colors text-lg flex items-center justify-center min-w-[160px]"
                >
                    {prebookLoading ? <Loader /> : "Pré-réserver"}
                </button>
            </div>

            <div className="h-[400px] rounded-xl overflow-hidden mb-8">
                <img src={mainImage} alt={name} className="w-full h-full object-cover" />
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">À propos de cet hébergement</h2>
                <div className="text-gray-700 leading-relaxed max-w-4xl" dangerouslySetInnerHTML={{ __html: description }} />
            </div>
        </div>
    );
};

export default Details;
