import React, { useEffect, useRef, useState } from 'react';
import { IntentType } from '../types';
import { RefreshCw, VideoOff, Camera } from 'lucide-react';

interface CameraFeedProps {
  onGestureDetected: (intent: IntentType) => void;
  isSimulating: boolean;
  language?: 'en' | 'zh';
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onGestureDetected, isSimulating, language }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let mounted = true;

    const startCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (mounted) setError("Camera API not supported.");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
        });
      } catch (err) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (fallbackErr: any) {
            if (mounted) {
                if (fallbackErr.name === 'NotFoundError') {
                    setError("No camera found.");
                } else if (fallbackErr.name === 'NotAllowedError') {
                    setError("Permission denied.");
                } else {
                    setError("Camera unavailable.");
                }
            }
            return;
        }
      }

      if (mounted && stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
        setError(null);
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-3xl overflow-hidden shadow-md border border-slate-700">
      
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transform scale-x-[-1] opacity-90 ${!hasPermission ? 'hidden' : ''}`} 
      />

      {/* Error / Loading States */}
      {!hasPermission && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-900">
          <RefreshCw className="w-10 h-10 animate-spin mb-4 text-med-secondary" />
          <p className="font-medium text-slate-300">Initializing Camera...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-900 p-6 text-center">
          <VideoOff className="w-10 h-10 text-slate-500 mb-4" />
          <p className="text-sm text-slate-400 mb-6">{error}</p>
          <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-xs">
              Use touch controls to simulate input
          </div>
        </div>
      )}

      {/* Overlay: Simple Status */}
      <div className="absolute top-4 left-4">
         <div className="bg-black/40 backdrop-blur-md text-white/90 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border border-white/10">
            <div className={`w-2 h-2 rounded-full ${hasPermission ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            {hasPermission ? (language === 'zh' ? '即時影像' : 'Live Feed') : (language === 'zh' ? '離線' : 'Offline')}
         </div>
      </div>

      {isSimulating && (
        <div className="absolute bottom-4 left-4 bg-med-accent text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-pulse z-10">
          <Camera size={12} />
          Input Active
        </div>
      )}
    </div>
  );
};

export default CameraFeed;