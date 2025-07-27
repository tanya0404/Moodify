import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import './FacialExpression.css';
import axios from 'axios';

export default function FacialExpression({setSongs}) {
    const videoRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [detectedMood, setDetectedMood] = useState(null);
    const [error, setError] = useState(null);

    const loadModels = async () => {
        try {
            const MODEL_URL = '/models';
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
            setIsModelsLoaded(true);
        } catch (err) {
            setError('Failed to load AI models');
            console.error("Error loading models: ", err);
        }
    };

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
            })
            .catch((err) => {
                setError('Camera access denied. Please allow camera permissions.');
                console.error("Error accessing webcam: ", err);
            });
    };

    const getMoodEmoji = (mood) => {
        const emojiMap = {
            happy: '😊',
            sad: '😢',
            angry: '😠',
            fearful: '😨',
            disgusted: '🤢',
            surprised: '😲',
            neutral: '😐'
        };
        return emojiMap[mood] || '🎵';
    };

    async function detectMood() {
        if (!isModelsLoaded) {
            setError('AI models are still loading. Please wait...');
            return;
        }

        setIsLoading(true);
        setError(null);
        setDetectedMood(null);

        try {
            const detections = await faceapi
                .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();
            
            let mostProbableExpression = 0;
            let _expression = '';

            if (!detections || detections.length === 0) {
                setError('No face detected. Please position your face in the camera.');
                setIsLoading(false);
                return;
            }

            for (const expression of Object.keys(detections[0].expressions)) {
                if (detections[0].expressions[expression] > mostProbableExpression) {
                    mostProbableExpression = detections[0].expressions[expression];
                    _expression = expression;
                }
            }

            const mood = _expression.trim().toLowerCase();
            setDetectedMood(mood);

            // Fetch songs based on detected mood
            const response = await axios.get(`http://localhost:3000/songs?mood=${mood}`);
            console.log("Detected mood:", mood);
            console.log(response.data);
            setSongs(response.data.songs);

        } catch (err) {
            console.error("Error detecting mood:", err);
            setError('Failed to detect mood. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadModels().then(startVideo);
    }, []);

    return (
        <div className="mood-detection-container glass">
            <div className="mood-detection-header">
                <h2>🎭 Mood Detection</h2>
                <p>Position your face in the camera and click detect to find your perfect music</p>
            </div>

            <div className="mood-element">
                <div className="video-container">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className='user-video-feed'
                    />
                    {!isModelsLoaded && (
                        <div className="loading-overlay">
                            <div className="loading-spinner"></div>
                            <p>Loading AI Models...</p>
                        </div>
                    )}
                </div>

                <div className="mood-controls">
                    <button 
                        className="detect-button"
                        onClick={detectMood}
                        disabled={isLoading || !isModelsLoaded}
                    >
                        {isLoading ? (
                            <>
                                <div className="button-spinner"></div>
                                Detecting...
                            </>
                        ) : (
                            <>
                                <span className="button-icon">🔍</span>
                                Detect Mood
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="error-message">
                            <span>⚠️</span>
                            <p>{error}</p>
                        </div>
                    )}

                    {detectedMood && !isLoading && (
                        <div className="mood-result">
                            <span className="mood-emoji">{getMoodEmoji(detectedMood)}</span>
                            <span className="mood-text">{detectedMood}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

