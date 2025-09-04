"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function ScannerSettings() {
  // WiFi Scanner Settings
  const [wifiSettings, setWifiSettings] = useState({
    interval: 3000,
    maxResults: 50,
    showHidden: false,
    minSignalStrength: -90
  });

  // Human Detection Settings
  const [detectionSettings, setDetectionSettings] = useState({
    sensitivity: 0.7,
    maxRange: 20,
    motionThreshold: 0.5,
    updateInterval: 1000,
    enableSound: false,
    enableVibration: false
  });

  // App Settings
  const [appSettings, setAppSettings] = useState({
    theme: 'dark',
    autoStart: true,
    dataRetention: 24, // hours
    exportFormat: 'json'
  });

  const handleWifiSettingChange = (key: string, value: any) => {
    setWifiSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDetectionSettingChange = (key: string, value: any) => {
    setDetectionSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAppSettingChange = (key: string, value: any) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
  };

  const exportSettings = () => {
    const settings = {
      wifi: wifiSettings,
      detection: detectionSettings,
      app: appSettings,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wifi-sniffer-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetToDefaults = () => {
    setWifiSettings({
      interval: 3000,
      maxResults: 50,
      showHidden: false,
      minSignalStrength: -90
    });
    
    setDetectionSettings({
      sensitivity: 0.7,
      maxRange: 20,
      motionThreshold: 0.5,
      updateInterval: 1000,
      enableSound: false,
      enableVibration: false
    });
    
    setAppSettings({
      theme: 'dark',
      autoStart: true,
      dataRetention: 24,
      exportFormat: 'json'
    });
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-purple-400">Scanner Settings</CardTitle>
            <div className="flex gap-2">
              <Button onClick={exportSettings} variant="outline" size="sm">
                Export Settings
              </Button>
              <Button onClick={resetToDefaults} variant="outline" size="sm">
                Reset Defaults
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* WiFi Scanner Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            WiFi Scanner Configuration
            <Badge variant="outline" className="border-green-500 text-green-400">
              Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scan Interval */}
          <div className="space-y-2">
            <Label htmlFor="scan-interval" className="text-white">
              Scan Interval: {wifiSettings.interval}ms
            </Label>
            <Slider
              id="scan-interval"
              value={[wifiSettings.interval]}
              onValueChange={(value) => handleWifiSettingChange('interval', value[0])}
              min={1000}
              max={10000}
              step={500}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Fast (1s)</span>
              <span>Slow (10s)</span>
            </div>
          </div>

          {/* Max Results */}
          <div className="space-y-2">
            <Label htmlFor="max-results" className="text-white">
              Maximum Results
            </Label>
            <Input
              id="max-results"
              type="number"
              value={wifiSettings.maxResults}
              onChange={(e) => handleWifiSettingChange('maxResults', parseInt(e.target.value))}
              min="1"
              max="200"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Signal Strength Threshold */}
          <div className="space-y-2">
            <Label htmlFor="signal-threshold" className="text-white">
              Minimum Signal Strength: {wifiSettings.minSignalStrength} dBm
            </Label>
            <Slider
              id="signal-threshold"
              value={[wifiSettings.minSignalStrength]}
              onValueChange={(value) => handleWifiSettingChange('minSignalStrength', value[0])}
              min={-100}
              max={-30}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Weak (-100 dBm)</span>
              <span>Strong (-30 dBm)</span>
            </div>
          </div>

          {/* Show Hidden Networks */}
          <div className="flex items-center justify-between">
            <Label htmlFor="show-hidden" className="text-white">
              Show Hidden Networks
            </Label>
            <Switch
              id="show-hidden"
              checked={wifiSettings.showHidden}
              onCheckedChange={(checked) => handleWifiSettingChange('showHidden', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Human Detection Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            Human Detection Configuration
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Detection Sensitivity */}
          <div className="space-y-2">
            <Label htmlFor="sensitivity" className="text-white">
              Detection Sensitivity: {Math.round(detectionSettings.sensitivity * 100)}%
            </Label>
            <Slider
              id="sensitivity"
              value={[detectionSettings.sensitivity]}
              onValueChange={(value) => handleDetectionSettingChange('sensitivity', value[0])}
              min={0.1}
              max={1.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Low (10%)</span>
              <span>High (100%)</span>
            </div>
          </div>

          {/* Max Range */}
          <div className="space-y-2">
            <Label htmlFor="max-range" className="text-white">
              Maximum Detection Range
            </Label>
            <Input
              id="max-range"
              type="number"
              value={detectionSettings.maxRange}
              onChange={(e) => handleDetectionSettingChange('maxRange', parseInt(e.target.value))}
              min="1"
              max="100"
              className="bg-gray-800 border-gray-700 text-white"
            />
            <p className="text-xs text-gray-400">Range in meters (1-100m)</p>
          </div>

          {/* Motion Threshold */}
          <div className="space-y-2">
            <Label htmlFor="motion-threshold" className="text-white">
              Motion Threshold: {detectionSettings.motionThreshold.toFixed(1)}
            </Label>
            <Slider
              id="motion-threshold"
              value={[detectionSettings.motionThreshold]}
              onValueChange={(value) => handleDetectionSettingChange('motionThreshold', value[0])}
              min={0.1}
              max={2.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Sensitive (0.1)</span>
              <span>Less Sensitive (2.0)</span>
            </div>
          </div>

          {/* Update Interval */}
          <div className="space-y-2">
            <Label htmlFor="update-interval" className="text-white">
              Update Interval: {detectionSettings.updateInterval}ms
            </Label>
            <Slider
              id="update-interval"
              value={[detectionSettings.updateInterval]}
              onValueChange={(value) => handleDetectionSettingChange('updateInterval', value[0])}
              min={500}
              max={5000}
              step={250}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Real-time (500ms)</span>
              <span>Slower (5s)</span>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Alert Settings */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">Alert Settings</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-sound" className="text-white">
                Sound Alerts
              </Label>
              <Switch
                id="enable-sound"
                checked={detectionSettings.enableSound}
                onCheckedChange={(checked) => handleDetectionSettingChange('enableSound', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enable-vibration" className="text-white">
                Vibration Alerts
              </Label>
              <Switch
                id="enable-vibration"
                checked={detectionSettings.enableVibration}
                onCheckedChange={(checked) => handleDetectionSettingChange('enableVibration', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-purple-400">Application Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-white">
              Theme
            </Label>
            <Select
              value={appSettings.theme}
              onValueChange={(value) => handleAppSettingChange('theme', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="dark">Dark Mode</SelectItem>
                <SelectItem value="light">Light Mode</SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Auto Start */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-start" className="text-white">
                Auto-start Scanning
              </Label>
              <p className="text-xs text-gray-400">
                Automatically start WiFi and human detection when app loads
              </p>
            </div>
            <Switch
              id="auto-start"
              checked={appSettings.autoStart}
              onCheckedChange={(checked) => handleAppSettingChange('autoStart', checked)}
            />
          </div>

          {/* Data Retention */}
          <div className="space-y-2">
            <Label htmlFor="data-retention" className="text-white">
              Data Retention Period
            </Label>
            <Input
              id="data-retention"
              type="number"
              value={appSettings.dataRetention}
              onChange={(e) => handleAppSettingChange('dataRetention', parseInt(e.target.value))}
              min="1"
              max="168"
              className="bg-gray-800 border-gray-700 text-white"
            />
            <p className="text-xs text-gray-400">
              Hours to keep scan and detection history (1-168 hours)
            </p>
          </div>

          {/* Export Format */}
          <div className="space-y-2">
            <Label htmlFor="export-format" className="text-white">
              Export Format
            </Label>
            <Select
              value={appSettings.exportFormat}
              onValueChange={(value) => handleAppSettingChange('exportFormat', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select export format" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Settings Summary */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Current Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-green-400 font-medium">WiFi Scanner</div>
              <div className="text-gray-400">Interval: {wifiSettings.interval}ms</div>
              <div className="text-gray-400">Max Results: {wifiSettings.maxResults}</div>
              <div className="text-gray-400">Min Signal: {wifiSettings.minSignalStrength}dBm</div>
            </div>
            <div className="space-y-1">
              <div className="text-blue-400 font-medium">Human Detection</div>
              <div className="text-gray-400">Sensitivity: {Math.round(detectionSettings.sensitivity * 100)}%</div>
              <div className="text-gray-400">Range: {detectionSettings.maxRange}m</div>
              <div className="text-gray-400">Alerts: {detectionSettings.enableSound || detectionSettings.enableVibration ? 'Enabled' : 'Disabled'}</div>
            </div>
            <div className="space-y-1">
              <div className="text-purple-400 font-medium">Application</div>
              <div className="text-gray-400">Theme: {appSettings.theme}</div>
              <div className="text-gray-400">Auto-start: {appSettings.autoStart ? 'Yes' : 'No'}</div>
              <div className="text-gray-400">Data Retention: {appSettings.dataRetention}h</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}