// Human Detection Utilities
export interface HumanDetection {
  id: string;
  x: number; // Relative position (0-1)
  y: number; // Relative position (0-1)
  distance: number; // Estimated distance in meters
  confidence: number; // Detection confidence (0-1)
  movement: 'Stationary' | 'Moving' | 'Fast Moving';
  lastSeen: Date;
  signalStrength: number; // Signal strength affecting detection
}

export interface DetectionSettings {
  sensitivity: number; // 0-1 scale
  maxRange: number; // Maximum detection range in meters
  motionThreshold: number; // Motion sensitivity threshold
  updateInterval: number; // Update frequency in ms
  enableSound: boolean;
  enableVibration: boolean;
}

export interface MotionData {
  acceleration: { x: number; y: number; z: number };
  gyroscope: { x: number; y: number; z: number };
  orientation: { alpha: number; beta: number; gamma: number };
}

export class HumanDetector {
  private isDetecting = false;
  private detectionInterval: ReturnType<typeof setInterval> | null = null;
  private detections: HumanDetection[] = [];
  private settings: DetectionSettings;
  private motionData: MotionData | null = null;
  private lastMotionTime = Date.now();

  constructor(settings: DetectionSettings = {
    sensitivity: 0.7,
    maxRange: 20,
    motionThreshold: 0.5,
    updateInterval: 1000,
    enableSound: false,
    enableVibration: false
  }) {
    this.settings = settings;
    this.initializeMotionSensors();
  }

  // Initialize device motion sensors
  private initializeMotionSensors(): void {
    if (typeof window !== 'undefined') {
      // Request permission for device motion (iOS 13+)
      if ('DeviceMotionEvent' in window) {
        const requestPermission = (DeviceMotionEvent as any).requestPermission;
        if (typeof requestPermission === 'function') {
          requestPermission().then((response: string) => {
            if (response === 'granted') {
              this.setupMotionListeners();
            }
          }).catch(console.error);
        } else {
          this.setupMotionListeners();
        }
      }
    }
  }

  // Set up motion event listeners
  private setupMotionListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('devicemotion', (event: DeviceMotionEvent) => {
      const acceleration = event.acceleration;
      const rotationRate = event.rotationRate;
      
      if (acceleration && rotationRate) {
        this.motionData = {
          acceleration: {
            x: acceleration.x || 0,
            y: acceleration.y || 0,
            z: acceleration.z || 0
          },
          gyroscope: {
            x: rotationRate.alpha || 0,
            y: rotationRate.beta || 0,
            z: rotationRate.gamma || 0
          },
          orientation: {
            alpha: 0,
            beta: 0,
            gamma: 0
          }
        };
        this.lastMotionTime = Date.now();
      }
    });

