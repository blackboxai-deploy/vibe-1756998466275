"use client";

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadarView } from '@/components/RadarView';
import { useHumanDetector } from '@/hooks/useHumanDetector';
import { HumanDetector as Detector } from '@/lib/detection';

interface HumanDetectorProps {
  onDetectionUpdate: (count: number) => void;
}

export function HumanDetector({ onDetectionUpdate }: HumanDetectorProps) {
  const { 
    detections, 
    isDetecting, 
    startDetection, 
    stopDetection, 
    refreshDetection, 
    detectionCount,
    activeDetections 
  } = useHumanDetector();

  // Update parent component with detection count
  useEffect(() => {
    onDetectionUpdate(detectionCount);
  }, [detectionCount, onDetectionUpdate]);

  // Auto-start detection on component mount
  useEffect(() => {
    if (!isDetecting) {
      startDetection();
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* Control Panel */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-400">Human Detection System</CardTitle>
            <Badge variant={isDetecting ? "default" : "secondary"} className={isDetecting ? "bg-blue-600" : ""}>
              {isDetecting ? 'Detecting...' : 'Stopped'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={isDetecting ? stopDetection : startDetection}
              variant={isDetecting ? "destructive" : "default"}
              className={isDetecting ? "" : "bg-blue-600 hover:bg-blue-700"}
            >
              {isDetecting ? 'Stop Detection' : 'Start Detection'}
            </Button>
            <Button onClick={refreshDetection} variant="outline" disabled={!isDetecting}>
              Refresh
            </Button>
          </div>
          
          {isDetecting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Scanning for humans...</span>
                <span className="text-blue-400">{activeDetections.length} active</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Radar Display */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Radar View</CardTitle>
        </CardHeader>
        <CardContent>
          <RadarView 
            detections={detections} 
            isActive={isDetecting} 
            maxRange={20} 
          />
        </CardContent>
      </Card>

      {/* Active Detections */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Active Detections ({activeDetections.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeDetections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {isDetecting ? 'Scanning for humans...' : 'No active detections. Start detection to scan for humans.'}
            </div>
          ) : (
            activeDetections.map((detection) => (
              <Card key={detection.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Detection Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white text-lg">
                            Human Detected
                          </h3>
                          <Badge className={`${getMovementColor(detection.movement)}`}>
                            {detection.movement}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">ID: {detection.id.split('_')[0]}</p>
                      </div>
                      
                      {/* Confidence Level */}
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${Detector.getConfidenceColor(detection.confidence)}`}>
                          {Math.round(detection.confidence * 100)}%
                        </div>
                        <div className={`text-xs ${Detector.getConfidenceColor(detection.confidence)}`}>
                          Confidence
                        </div>
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Detection Confidence</span>
                        <span>{Math.round(detection.confidence * 100)}%</span>
                      </div>
                      <Progress 
                        value={detection.confidence * 100}
                        className="h-2"
                      />
                    </div>

                    {/* Detection Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Distance:</span>
                        <span className="ml-2 text-white font-medium">
                          {detection.distance.toFixed(1)}m
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Signal:</span>
                        <span className="ml-2 text-white">
                          {detection.signalStrength.toFixed(0)} dBm
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Position:</span>
                        <span className="ml-2 text-white">
                          ({detection.x.toFixed(2)}, {detection.y.toFixed(2)})
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Movement:</span>
                        <span className={`ml-2 font-medium ${Detector.getMovementColor(detection.movement)}`}>
                          {detection.movement}
                        </span>
                      </div>
                    </div>

                    {/* Last Seen */}
                    <div className="text-xs text-gray-500">
                      Last detected: {detection.lastSeen.toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Detection History */}
      {detections.length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Detection History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {detections
                .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
                .map((detection) => (
                  <div 
                    key={detection.id} 
                    className="flex items-center justify-between p-2 bg-gray-800 rounded text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getMovementDot(detection.movement)}`}></div>
                      <span className="text-gray-400">{detection.lastSeen.toLocaleTimeString()}</span>
                      <span className="text-white">{detection.distance.toFixed(1)}m</span>
                      <Badge variant="outline" className={`text-xs ${getMovementColor(detection.movement)} border-current`}>
                        {detection.movement}
                      </Badge>
                    </div>
                    <div className={`font-medium ${Detector.getConfidenceColor(detection.confidence)}`}>
                      {Math.round(detection.confidence * 100)}%
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detection Statistics */}
      {detections.length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Detection Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {detections.filter(d => d.movement === 'Stationary').length}
                </div>
                <div className="text-gray-400">Stationary</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {detections.filter(d => d.movement === 'Moving').length}
                </div>
                <div className="text-gray-400">Moving</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {detections.filter(d => d.movement === 'Fast Moving').length}
                </div>
                <div className="text-gray-400">Fast Moving</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {detections.filter(d => d.confidence > 0.8).length}
                </div>
                <div className="text-gray-400">High Confidence</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getMovementColor(movement: string): string {
  switch (movement) {
    case 'Stationary': return 'bg-blue-600';
    case 'Moving': return 'bg-yellow-600';
    case 'Fast Moving': return 'bg-red-600';
    default: return 'bg-gray-600';
  }
}

function getMovementDot(movement: string): string {
  switch (movement) {
    case 'Stationary': return 'bg-blue-500';
    case 'Moving': return 'bg-yellow-500';
    case 'Fast Moving': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}