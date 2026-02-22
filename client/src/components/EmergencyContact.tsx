import React, { useState, useRef } from "react";

export default function LiveLocationTracker() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const watchIdRef = useRef(null);


const startTracking = () => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    try {
     await fetch("http://localhost:5000/send-sos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ lat, lng }),
});

      alert("🚨 SOS Sent Successfully!");
    } catch (error) {
      alert("Error sending SOS");
    }
  });
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">🚨 Safety Tracker</h1>

        <button
          onClick={startTracking}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold"
        >
          START SOS
        </button>

        {location && (
          <div className="mt-6">
            
            <p>Latitude: {location.lat}</p>
            <p>Longitude: {location.lng}</p>
          </div>
        )}

        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    </div>
  );
}