import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

export default function PostRide() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    originCity: '',
    travelDate: '',
    arrivalTime: '',
    transportMode: 'Train',
    additionalNotes: '',
    phoneVisible: false,
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const transportModes = [
    { value: 'Train', emoji: '🚆', label: 'Train' },
    { value: 'Flight', emoji: '✈️', label: 'Flight' },
    { value: 'Bus', emoji: '🚌', label: 'Bus' },
    { value: 'Auto', emoji: '🛺', label: 'Auto' },
    { value: 'Cab', emoji: '🚗', label: 'Cab' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch('http://localhost:5000/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      
      if (res.ok && data._id) {
        setSuccess('Ride posted successfully!');
        setTimeout(() => {
          navigate('/browse');
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to post ride');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚗 Post a Ride</h1>
          <p className="text-gray-600">Share your travel plans and find travel companions</p>
        </div>

        {/* Form Card */}
        <div className="card">
          <div className="p-6">
            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                <span className="text-green-800">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <span className="text-red-600 mr-2">❌</span>
                <span className="text-red-800">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Origin City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 From City
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter departure city"
                  value={form.originCity}
                  onChange={e => setForm({...form, originCity: e.target.value})}
                  required
                />
              </div>

              {/* Travel Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Travel Date
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={form.travelDate}
                    onChange={e => setForm({...form, travelDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🕐 Arrival Time
                  </label>
                  <input
                    type="time"
                    className="input"
                    placeholder="e.g., 2:30 PM"
                    value={form.arrivalTime}
                    onChange={e => setForm({...form, arrivalTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Transport Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🚊 Transport Mode
                </label>
                <select
                  className="input"
                  value={form.transportMode}
                  onChange={e => setForm({...form, transportMode: e.target.value})}
                >
                  {transportModes.map(mode => (
                    <option key={mode.value} value={mode.value}>
                      {mode.emoji} {mode.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Additional Notes
                </label>
                <textarea
                  className="input min-h-[100px] resize-y"
                  placeholder="Any additional information about your ride..."
                  value={form.additionalNotes}
                  onChange={e => setForm({...form, additionalNotes: e.target.value})}
                  rows={4}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📱 Phone Number
                </label>
                <input
                  type="tel"
                  className="input"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  required={form.phoneVisible}
                />
              </div>

              {/* Phone Visibility */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="phoneVisible"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={form.phoneVisible}
                  onChange={e => setForm({...form, phoneVisible: e.target.checked})}
                />
                <label htmlFor="phoneVisible" className="ml-2 block text-sm text-gray-700">
                  📱 Make my phone number visible to other users
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="btn-primary w-full py-3 text-base font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Spinner size="sm" className="mr-2" />
                      Posting Ride...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      🚀 Post Ride
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 Tip: Be specific about your departure time and location for better matches
          </p>
        </div>
      </div>
    </div>
  );
}
