import React, { useState, useEffect } from "react";

const Navbar = ({ onSelectLocation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [firebaseUID, setFirebaseUID] = useState(null);

  useEffect(() => {
    const storedUID = localStorage.getItem("firebaseUID");
    if (storedUID) {
      setFirebaseUID(storedUID);
    }
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf6248976fd365a133423bab235324a680ada8&text=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (data?.features?.length > 0) {
        setResults(data.features.slice(0, 3));
      } else {
        setResults([]);
        alert("No results found.");
      }
    } catch (error) {
      console.error("Error fetching geocode data:", error);
    }
  };

  const handleLocationSelect = async (feature) => {
    const coords = feature?.geometry?.coordinates;
    const props = feature?.properties;

    if (!Array.isArray(coords) || coords.length < 2 || !props) return;

    if (firebaseUID) {
      try {
        const response = await fetch("http://localhost:3000/api/location/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebaseUID,
            lat: coords[1],
            long: coords[0],
            active: true,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          console.error("Failed to save location:", data.message);
        }
      } catch (error) {
        console.error("Error sending location to backend:", error);
      }
    }

    onSelectLocation({
      lat: coords[1],
      lng: coords[0],
      name: props.name || props.label || "Unknown",
    });
  };

  return (
    <div className="w-full max-w-xs h-screen bg-gradient-to-b from-purple-700 via-purple-600 to-purple-500 p-6 shadow-xl rounded-r-3xl border-r-4 border-purple-300">
      {/* Title */}
      <h1 className="text-white text-2xl font-bold mb-6 text-center tracking-wide">
        Search Location
      </h1>

      {/* Input */}
      <input
        type="text"
        className="w-full p-3 rounded-lg mb-4 border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-white bg-white text-purple-700 placeholder-purple-400 font-medium"
        placeholder="Enter a place..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="w-full bg-white text-purple-700 font-semibold py-2 rounded-lg hover:bg-purple-100 border-2 border-purple-300 transition duration-300"
      >
        🔍 Search
      </button>

      {/* Results */}
      <ul className="mt-6 space-y-3 overflow-y-auto max-h-[65%] pr-1 custom-scrollbar">
        {results.map((feature, index) => {
          const coords = feature?.geometry?.coordinates;
          const props = feature?.properties;

          if (!Array.isArray(coords) || coords.length < 2 || !props) return null;

          return (
            <li
              key={index}
              className="p-3 rounded-lg bg-white text-purple-800 font-medium border-2 border-purple-300 hover:bg-purple-100 cursor-pointer shadow-sm transition-all duration-200"
              onClick={() => handleLocationSelect(feature)}
            >
              <div className="font-semibold">{props.name || "Unnamed"}</div>
              <div className="text-sm text-purple-600">
                {props.region || "Unknown"}, {props.country || "Unknown"}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Navbar;
