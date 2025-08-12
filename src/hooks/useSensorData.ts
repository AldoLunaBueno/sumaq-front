import { useState, useEffect, useCallback } from "react";

const API_URL = "https://api.tarpuqkuna.lat"

export interface SensorReading {
  id: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  ph: number;
  npk: number;
  soilHumidity: number;
  sunlight: number;
}

export function useSensorData() {
  const apiUrl = API_URL;
  const zeroData = {
    temperature: 0,
    humidity: 0,
    ph: 0,
    npk: 0,
    soilHumidity: 0,
    sunlight: 0
  };

  const [currentData, setCurrentData] = useState<Omit<SensorReading, 'id' | 'timestamp'>>(zeroData);
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    setCurrentData(zeroData);

    const newReading: SensorReading = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...zeroData
    };

    setHistory(prev => [newReading, ...prev].slice(0, 50));
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`${apiUrl.replace(/^http/, "ws")}/ws`);

    ws.onmessage = (event) => {
      try {
        const realData = JSON.parse(event.data);

        setCurrentData({
          temperature: realData.temperature ?? 0,
          humidity: realData.humidity ?? 0,
          ph: 0,
          npk: 0,
          soilHumidity: realData.soilMoisture ?? 0,
          sunlight: 0
        });

        const newReading: SensorReading = {
          id: Date.now().toString(),
          timestamp: new Date(realData.timestamp || Date.now()),
          temperature: realData.temperature ?? 0,
          humidity: realData.humidity ?? 0,
          ph: 0,
          npk: 0,
          soilHumidity: realData.soilMoisture ?? 0,
          sunlight: 0
        };

        setHistory(prev => [newReading, ...prev].slice(0, 50));
      } catch (err) {
        console.error("Error procesando datos WS:", err);
      }
    };

    return () => ws.close();
  }, [apiUrl]);

  // Cada 15 s, si no llega nada, seguimos enviando ceros
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentData(zeroData);
      const newReading: SensorReading = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...zeroData
      };
      setHistory(prev => [newReading, ...prev].slice(0, 50));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return {
    currentData,
    history,
    isRefreshing,
    refreshData
  };
}