    window.addEventListener('deviceorientation', (event: DeviceOrientationEvent) => {
      if (this.motionData) {
        this.motionData.orientation = {
          alpha: event.alpha || 0,
          beta: event.beta || 0,
          gamma: event.gamma || 0
        };
      }
    });
  }

  // Start human detection
  startDetection(onUpdate: (detections: HumanDetection[]) => void): void {
    if (this.isDetecting) return;

    this.isDetecting = true;
    
    // Initial detection
    this.performDetection();
    onUpdate(this.detections);

    // Set up interval detection
    this.detectionInterval = setInterval(() => {
      this.performDetection();
      onUpdate(this.detections);
    }, this.settings.updateInterval);
  }

  // Stop detection
  stopDetection(): void {
    this.isDetecting = false;
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
  }

  // Perform detection scan
  private performDetection(): void {
    // Clear old detections (older than 10 seconds)
    const now = Date.now();
    this.detections = this.detections.filter(
      detection => now - detection.lastSeen.getTime() < 10000
    );

    // Simulate realistic human detection based on various factors
    this.simulateRadarDetection();
    this.simulateMotionDetection();
    this.simulateProximityDetection();

    // Update existing detections
    this.updateExistingDetections();
  }

  // Simulate radar-style detection
  private simulateRadarDetection(): void {
    const detectionProbability = this.settings.sensitivity * 0.3;
    
    if (Math.random() < detectionProbability) {
      const detection: HumanDetection = {
        id: `radar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        x: Math.random(),
        y: Math.random(),
        distance: Math.random() * this.settings.maxRange,
        confidence: 0.6 + (Math.random() * 0.3),
        movement: this.randomMovementType(),
        lastSeen: new Date(),
        signalStrength: -40 - (Math.random() * 30)
      };
      
      this.detections.push(detection);
      this.triggerAlert('radar', detection);
    }
  }

  // Simulate motion-based detection
  private simulateMotionDetection(): void {
    if (!this.motionData) return;

    const motionMagnitude = Math.sqrt(
      this.motionData.acceleration.x ** 2 +
      this.motionData.acceleration.y ** 2 +
      this.motionData.acceleration.z ** 2
    );

    if (motionMagnitude > this.settings.motionThreshold) {
      const detection: HumanDetection = {
        id: `motion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        x: 0.5 + (Math.random() - 0.5) * 0.4,
        y: 0.5 + (Math.random() - 0.5) * 0.4,
        distance: 2 + Math.random() * 8,
        confidence: Math.min(0.9, motionMagnitude / 10),
        movement: motionMagnitude > 5 ? 'Fast Moving' : 'Moving',
        lastSeen: new Date(),
        signalStrength: -30 - (Math.random() * 20)
      };
      
      this.detections.push(detection);
      this.triggerAlert('motion', detection);
    }
  }

  // Simulate proximity detection
  private simulateProximityDetection(): void {
    const proximityProbability = this.settings.sensitivity * 0.2;
    
    if (Math.random() < proximityProbability) {
      const detection: HumanDetection = {
        id: `proximity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        x: 0.4 + Math.random() * 0.2,
        y: 0.4 + Math.random() * 0.2,
        distance: Math.random() * 5,
        confidence: 0.8 + (Math.random() * 0.2),
        movement: 'Stationary',
        lastSeen: new Date(),
        signalStrength: -25 - (Math.random() * 15)
      };
      
      this.detections.push(detection);
      this.triggerAlert('proximity', detection);
    }
  }

  // Update existing detections with movement
  private updateExistingDetections(): void {
    this.detections.forEach(detection => {
      if (detection.movement !== 'Stationary') {
        // Simulate movement
        detection.x += (Math.random() - 0.5) * 0.05;
        detection.y += (Math.random() - 0.5) * 0.05;
        
        // Keep within bounds
        detection.x = Math.max(0, Math.min(1, detection.x));
        detection.y = Math.max(0, Math.min(1, detection.y));
        
        // Update confidence based on movement
        detection.confidence *= 0.95;
      }
    });
  }

  // Generate random movement type
  private randomMovementType(): 'Stationary' | 'Moving' | 'Fast Moving' {
    const rand = Math.random();
    if (rand < 0.5) return 'Stationary';
    if (rand < 0.8) return 'Moving';
    return 'Fast Moving';
  }

  // Trigger detection alert
  private triggerAlert(type: string, detection: HumanDetection): void {
    if (this.settings.enableSound) {
      this.playAlertSound();
    }
    
    if (this.settings.enableVibration) {
      this.triggerVibration();
    }

    // Log detection for debugging
    console.log(`Human detected via ${type}:`, {
      distance: detection.distance.toFixed(1) + 'm',
      confidence: (detection.confidence * 100).toFixed(1) + '%',
      movement: detection.movement
    });
  }

  // Play alert sound
  private playAlertSound(): void {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  }

  // Trigger device vibration
  private triggerVibration(): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }

  // Get detection confidence color
  static getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    if (confidence >= 0.4) return 'text-orange-400';
    return 'text-red-400';
  }

  // Get movement color
  static getMovementColor(movement: string): string {
    switch (movement) {
      case 'Stationary': return 'text-blue-400';
      case 'Moving': return 'text-yellow-400';
      case 'Fast Moving': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }

  // Update settings
  updateSettings(newSettings: Partial<DetectionSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Get current detections
  getDetections(): HumanDetection[] {
    return this.detections;
  }

  // Get detection status
  isActive(): boolean {
    return this.isDetecting;
  }
}