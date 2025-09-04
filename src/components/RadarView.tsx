"use client";

import { useEffect, useRef } from 'react';
import { HumanDetection } from '@/lib/detection';

interface RadarViewProps {
  detections: HumanDetection[];
  isActive: boolean;
  maxRange: number;
}

export function RadarView({ detections, isActive, maxRange }: RadarViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const sweepAngle = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - 20;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw radar background
      drawRadarGrid(ctx, centerX, centerY, radius);
      
      // Draw sweep line (only if active)
      if (isActive) {
        drawSweepLine(ctx, centerX, centerY, radius);
        sweepAngle.current += 0.02;
      }

      // Draw detections
      drawDetections(ctx, centerX, centerY, radius);

      // Draw range labels
      drawRangeLabels(ctx, centerX, centerY, radius);

      // Continue animation if active
      if (isActive) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    const drawRadarGrid = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;

      // Draw concentric circles
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 4) * i, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Draw radial lines
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + radius * Math.cos(angle),
          centerY + radius * Math.sin(angle)
        );
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    const drawSweepLine = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
      // Create sweep effect
      const gradient = ctx.createLinearGradient(
        centerX,
        centerY,
        centerX + radius * Math.cos(sweepAngle.current),
        centerY + radius * Math.sin(sweepAngle.current)
      );
      gradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)');
      gradient.addColorStop(0.7, 'rgba(34, 197, 94, 0.3)');
      gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(sweepAngle.current),
        centerY + radius * Math.sin(sweepAngle.current)
      );
      ctx.stroke();

      // Add sweep trail
      ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, sweepAngle.current - 0.3, sweepAngle.current);
      ctx.closePath();
      ctx.fill();
    };

    const drawDetections = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
      detections.forEach((detection) => {
        // Calculate position on radar
        const detectionRadius = (detection.distance / maxRange) * radius;
        const angle = (detection.x * 2 * Math.PI) - Math.PI/2; // Convert to radar coordinates
        const x = centerX + detectionRadius * Math.cos(angle);
        const y = centerY + detectionRadius * Math.sin(angle);

        // Draw detection dot
        const dotSize = Math.max(3, 8 * detection.confidence);
        ctx.fillStyle = getDetectionColor(detection);
        ctx.globalAlpha = detection.confidence;
        
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
        ctx.fill();

        // Add pulsing effect for moving targets
        if (detection.movement !== 'Stationary') {
          ctx.strokeStyle = getDetectionColor(detection);
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.5;
          
          ctx.beginPath();
          ctx.arc(x, y, dotSize + 5, 0, 2 * Math.PI);
          ctx.stroke();
        }

        ctx.globalAlpha = 1;

        // Add distance label
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${detection.distance.toFixed(1)}m`, x, y - dotSize - 5);
      });
    };

    const drawRangeLabels = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
      ctx.fillStyle = '#22c55e';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';

      for (let i = 1; i <= 4; i++) {
        const ringRadius = (radius / 4) * i;
        const range = (maxRange / 4) * i;
        ctx.fillText(`${range.toFixed(0)}m`, centerX + ringRadius + 5, centerY - 5);
      }
    };

    const getDetectionColor = (detection: HumanDetection): string => {
      switch (detection.movement) {
        case 'Fast Moving': return '#ef4444';
        case 'Moving': return '#f59e0b';
        case 'Stationary': return '#3b82f6';
        default: return '#6b7280';
      }
    };

    // Start animation
    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [detections, isActive, maxRange]);

  return (
    <div className="bg-black rounded-lg p-4 border border-gray-800">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full h-full max-w-md max-h-md mx-auto"
        style={{ background: 'radial-gradient(circle at center, #0f172a, #000000)' }}
      />
      
      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-400">Stationary</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-400">Moving</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-400">Fast Moving</span>
        </div>
      </div>
    </div>
  );
}