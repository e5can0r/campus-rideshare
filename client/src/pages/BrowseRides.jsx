import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RideCard from '../components/RideCard';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function BrowseRides() {
  const [rides, setRides] = useState([]);
  const [filters, setFilters] = useState({ originCity: '', travelDate: '', transportMode: '' });
  const [loading, setLoading] = useState(false);
  const [joiningRideId, setJoiningRideId] = useState(null);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      try {
        let query = new URLSearchParams(filters).toString();
        const res = await fetch(`http://localhost:5000/api/rides?${query}`);
        const data = await res.json();
        setRides(data);
      } catch (error) {
        console.error('Error fetching rides:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRides();
  }, [filters]);

  const handleJoin = async (ride) => {
    if (!auth?.token) {
      alert('Please login to join rides');
      navigate('/login');
      return;
    }

    setJoiningRideId(ride._id);
    try {
      const res = await fetch(`http://localhost:5000/api/rides/${ride._id}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (res.ok) {
        const updatedRide = await res.json();
        alert('Joined successfully!');
        navigate('/ride-details', { state: { ride: updatedRide } });
      } else {
        const data = await res.json();
        alert(data.message || 'Error joining ride');
      }
    } catch (error) {
      console.error('Error joining ride:', error);
      alert('Failed to join ride. Please try again.');
    } finally {
      setJoiningRideId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Find Your Ride</h1>
          <p className="text-lg text-gray-600">Connect with fellow students heading back to campus</p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Rides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From City</label>
              <input 
                type="text"
                placeholder="Enter city name"
                className="input"
                value={filters.originCity}
                onChange={e => setFilters({...filters, originCity: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
              <input 
                type="date" 
                className="input"
                value={filters.travelDate}
                onChange={e => setFilters({...filters, travelDate: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transport Mode</label>
              <select 
                className="input"
                value={filters.transportMode}
                onChange={e => setFilters({...filters, transportMode: e.target.value})}
              >
                <option value="">All Modes</option>
                <option value="Train">Train</option>
                <option value="Bus">Bus</option>
                <option value="Auto">Auto</option>
                <option value="Cab">Cab</option>
                <option value="Flight">Flight</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">Loading rides...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rides found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Found <span className="font-medium">{rides.length}</span> ride{rides.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rides.map(ride => (
                <RideCard 
                  key={ride._id} 
                  ride={ride} 
                  onJoin={handleJoin}
                  isJoining={joiningRideId === ride._id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
