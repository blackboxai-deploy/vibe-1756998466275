// WiFi Network Scanner Utilities
export interface WifiNetwork {
  ssid: string;
  bssid: string;
  rssi: number;
  frequency: number;
  channel: number;
  security: 'Open' | 'WEP' | 'WPA' | 'WPA2' | 'WPA3';
  vendor: string;
  lastSeen: Date;
  isConnected: boolean;
}

export interface ScanSettings {
  interval: number;
  maxResults: number;
  showHidden: boolean;
  minSignalStrength: number;
}

// Simulated WiFi network data for realistic scanning
const MOCK_NETWORKS: Omit<WifiNetwork, 'lastSeen' | 'rssi'>[] = [
  {
    ssid: 'AndroidAP_8420',
    bssid: '02:00:00:00:01:00',
    frequency: 2437,
    channel: 6,
    security: 'WPA2',
    vendor: 'Samsung',
    isConnected: false
  },
  {
    ssid: 'NETGEAR_Guest',
    bssid: '44:94:fc:71:22:88',
    frequency: 5180,
    channel: 36,
    security: 'Open',
    vendor: 'Netgear',
    isConnected: false
  },
  {
    ssid: 'iPhone_Hotspot',
    bssid: '8c:85:90:9b:11:dd',
    frequency: 2462,
    channel: 11,
    security: 'WPA3',
    vendor: 'Apple',
    isConnected: false
  },
  {
    ssid: 'TP-Link_2.4G',
    bssid: 'e4:c1:46:8a:44:cc',
    frequency: 2412,
    channel: 1,
    security: 'WPA2',
    vendor: 'TP-Link',
    isConnected: true
  },
  {
    ssid: 'Starbucks WiFi',
    bssid: '00:24:6c:ff:aa:11',
    frequency: 5240,
    channel: 48,
    security: 'Open',
    vendor: 'Cisco',
    isConnected: false
  },
  {
    ssid: 'ASUS_5G_Pro',
    bssid: '04:d9:f5:12:88:99',
    frequency: 5745,
    channel: 149,
    security: 'WPA3',
    vendor: 'ASUS',
    isConnected: false
  }
];

export class WifiScanner {
  private isScanning = false;
  private scanInterval: ReturnType<typeof setInterval> | null = null;
  private networks: WifiNetwork[] = [];
  private settings: ScanSettings;

  constructor(settings: ScanSettings = {
    interval: 3000,
    maxResults: 50,
    showHidden: false,
    minSignalStrength: -90
  }) {
    this.settings = settings;
  }

  // Start scanning for WiFi networks
  startScan(onUpdate: (networks: WifiNetwork[]) => void): void {
    if (this.isScanning) return;
    
    this.isScanning = true;
    
    // Initial scan
    this.performScan();
    onUpdate(this.networks);

    // Set up interval scanning
    this.scanInterval = setInterval(() => {
      this.performScan();
      onUpdate(this.networks);
    }, this.settings.interval);
  }

  // Stop scanning
  stopScan(): void {
    this.isScanning = false;
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
  }

  // Perform a single scan
  private performScan(): void {
    // Simulate realistic scanning behavior
    const availableNetworks = [...MOCK_NETWORKS];
    
    // Randomly show/hide networks to simulate real-world behavior
    const visibleNetworks = availableNetworks.filter(() => Math.random() > 0.1);
    
    this.networks = visibleNetworks.map(network => ({
      ...network,
      rssi: this.generateRealisticRSSI(network.frequency),
      lastSeen: new Date()
    })).filter(network => network.rssi >= this.settings.minSignalStrength)
      .sort((a, b) => b.rssi - a.rssi)
      .slice(0, this.settings.maxResults);
  }

  // Generate realistic RSSI values based on frequency and other factors
  private generateRealisticRSSI(frequency: number): number {
    // Base signal strength varies by frequency band
    let baseRSSI = frequency > 5000 ? -65 : -55; // 5GHz typically weaker
    
    // Add realistic variation (-20 to +10 dBm)
    const variation = (Math.random() * 30) - 20;
    
    // Ensure realistic range (-30 to -90 dBm)
    return Math.max(-90, Math.min(-30, baseRSSI + variation));
  }

  // Get signal strength category
  static getSignalStrength(rssi: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
    if (rssi >= -50) return 'Excellent';
    if (rssi >= -60) return 'Good';
    if (rssi >= -70) return 'Fair';
    return 'Poor';
  }

  // Get signal color for UI
  static getSignalColor(rssi: number): string {
    if (rssi >= -50) return 'text-green-400';
    if (rssi >= -60) return 'text-yellow-400';
    if (rssi >= -70) return 'text-orange-400';
    return 'text-red-400';
  }

  // Get security color
  static getSecurityColor(security: string): string {
    switch (security) {
      case 'Open': return 'text-red-400';
      case 'WEP': return 'text-orange-400';
      case 'WPA': return 'text-yellow-400';
      case 'WPA2': return 'text-green-400';
      case 'WPA3': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  }

  // Update settings
  updateSettings(newSettings: Partial<ScanSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Get current networks
  getNetworks(): WifiNetwork[] {
    return this.networks;
  }

  // Get scanning status
  isActive(): boolean {
    return this.isScanning;
  }
}