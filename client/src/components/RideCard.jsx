export default function RideCard({ ride, onJoin, isJoining = false }) {
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
      case 'car': return '🚗';
      case 'flight': return '✈️';
      default: return '🚗';
    }
  };

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

      {/* Action Button */}
      {onJoin && (
        <button
          onClick={() => onJoin(ride)}
          disabled={isJoining}
          className="btn btn-primary w-full mt-2"
        >
          {isJoining ? 'Joining...' : 'Join Ride'}
        </button>
      )}
    </div>
  );
}
