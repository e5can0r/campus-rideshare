import ChatRoom from './ChatRoom';
import { useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

import { API_BASE_URL } from './config';
export default function RideDetails() {
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const [hasJoined, setHasJoined] = useState(false);
  const [rideData, setRideData] = useState(null);
  const [error, setError] = useState(null);

  const { ride, isJoined } = location.state || {}; // ride passed from BrowseRides/Profile

  useEffect(() => {
    const fetchRide = async () => {
      if (!ride || !auth?.user?.id) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/rides/${ride._id}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        if (!res.ok) {
          setError('Ride not found or you do not have access.');
          return;
        }
        const data = await res.json();
        setRideData(data);
        // Use isJoined from navigation state if available, otherwise check participants
        const userHasJoined =
          isJoined !== undefined
            ? isJoined
            : data.userId.toString() === auth.user.id || data.participants.includes(auth.user.id);
        setHasJoined(userHasJoined);
      } catch (err) {
        setError('Failed to load ride details.');
      }
    };
    fetchRide();
  }, [ride, auth, isJoined]);

  if (!ride) return <div>No ride selected.</div>;
  if (error) return <div>{error}</div>;
  if (!rideData) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-primary-700 flex items-center gap-2">
        🚗 Ride Details
      </h2>
      <div className="space-y-2 mb-6">
        <div>
          <span className="font-semibold">From:</span> {rideData.originCity}
        </div>
        <div>
          <span className="font-semibold">Date:</span> {new Date(rideData.travelDate).toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold">Arrival Time:</span> {rideData.arrivalTime}
        </div>
        <div>
          <span className="font-semibold">Mode:</span> {rideData.transportMode}
        </div>
        <div>
          <span className="font-semibold">Notes:</span> {rideData.additionalNotes || <span className="text-gray-400">None</span>}
        </div>
        {rideData.phoneVisible && rideData.phone && (
          <div className="bg-primary-50 rounded p-2 mt-2">
            <span className="font-semibold">Contact:</span> <span className="text-primary-700">{rideData.phone}</span>
          </div>
        )}
      </div>
      <hr className="my-6" />

      {rideData.participants && rideData.participants.length > 0 && (
        <div className="mb-4">
          <span className="font-semibold">Participants:</span>
          <ul className="list-disc ml-6 mt-2">
            {/*
              // Put creator first
              ...rideData.participants.filter(p => p._id === rideData.userId._id.toString()),
              ...rideData.participants.filter(p => p._id !== rideData.userId._id.toString())
            */}
            {rideData.participants.map((p, idx) => {
              const isCreator = p._id === rideData.userId._id.toString();
              return (
                <li key={p._id || idx} className="mb-1 flex items-center gap-2">
                  <span className="font-medium">
                    {p.name}
                    {isCreator && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-700">
                        Creator
                      </span>
                    )}
                  </span>
                  {isCreator && rideData.phoneVisible && rideData.phone && (
                    <span className="ml-2 text-primary-700">📱 {rideData.phone}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {!hasJoined && rideData.userId.toString() !== auth.user.id && (
        <button
          onClick={async () => {
            try {
              const res = await fetch(`${API_BASE_URL}/api/rides/${ride._id}/join`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${auth.token}`,
                },
              });

              const data = await res.json();
              if (res.ok) {
                alert(data.message || 'Joined successfully!');
                setHasJoined(true);
                setRideData(data); // Update ride data with new participants
              } else {
                alert(data.message || 'Failed to join ride');
              }
            } catch (err) {
              console.error('Error joining ride:', err);
            }
          }}
          className="btn-primary w-full py-2 mt-2"
        >
          Join Ride
        </button>
      )}

      {hasJoined && (
        <div className="mt-8">
          <ChatRoom rideId={rideData._id} />
        </div>
      )}
    </div>
  );
}
