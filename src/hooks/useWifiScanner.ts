import { useState, useEffect, useRef } from 'react';
import { WifiScanner, WifiNetwork, ScanSettings } from '@/lib/scanner';

interface UseWifiScannerReturn {
  networks: WifiNetwork[];
  isScanning: boolean;
  startScan: () => void;
  stopScan: () => void;
  refreshScan: () => void;
  updateSettings: (settings: Partial<ScanSettings>) => void;
  scanCount: number;
}

export function useWifiScanner(initialSettings?: Partial<ScanSettings>): UseWifiScannerReturn {
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const scannerRef = useRef<WifiScanner | null>(null);

  // Initialize scanner
  useEffect(() => {
    const defaultSettings = {
      interval: 3000,
      maxResults: 50,
      showHidden: false,
      minSignalStrength: -90
    };
    
    const settings = initialSettings ? { ...defaultSettings, ...initialSettings } : defaultSettings;
    scannerRef.current = new WifiScanner(settings);
    
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stopScan();
      }
    };
  }, [initialSettings]);

  const startScan = () => {
    if (!scannerRef.current || isScanning) return;
    
    setIsScanning(true);
    scannerRef.current.startScan((updatedNetworks) => {
      setNetworks(updatedNetworks);
      setScanCount(updatedNetworks.length);
    });
  };

  const stopScan = () => {
    if (!scannerRef.current || !isScanning) return;
    
    scannerRef.current.stopScan();
    setIsScanning(false);
  };

  const refreshScan = () => {
    if (scannerRef.current) {
      stopScan();
      // Small delay to ensure stop is processed
      setTimeout(() => {
        startScan();
      }, 100);
    }
  };

  const updateSettings = (newSettings: Partial<ScanSettings>) => {
    if (scannerRef.current) {
      scannerRef.current.updateSettings(newSettings);
    }
  };

  return {
    networks,
    isScanning,
    startScan,
    stopScan,
    refreshScan,
    updateSettings,
    scanCount
  };
}