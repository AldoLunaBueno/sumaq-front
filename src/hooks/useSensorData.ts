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

export function useSensorData(apiUrl: string) {
  const [currentData, setCurrentData] = useState<Omit<SensorReading, 'id' | 'timestamp'>>({
    temperature: 22.5,
    humidity: 65,
    ph: 6.5,
    npk: 180,
    soilHumidity: 45,
    sunlight: 75
  });
  
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generador de datos fake
  const generateRandomData = useCallback(() => {
    const temperature = Math.round((Math.random() * 10 + 18) * 10) / 10;
    const humidity = Math.round(Math.random() * 40 + 40);
    const ph = Math.round((Math.random() * 2 + 5.5) * 10) / 10;
    const npk = Math.round(Math.random() * 100 + 150);
    const soilHumidity = Math.round(Math.random() * 50 + 25);
    const sunlight = Math.round(Math.random() * 40 + 40);

    return { temperature, humidity, ph, npk, soilHumidity, sunlight };
  }, []);

  // Refrescar datos fake manualmente
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    
    const newData = generateRandomData();
    setCurrentData(newData);
    
    // Add to history
    const newReading: SensorReading = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...newData
    };
    
    setHistory(prev => [newReading, ...prev].slice(0, 50)); // Keep last 50 readings
    setIsRefreshing(false);
  }, [generateRandomData]);

  // WebSocket para datos reales
  useEffect(() => {
    const ws = new WebSocket(`${apiUrl.replace(/^http/, "ws")}/ws`);

    ws.onmessage = (event) => {
      try {
        const realData = JSON.parse(event.data);

        setCurrentData(prev => ({
          ...prev,
          // Sobrescribir solo campos que llegan del sensor real
          temperature: realData.temperature ?? prev.temperature,
          humidity: realData.humidity ?? prev.humidity,
          soilHumidity: realData.soilMoisture ?? prev.soilHumidity
        }));

        // Guardar en historial
        const newReading: SensorReading = {
          id: Date.now().toString(),
          timestamp: new Date(realData.timestamp || Date.now()),
          temperature: realData.temperature ?? currentData.temperature,
          humidity: realData.humidity ?? currentData.humidity,
          ph: currentData.ph,
          npk: currentData.npk,
          soilHumidity: realData.soilMoisture ?? currentData.soilHumidity,
          sunlight: currentData.sunlight
        };

        setHistory(prev => [newReading, ...prev].slice(0, 50));

      } catch (err) {
        console.error("Error procesando datos WS:", err);
      }
    };

    return () => ws.close();
  }, [apiUrl, currentData]);

  // Auto-refresh de datos fake cada 15s
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateRandomData();
      setCurrentData(newData);
      const newReading: SensorReading = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...newData
      };
      setHistory(prev => [newReading, ...prev].slice(0, 50));
    }, 15000);

    return () => clearInterval(interval);
  }, [generateRandomData]);

  // Inicializar con historial fake
  useEffect(() => {
    const initialHistory: SensorReading[] = [];
    const now = new Date();
    for (let i = 0; i < 10; i++) {
      const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000);
      const data = generateRandomData();
      initialHistory.push({
        id: `initial-${i}`,
        timestamp,
        ...data
      });
    }
    setHistory(initialHistory.reverse());
  }, [generateRandomData]);

  return {
    currentData,
    history,
    isRefreshing,
    refreshData
  };
}
