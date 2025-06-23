import { useState, useEffect } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C");
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    const savedUnit = localStorage.getItem("unit");
    if (savedUnit === "C" || savedUnit === "F") {
      setUnit(savedUnit);
    }
  }, []);

  const handleSearch = async () => {
    setError(null);
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const getConvertedTemp = (kelvin) => {
    if (unit === "C") return Math.round(kelvin - 273.15);
    return Math.round((kelvin - 273.15) * 9 / 5 + 32);
  };

  const toggleUnit = () => {
    const nextUnit = unit === "C" ? "F" : "C";
    setUnit(nextUnit);
    localStorage.setItem("unit", nextUnit);
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

        {loading && (
          <div className="text-blue-500 mt-4 text-sm text-center">Loading...</div>
        )}

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {weather && !loading && (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold">{weather.name}</h2>
            <p className="text-lg">{weather.weather[0].main}</p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="mx-auto"
            />
            <p className="text-4xl font-bold">
              {getConvertedTemp(weather.main.temp)}°{unit}
            </p>
            <p className="text-sm text-gray-600">
              Feels like: {getConvertedTemp(weather.main.feels_like)}°{unit}
            </p>
            <button
              onClick={toggleUnit}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Show in °{unit === "C" ? "F" : "C"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
