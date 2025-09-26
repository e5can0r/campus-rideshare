import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function RideCard({ ride, onJoin, isJoining = false }) {
  const { auth } = useContext(AuthContext);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransportIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'train': return '🚆';
      case 'bus': return '🚌';
      case 'auto': return '🛺';
      case 'cab': return '🚖';
      case 'flight': return '✈️';
      case 'car': return '🚗';
      default: return '🚗';
    }
  };

  // ✅ Determine role of current user
  const isCreator = ride.userId?._id?.toString() === auth?.user?.id;
  const hasJoined = ride.participants?.some((p) => p._id?.toString() === auth?.user?.id);

  return (
    <div className="card-hover p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {ride.originCity} → Campus
          </h3>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="mr-2">👤</span>
            Posted by {ride.userId?.name || 'Anonymous'}
          </div>
        </div>
        <div className="text-2xl">{getTransportIcon(ride.transportMode)}</div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">📅</span>
          <span className="text-sm font-medium text-gray-700">{formatDate(ride.travelDate)}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">🚗</span>
          <span className="text-sm font-medium text-gray-700 capitalize">{ride.transportMode}</span>
        </div>
        {ride.phoneVisible && ride.phone && (
          <div className="flex items-center col-span-2">
            <span className="text-gray-400 mr-2">📱</span>
            <span className="text-sm font-medium text-gray-700">{ride.phone}</span>
          </div>
        )}
      </div>

      {/* Notes */}
      {ride.additionalNotes && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic">
            "{ride.additionalNotes}"
          </p>
        </div>
      )}

      {/* Participants */}
      <p className="text-sm text-gray-600 mt-1">
        👥 {ride.participants?.length || 0} joined
      </p>

      {/* Action Section */}
      <div className="mt-3">
        {isCreator ? (
          <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
            You are the creator
          </span>
        ) : hasJoined ? (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            Already Joined
          </span>
        ) : (
          onJoin && (
            <button
              onClick={() => onJoin(ride)}
              disabled={isJoining}
              className="btn btn-primary w-full"
            >
              {isJoining ? 'Joining...' : 'Join Ride'}
            </button>
          )
        )}
      </div>
    </div>
  );
}
