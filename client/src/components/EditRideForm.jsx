import { useState } from 'react';

export default function EditRideForm({ ride, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    ...ride,
    showPhone: ride.showPhone ?? false,
    phone: ride.phone ?? '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 space-y-4"
      style={{ maxWidth: 500 }}
    >
      <h2 className="text-xl font-bold mb-4">Edit Ride</h2>
      <div>
        <label className="block font-medium mb-1">Origin City</label>
        <input
          className="input input-bordered w-full"
          name="originCity"
          value={formData.originCity}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Travel Date</label>
        <input
          className="input input-bordered w-full"
          type="date"
          name="travelDate"
          value={formData.travelDate?.slice(0, 10)}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Arrival Time</label>
        <input
          className="input input-bordered w-full"
          type="time"
          name="arrivalTime"
          value={formData.arrivalTime}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Transport Mode</label>
        <select
          className="input input-bordered w-full"
          name="transportMode"
          value={formData.transportMode}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="Train">Train</option>
          <option value="Flight">Flight</option>
          <option value="Bus">Bus</option>
          <option value="Auto">Auto</option>
          <option value="Cab">Cab</option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Additional Notes</label>
        <textarea
          className="input input-bordered w-full"
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleChange}
          rows={2}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Phone Number</label>
        <input
          className="input input-bordered w-full"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="phoneVisible"
          checked={formData.phoneVisible}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="phoneVisible" className="text-sm">
          Show my phone number to ride participants
        </label>
      </div>
      <div className="flex gap-2 pt-4">
        <button type="submit" className="btn-primary flex-1">
          💾 Save
        </button>
        <button type="button" className="btn-secondary flex-1" onClick={onCancel}>
          ❌ Cancel
        </button>
      </div>
    </form>
  );
}
