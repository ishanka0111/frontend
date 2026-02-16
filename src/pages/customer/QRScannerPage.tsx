/**
 * QR Scanner Page - Allows customers to scan table QR codes
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Layout, Button } from '../../components';
import './QRScannerPage.css';

const QRScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { setTableId, tableId } = useAuth();
  const [manualTableId, setManualTableId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please allow camera access or enter table number manually.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!manualTableId || manualTableId.trim() === '') {
      setError('Please enter a table number');
      return;
    }

    const tableNum = Number.parseInt(manualTableId);
    if (Number.isNaN(tableNum) || tableNum < 1 || tableNum > 50) {
      setError('Please enter a valid table number (1-50)');
      return;
    }

    // Set table ID
    setTableId(tableNum);
    
    // Navigate to menu
    navigate('/menu');
  };

  return (
    <Layout title="Scan QR Code">
      <div className="qr-scanner-page">
        <div className="qr-scanner-container">
          {/* Header */}
          <div className="qr-scanner-header">
            <h1>Scan Table QR Code</h1>
            <p>Point your camera at the QR code on your table</p>
            {tableId && (
              <div className="qr-scanner-current">
                Currently at Table {tableId}
              </div>
            )}
          </div>

          {/* Camera Scanner */}
          <div className="qr-scanner-camera">
            {!isCameraActive ? (
              <div className="qr-scanner-placeholder">
                <div className="qr-scanner-icon">📷</div>
                <p>Camera not active</p>
                <Button onClick={startCamera} variant="primary">
                  Start Camera
                </Button>
              </div>
            ) : (
              <div className="qr-scanner-video-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="qr-scanner-video"
                />
                <div className="qr-scanner-overlay">
                  <div className="qr-scanner-frame">
                    <div className="qr-scanner-corner qr-scanner-corner--tl"></div>
                    <div className="qr-scanner-corner qr-scanner-corner--tr"></div>
                    <div className="qr-scanner-corner qr-scanner-corner--bl"></div>
                    <div className="qr-scanner-corner qr-scanner-corner--br"></div>
                  </div>
                  <p className="qr-scanner-hint">Align QR code within frame</p>
                </div>
                <Button 
                  onClick={stopCamera} 
                  variant="secondary"
                  className="qr-scanner-stop-btn"
                >
                  Stop Camera
                </Button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="qr-scanner-error">
              <span className="qr-scanner-error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Manual Entry */}
          <div className="qr-scanner-divider">
            <span>OR</span>
          </div>

          <div className="qr-scanner-manual">
            <h3>Enter Table Number</h3>
            <p className="qr-scanner-manual-hint">
              If you can't scan the QR code, enter your table number manually
            </p>
            <form onSubmit={handleManualSubmit} className="qr-scanner-form">
              <input
                type="number"
                min="1"
                max="50"
                value={manualTableId}
                onChange={(e) => setManualTableId(e.target.value)}
                placeholder="Enter table number (1-50)"
                className="qr-scanner-input"
              />
              <Button type="submit" variant="primary" className="qr-scanner-submit">
                Confirm Table
              </Button>
            </form>
          </div>

          {/* Info Section */}
          <div className="qr-scanner-info">
            <h4>💡 How to use:</h4>
            <ul>
              <li>Find the QR code sticker on your table</li>
              <li>Click "Start Camera" and point at the QR code</li>
              <li>Or enter your table number manually below</li>
            </ul>
          </div>

          {/* Back Button */}
          <div className="qr-scanner-actions">
            <Button 
              onClick={() => navigate('/menu')} 
              variant="secondary"
            >
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QRScannerPage;
