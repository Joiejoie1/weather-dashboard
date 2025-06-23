import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setError(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`
      );
      const data = await res.json();
      if (data.cod !== 200) {
        throw new Error(data.message);
      }
      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-gray-800 px-4">
      <h1 className="text-4xl font-bold mb-6">Weather Dashboard 🌦️</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="w-full border p-2 rounded mb-4"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {weather && (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold">{weather.name}</h2>
            <p className="text-lg">{weather.weather[0].main}</p>
            <p className="text-4xl font-bold">
              {Math.round(weather.main.temp - 273.15)}°C
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
