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

    return (
        <div className="mood-songs">
            <h2>Recommended Songs</h2>
            {Songs.map((song, index) => (
                <div className="song" key={index}>
                    <div className="title">
                        <h3>{song.title}</h3>
                        <p>{song.artist}</p>
                    </div>
                    <div className="play-pause-button">
                        <audio
                            ref={el => audioRefs.current[index] = el}
                            src={song.audio}
                        />
                        <button onClick={() => handlePlayPause(index)}>
                            {isPlaying === index ? (
                                <i className="ri-pause-line"></i>
                            ) : (
                                <i className="ri-play-line"></i>
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MoodSongs;
