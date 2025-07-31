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

  const generateRandomData = useCallback(() => {
    const temperature = Math.round((Math.random() * 10 + 18) * 10) / 10; // 18-28°C
    const humidity = Math.round(Math.random() * 40 + 40); // 40-80%
    const ph = Math.round((Math.random() * 2 + 5.5) * 10) / 10; // 5.5-7.5 pH
    const npk = Math.round(Math.random() * 100 + 150); // 150-250 ppm
    const soilHumidity = Math.round(Math.random() * 50 + 25); // 25-75%
    const sunlight = Math.round(Math.random() * 40 + 40); // 40-80%

    return { temperature, humidity, ph, npk, soilHumidity, sunlight };
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
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

  // Auto-refresh every 5 seconds
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
    }, 5000);

    return () => clearInterval(interval);
  }, [generateRandomData]);

  // Initialize with some sample data
  useEffect(() => {
    const initialHistory: SensorReading[] = [];
    const now = new Date();
    
    for (let i = 0; i < 10; i++) {
      const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000); // Every 5 minutes
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