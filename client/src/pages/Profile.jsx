import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EditRideForm from '../components/EditRideForm';
import Spinner from '../components/Spinner';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function Profile() {
  const { auth, logout } = useContext(AuthContext);
  const [createdRides, setCreatedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]);
  const [editingRide, setEditingRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created');
  const navigate = useNavigate();

  // Fetch created rides
  const fetchCreatedRides = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rides/created`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      const rides = await res.json();
      setCreatedRides(rides);
    } catch (err) {
      console.error('Failed to fetch created rides:', err);
    }
  };

  // Fetch joined rides
  const fetchJoinedRides = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rides/joined`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      const joined = await res.json();
      setJoinedRides(joined);
    } catch (err) {
      console.error('Failed to fetch joined rides:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (auth?.token) {
        setLoading(true);
        await Promise.all([fetchCreatedRides(), fetchJoinedRides()]);
        setLoading(false);
      }
    };
    fetchData();
  }, [auth?.token]);

  // Delete ride
  const handleDelete = async (rideId) => {
    try {
      await fetch(`${API_BASE_URL}/api/rides/${rideId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setCreatedRides((prev) => prev.filter((r) => r._id !== rideId));
    } catch (err) {
      console.error('Failed to delete ride:', err);
    }
  };

  // Save edited ride
  const handleSaveEdit = async (updatedRide) => {
    try {
      await fetch(`${API_BASE_URL}/api/rides/${updatedRide._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(updatedRide),
      });
      setCreatedRides((prev) =>
        prev.map((r) => (r._id === updatedRide._id ? updatedRide : r))
      );
      setEditingRide(null);
    } catch (err) {
      console.error('Failed to update ride:', err);
    }
  };

  const getTransportEmoji = (mode) => {
    const emojiMap = {
      'Train': '🚆',
      'Flight': '✈️',
      'Bus': '🚌',
      'Auto': '🛺',
      'Cab': '🚗'
    };
    return emojiMap[mode] || '🚗';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">👤 My Profile</h1>
            <p className="text-gray-600">Welcome back, {auth?.user?.name || 'User'}!</p>
          </div>
          <button
            className="btn-danger mt-4 md:mt-0"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            🚪 Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl mb-2">🚗</div>
            <div className="text-2xl font-bold text-primary-600">{createdRides.length}</div>
            <div className="text-sm text-gray-600">Rides Created</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl mb-2">🎫</div>
            <div className="text-2xl font-bold text-secondary-600">{joinedRides.length}</div>
            <div className="text-sm text-gray-600">Rides Joined</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl mb-2">🌟</div>
            <div className="text-2xl font-bold text-accent-600">{createdRides.length + joinedRides.length}</div>
            <div className="text-sm text-gray-600">Total Activity</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'created'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('created')}
          >
            🚗 Created Rides ({createdRides.length})
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'joined'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('joined')}
          >
            🎫 Joined Rides ({joinedRides.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'created' && (
          <div>
            {createdRides.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No rides created yet</h3>
                <p className="text-gray-600 mb-4">Start by posting your first ride to help others travel with you!</p>
                <button
                  className="btn-primary"
                  onClick={() => navigate('/post')}
                >
                  🚀 Post Your First Ride
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {createdRides.map((ride) => (
                  <div key={ride._id} className="card-hover p-6">
                    {editingRide?._id === ride._id ? (
                      <EditRideForm
                        ride={ride}
                        onSave={handleSaveEdit}
                        onCancel={() => setEditingRide(null)}
                      />
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-3">
                              <span className="text-2xl mr-3">{getTransportEmoji(ride.transportMode)}</span>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  From {ride.originCity}
                                </h3>
                                <p className="text-sm text-gray-600">{ride.transportMode}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="mr-2">📅</span>
                                {formatDate(ride.travelDate)}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="mr-2">🕐</span>
                                {ride.arrivalTime}
                              </div>
                            </div>
                            {ride.additionalNotes && (
                              <div className="mb-4">
                                <p className="text-sm text-gray-600">
                                  <span className="mr-2">📝</span>
                                  {ride.additionalNotes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4 border-t">
                          <button
                            className="btn-secondary flex-1"
                            onClick={() => setEditingRide(ride)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn-danger flex-1"
                            onClick={() => handleDelete(ride._id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'joined' && (
          <div>
            {joinedRides.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="text-6xl mb-4">🎫</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No rides joined yet</h3>
                <p className="text-gray-600 mb-4">Browse available rides and join one that matches your travel plans!</p>
                <button
                  className="btn-primary"
                  onClick={() => navigate('/browse')}
                >
                  🔍 Browse Rides
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {joinedRides.map((ride) => (
                  <div key={ride._id} className="card-hover p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className="text-2xl mr-3">{getTransportEmoji(ride.transportMode)}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              From {ride.originCity}
                            </h3>
                            <p className="text-sm text-gray-600">{ride.transportMode}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">📅</span>
                            {formatDate(ride.travelDate)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">🕐</span>
                            {ride.arrivalTime}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">👤</span>
                            Posted by {ride.userId?.name || 'Unknown'}
                          </div>
                        </div>
                        {ride.additionalNotes && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600">
                              <span className="mr-2">📝</span>
                              {ride.additionalNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <button
                        className="btn-primary w-full"
                        onClick={() => navigate('/ride-details', { state: { ride, isJoined: true } })}
                      >
                        💬 View Details / Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
