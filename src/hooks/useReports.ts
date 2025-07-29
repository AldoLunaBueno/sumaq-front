import { useState, useCallback } from "react";

export interface CropReport {
  id: string;
  timestamp: Date;
  description: string;
  photos?: File[];
  photoUrls?: string[];
}

export function useReports() {
  const [reports, setReports] = useState<CropReport[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addReport = useCallback(async (description: string, photos?: File[]) => {
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newReport: CropReport = {
      id: Date.now().toString(),
      timestamp: new Date(),
      description,
      photos,
      photoUrls: photos?.map(photo => URL.createObjectURL(photo))
    };
    
    setReports(prev => [newReport, ...prev]);
    setIsSubmitting(false);
    
    return newReport;
  }, []);

  return {
    reports,
    isSubmitting,
    addReport
  };
}