import React, { useState, useEffect } from "react";
import "./LocationSelector.css";

function LocationSelector() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [error, setError] = useState("");

  // Load countries on first render
  useEffect(() => {
    fetch("https://crio-location-selector.onrender.com/countries")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch countries");
        return res.json();
      })
      .then((data) => {
        setCountries(data);
        setError("");
      })
      .catch(() => {
        setError("Failed to load countries. Please try again later.");
      });
  }, []);

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setSelectedCity("");
    setStates([]);
    setCities([]);

    fetch(`https://crio-location-selector.onrender.com/country=${country}/states`)
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error("State fetch error:", err));
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity("");
    setCities([]);

    fetch(
      `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${state}/cities`
    )
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("City fetch error:", err));
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div className="location-selector">
      <h1>Location Selector</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="dropdown-group">
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className="dropdown"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          value={selectedState}
          onChange={handleStateChange}
          disabled={!selectedCountry}
          className="dropdown"
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!selectedState}
          className="dropdown"
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {selectedCountry && selectedState && selectedCity && (
        <p>
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </p>
      )}
    </div>
  );
}

export default LocationSelector;
