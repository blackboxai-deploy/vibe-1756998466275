import { useState, useEffect, useRef } from 'react';
import { HumanDetector, HumanDetection, DetectionSettings } from '@/lib/detection';

interface UseHumanDetectorReturn {
  detections: HumanDetection[];
  isDetecting: boolean;
  startDetection: () => void;
  stopDetection: () => void;
  refreshDetection: () => void;
  updateSettings: (settings: Partial<DetectionSettings>) => void;
  detectionCount: number;
  activeDetections: HumanDetection[];
}

export function useHumanDetector(initialSettings?: Partial<DetectionSettings>): UseHumanDetectorReturn {
  const [detections, setDetections] = useState<HumanDetection[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);
  const detectorRef = useRef<HumanDetector | null>(null);

  // Initialize detector
  useEffect(() => {
    const defaultSettings = {
      sensitivity: 0.7,
      maxRange: 20,
      motionThreshold: 0.5,
      updateInterval: 1000,
      enableSound: false,
      enableVibration: false
    };
    
    const settings = initialSettings ? { ...defaultSettings, ...initialSettings } : defaultSettings;
    detectorRef.current = new HumanDetector(settings);
    
    return () => {
      if (detectorRef.current) {
        detectorRef.current.stopDetection();
      }
    };
  }, [initialSettings]);

  const startDetection = () => {
    if (!detectorRef.current || isDetecting) return;
    
    setIsDetecting(true);
    detectorRef.current.startDetection((updatedDetections) => {
      setDetections(updatedDetections);
      setDetectionCount(updatedDetections.length);
    });
  };

  const stopDetection = () => {
    if (!detectorRef.current || !isDetecting) return;
    
    detectorRef.current.stopDetection();
    setIsDetecting(false);
  };

  const refreshDetection = () => {
    if (detectorRef.current) {
      stopDetection();
      // Small delay to ensure stop is processed
      setTimeout(() => {
        startDetection();
      }, 100);
    }
  };

  const updateSettings = (newSettings: Partial<DetectionSettings>) => {
    if (detectorRef.current) {
      detectorRef.current.updateSettings(newSettings);
    }
  };

  // Filter for active detections (high confidence and recent)
  const activeDetections = detections.filter(detection => 
    detection.confidence > 0.5 && 
    Date.now() - detection.lastSeen.getTime() < 5000
  );

  return {
    detections,
    isDetecting,
    startDetection,
    stopDetection,
    refreshDetection,
    updateSettings,
    detectionCount,
    activeDetections
  };
}