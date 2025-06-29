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

  useEffect(() => {
    fetch("https://crio-location-selector.onrender.com/countries")
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to fetch countries");
        const text = await response.text();
        return text ? JSON.parse(text) : [];
      })
      .then((data) => {
        setCountries(data);
        setError("");
      })
      .catch(() => {
        setError("Failed to load countries. Please try again later.");
        setCountries([]);
      });
  }, []);

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setSelectedCity("");
    setStates([]);
    setCities([]);
    setError("");

    fetch(`https://crio-location-selector.onrender.com/country=${country}/states`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to fetch states");
        const text = await response.text();
        return text ? JSON.parse(text) : [];
      })
      .then((data) => setStates(data))
      .catch(() => {
        setError("Failed to load states.");
        setStates([]);
      });
  };

  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    setSelectedCity("");
    setCities([]);
    setError("");

    fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${state}/cities`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to fetch cities");
        const text = await response.text();
        return text ? JSON.parse(text) : [];
      })
      .then((data) => setCities(data))
      .catch(() => {
        setError("Failed to load cities.");
        setCities([]);
      });
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div className="location-selector">
      <h1>Location Selector</h1>

      {error && <p className="error">{error}</p>}

      <div className="dropdown-row">
        <select value={selectedCountry} onChange={handleCountryChange}>
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
