import React, { useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { bookHotel } from '../services/api';
import { ArrowLeft, CreditCard } from 'lucide-react';
import Loader from '../components/Loader';

const Checkout = () => {
    const { prebookId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const hotel = location.state?.hotel;
    const bookingDetails = location.state?.bookingDetails;

    const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
    const [loading, setLoading] = useState(false);

    if (!prebookId || !hotel) {
        return <div className="text-center py-20 text-gray-500">Session invalide ou expirée.</div>;
    }

    const price = bookingDetails?.price?.total || bookingDetails?.price || "Non renseigné";
    const currency = bookingDetails?.price?.currency || "EUR";

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                prebookId: prebookId,
                payment: {
                    method: 'ACC_CREDIT_CARD'
                },
                guestInfo: {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email
                }
            };
            const response = await bookHotel(payload);
            const bookingId = response?.data?.bookingId || response?.bookingId;
            navigate(`/success`, { state: { bookingId, hotel } });
        } catch (error) {
            console.error("Erreur de réservation", error);
            alert("Erreur lors de la finalisation de la réservation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6 md:p-8 max-w-2xl mx-auto">
            <Link to={`/hotel/${hotel.id || hotel.placeId}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Link>

            <h1 className="text-3xl font-bold mb-6">Finaliser votre réservation</h1>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
                <h2 className="font-bold text-lg">{hotel.name || "Hôtel"}</h2>
                <div className="text-gray-600 mb-2">{hotel.address}</div>
                <div className="flex justify-between items-center text-xl font-bold text-blue-600 mt-4">
                    <span>Total à payer</span>
                    <span>{price} {currency}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="text-xl font-bold">Informations sur l'hôte</h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                        <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input type="text" name="lastName" required value={form.lastName} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg flex items-start mt-4">
                    <CreditCard className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">En mode Sandbox, aucun paiement réel n'est effectué. La réservation est simulée avec une carte test automatique.</p>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-wait text-white font-bold py-3 px-8 rounded-lg shadow-sm transition-colors text-lg flex justify-center items-center"
                >
                    {loading ? <Loader /> : "Confirmer et Payer"}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
