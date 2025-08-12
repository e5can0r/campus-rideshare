import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="bg-white bg-opacity-80 rounded-xl shadow-2xl p-10 max-w-xl text-center">
        <h1 className="text-4xl font-bold text-primary-700 mb-4">Welcome to CampusRide!</h1>
        <p className="text-lg text-gray-700 mb-6">
          <span className="font-semibold text-primary-600">CampusRide</span> is a platform for LNMIIT students to easily share rides when coming to college from their city by train, bus, or flight.<br /><br />
          <span className="text-primary-700 font-medium">Save money, make friends, and travel together!</span>
        </p>
        <div className="flex flex-col gap-4">
          <Link to="/browse" className="btn-primary py-3 text-lg rounded-lg shadow">
            🚗 Browse Rides
          </Link>
          <Link to="/post" className="btn-secondary py-3 text-lg rounded-lg shadow">
            ✏️ Offer a Ride
          </Link>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <span>Made for LNMIITians, by LNMIITians.</span>
        </div>
      </div>
    </div>
  );
}