"use client";

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useWifiScanner } from '@/hooks/useWifiScanner';
import { WifiScanner as Scanner } from '@/lib/scanner';

interface WifiScannerProps {
  onScanUpdate: (count: number) => void;
}

export function WifiScanner({ onScanUpdate }: WifiScannerProps) {
  const { networks, isScanning, startScan, stopScan, refreshScan, scanCount } = useWifiScanner();

  // Update parent component with scan count
  useEffect(() => {
    onScanUpdate(scanCount);
  }, [scanCount, onScanUpdate]);

  // Auto-start scanning on component mount
  useEffect(() => {
    if (!isScanning) {
      startScan();
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* Control Panel */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-400">WiFi Network Scanner</CardTitle>
            <Badge variant={isScanning ? "default" : "secondary"} className={isScanning ? "bg-green-600" : ""}>
              {isScanning ? 'Scanning...' : 'Stopped'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={isScanning ? stopScan : startScan}
              variant={isScanning ? "destructive" : "default"}
              className={isScanning ? "" : "bg-green-600 hover:bg-green-700"}
            >
              {isScanning ? 'Stop Scan' : 'Start Scan'}
            </Button>
            <Button onClick={refreshScan} variant="outline" disabled={!isScanning}>
              Refresh
            </Button>
          </div>
          
          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Scanning networks...</span>
                <span className="text-green-400">{networks.length} found</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Network Results */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Detected Networks ({networks.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {networks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {isScanning ? 'Scanning for networks...' : 'No networks detected. Start scanning to find networks.'}
            </div>
          ) : (
            networks.map((network) => (
              <Card key={`${network.bssid}-${network.lastSeen.getTime()}`} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Network Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white text-lg">
                            {network.ssid}
                          </h3>
                          {network.isConnected && (
                            <Badge className="bg-blue-600">Connected</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 font-mono">{network.bssid}</p>
                      </div>
                      
                      {/* Signal Strength */}
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${Scanner.getSignalColor(network.rssi)}`}>
                          {network.rssi} dBm
                        </div>
                        <div className={`text-xs ${Scanner.getSignalColor(network.rssi)}`}>
                          {Scanner.getSignalStrength(network.rssi)}
                        </div>
                      </div>
                    </div>

                    {/* Signal Strength Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Signal Strength</span>
                        <span>{Math.round(((network.rssi + 90) / 60) * 100)}%</span>
                      </div>
                      <Progress 
                        value={Math.max(0, Math.min(100, ((network.rssi + 90) / 60) * 100))}
                        className="h-2"
                      />
                    </div>

                    {/* Network Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Security:</span>
                        <span className={`ml-2 font-medium ${Scanner.getSecurityColor(network.security)}`}>
                          {network.security}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Vendor:</span>
                        <span className="ml-2 text-white">{network.vendor}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Channel:</span>
                        <span className="ml-2 text-white">{network.channel}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Frequency:</span>
                        <span className="ml-2 text-white">{network.frequency} MHz</span>
                      </div>
                    </div>

                    {/* Last Seen */}
                    <div className="text-xs text-gray-500">
                      Last seen: {network.lastSeen.toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Scan Statistics */}
      {networks.length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Scan Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {networks.filter(n => n.security === 'Open').length}
                </div>
                <div className="text-gray-400">Open Networks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {networks.filter(n => n.security === 'WPA3').length}
                </div>
                <div className="text-gray-400">WPA3 Secured</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {networks.filter(n => n.frequency > 5000).length}
                </div>
                <div className="text-gray-400">5GHz Networks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {networks.filter(n => n.rssi >= -50).length}
                </div>
                <div className="text-gray-400">Strong Signals</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}