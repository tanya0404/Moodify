import React, { useRef, useState } from "react";
import './MoodSongs.css';

const MoodSongs = ({ Songs }) => {
    const [isPlaying, setIsPlaying] = useState(null);
    const audioRefs = useRef([]);

    const handlePlayPause = (index) => {
        const currentAudio = audioRefs.current[index];

        // If clicking on the already playing song
        if (isPlaying === index) {
            currentAudio.pause();
            setIsPlaying(null);
        } else {
            // Pause the currently playing audio if there is one
            if (isPlaying !== null && audioRefs.current[isPlaying]) {
                audioRefs.current[isPlaying].pause();
                audioRefs.current[isPlaying].currentTime = 0;
            }

            currentAudio.play();
            setIsPlaying(index);
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (Songs.length === 0) {
        return (
            <div className="mood-songs-container glass">
                <div className="empty-state">
                    <div className="empty-icon">🎵</div>
                    <h3>No songs yet</h3>
                    <p>Detect your mood to get personalized music recommendations</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mood-songs-container glass">
            <div className="songs-header">
                <h2>🎶 Your Mood Music</h2>
                <p>Perfect songs for your current mood</p>
            </div>
            
            <div className="songs-grid">
                {Songs.map((song, index) => (
                    <div className="song-card" key={index}>
                        <div className="song-info">
                            <div className="song-cover">
                                <div className="cover-placeholder">
                                    <span>🎵</span>
                                </div>
                            </div>
                            <div className="song-details">
                                <h3 className="song-title">{song.title}</h3>
                                <p className="song-artist">{song.artist}</p>
                            </div>
                        </div>
                        
                        <div className="song-controls">
                            <audio
                                ref={el => audioRefs.current[index] = el}
                                src={song.audio}
                                onEnded={() => setIsPlaying(null)}
                            />
                            <button 
                                className={`play-button ${isPlaying === index ? 'playing' : ''}`}
                                onClick={() => handlePlayPause(index)}
                                aria-label={isPlaying === index ? 'Pause' : 'Play'}
                            >
                                {isPlaying === index ? (
                                    <span className="pause-icon">⏸️</span>
                                ) : (
                                    <span className="play-icon">▶️</span>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoodSongs;
