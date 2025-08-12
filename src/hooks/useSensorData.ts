import { useState, useEffect, useCallback } from "react";

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
  const apiUrl = "https://api.tarpuqkuna.lat";
  
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

  const refreshData = useCallback(async () => {
    try {
      setIsRefreshing(true);

      const res = await fetch(`${apiUrl}/latest`);
      if (!res.ok) throw new Error(`Error ${res.status}`);

      const realData = await res.json();

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
      console.error("Error obteniendo datos:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [apiUrl]);

  // Llamar a refreshData cada 5 segundos
  useEffect(() => {
    refreshData(); // primera carga
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    currentData,
    history,
    isRefreshing,
    refreshData
  };
}
