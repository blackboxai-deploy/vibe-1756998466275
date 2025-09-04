"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WifiScanner } from '@/components/WifiScanner';
import { HumanDetector } from '@/components/HumanDetector';
import { ScannerSettings } from '@/components/ScannerSettings';

export default function AndroidWifiSniffer() {
  const [activeTab, setActiveTab] = useState('wifi');
  const [scanCount, setScanCount] = useState(0);
  const [detectionCount, setDetectionCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-green-400">WiFi Sniffer Pro</h1>
            <p className="text-gray-400">Android Network & Human Detection Tool</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-green-500 text-green-400">
              {scanCount} Networks
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              {detectionCount} Humans
            </Badge>
          </div>
        </div>

        {/* Status Indicators */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Scanner Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Detection Ready</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-gray-800">
          <TabsTrigger 
            value="wifi" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            WiFi Scanner
          </TabsTrigger>
          <TabsTrigger 
            value="human" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Human Detector
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="wifi" className="space-y-4">
            <WifiScanner onScanUpdate={setScanCount} />
          </TabsContent>

          <TabsContent value="human" className="space-y-4">
            <HumanDetector onDetectionUpdate={setDetectionCount} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <ScannerSettings />
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer Status */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Android WiFi Sniffer Pro v1.0 • Real-time Network & Human Detection
        </p>
      </div>
    </div>
  );
}