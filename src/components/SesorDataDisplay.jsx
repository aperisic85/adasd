import React, { useState, useEffect } from "react";
import axios from "axios";
import SensorCard from "./SensorCard";
import "../styles/SensorDataDisplay.css";
import ErrorBoundary from "./ErrorBoundary";
const SensorDataDisplay = () => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const deviceEUIs = ["513F167B004A0024", "479196A500430032"]; 
  //const deviceEUIs = ["479196A500430032"]; 
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        setLoading(true);
        const responses = await Promise.all(
          deviceEUIs.map((eui) =>
           axios.get(`https://ina.plovput.hr/api/data/${eui}`)
            //axios.get(`http://localhost:3000/api/data/${eui}`)
          )
        );
        const data = responses.map((response) => response.data);
        setSensorData(data);
      } catch (err) {
        console.error("Error fetching sensor data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
  }, []); // Fetch data on component mount []
  // Add a dependency array to avoid infinite loop

  if (loading) return <p className="loading">Učitavam podatke...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="sensor-data-container">
      <h1>INA Platforme</h1>
      {sensorData.map((sensor, index) => (
        <ErrorBoundary key={index}>
        <SensorCard key={index} sensor={sensor} /></ErrorBoundary>
      ))}
    </div>
  );
};

export default SensorDataDisplay;
