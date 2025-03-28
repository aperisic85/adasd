import React, { useState, useEffect } from "react";
import axios from "axios";
import SensorCard from "./SensorCard";
import "../styles/SensorDataDisplay.css";
const SensorDataDisplay = () => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace these with your actual EUIs
  const deviceEUIs = ["513F167B004A0024", "479196A500430032"]; // Example EUI values

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        setLoading(true);
        const responses = await Promise.all(
          deviceEUIs.map((eui) =>
            axios.get(`http://localhost:3000/api/data/${eui}`)
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
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="sensor-data-container">
      <h1>Sensor Data</h1>
      {sensorData.map((sensor, index) => (
        <SensorCard key={index} sensor={sensor} />
      ))}
    </div>
  );
};

export default SensorDataDisplay;
