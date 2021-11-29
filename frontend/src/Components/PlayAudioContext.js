import {createContext, useContext, useEffect, useState} from "react";

export const PlayAudioContext = createContext(null);
export const usePlayer = () => {
    const [audio, element, playing, setAudio, setElement, setPlaying] = useContext(PlayAudioContext);

    const togglePlay = (e, api) => {
        console.log(e, element, JSON.stringify(element) === JSON.stringify(e));
        if (JSON.stringify(element) === JSON.stringify(e)) {
            setPlaying({isPlaying: !playing.isPlaying});
        }
        else {
            setElement(e);
            setPlaying({isPlaying: true});
            audio.pause();
            setAudio(new Audio(api));
        }
    };

    return [playing, element, togglePlay];
};