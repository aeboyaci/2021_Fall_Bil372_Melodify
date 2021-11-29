import React, {useEffect, useRef, useState} from 'react';
import {Box, Fab} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from '@mui/icons-material/Pause';
import {useHistory} from "react-router-dom";
import {usePlayer} from "./PlayAudioContext";
import axios from "axios";

const SongCard = ({ RecordID, RecordPic, Name, Singer }) => {
    const playButtonRef = useRef(null);
    const history = useHistory();

    // const [audio] = useState(new Audio("http://localhost:3001/api/song"));
    // const [playing, setPlaying] = useState(false);
    //
    // const toggle = () => setPlaying(!playing);
    //
    // useEffect(() => {
    //         playing ? audio.play() : audio.pause();
    // },[playing]);
    //
    // useEffect(() => {
    //     audio.addEventListener('ended', () => setPlaying(false));
    //     return () => {
    //         audio.removeEventListener('ended', () => setPlaying(false));
    //     };
    // }, []);
    const [playing, element, togglePlay] = usePlayer();

    const handleClick = (e, sender) => {
        if (sender === "card") {
            history.push(`/songs/1`);
        }
        else {
            togglePlay({Name, Singer}, "http://localhost:3001/api/record-file/" + RecordID);
            axios.post(`http://localhost:3001/api/played-songs`, {RecordID}, {withCredentials: true}).then((d) => {console.log(d.data)});
        }
        e.stopPropagation();
    };

    return (
        <Box onClick={(e) => handleClick(e, "card")} onMouseOver={() => playButtonRef.current.style = "opacity: 1;"} onMouseOut={() => playButtonRef.current.style = (playing.isPlaying && JSON.stringify(element) === JSON.stringify({Name, Singer})) ? "opacity: 1;" : "opacity: 0;"} className={"shadow"} sx={{":hover": {bgcolor: "#282828", cursor: "pointer"}, width: "230px", height: "290px", bgcolor: "#181818", display: "flex", flexDirection: "column", position: "relative", p: 2, mb: 2, mr: 2}}>
            <img style={{margin: "auto"}} height={"195px"} width={"195px"} src={RecordPic} alt={"..."} />
            <Box sx={{mt: 2}}>
                <p style={{fontSize: "13px", whiteSpace: "nowrap", marginBottom: "8px", fontWeight: "bolder", overflow: "hidden", textOverflow: "ellipsis", display: "block"}}>{Name}</p>
                <p style={{fontSize: "12px", whiteSpace: "nowrap", opacity: "0.7", overflow: "hidden", textOverflow: "ellipsis", display: "block"}}>{Singer}</p>
            </Box>
            <Box onClick={(e) => handleClick(e, "play")} ref={playButtonRef} sx={{position: "absolute", right: 0, bottom: 0, mb: "80px", zIndex: "1051", display: "flex", justifyContent: "flex-end", opacity: (playing.isPlaying && JSON.stringify(element) === JSON.stringify({Name, Singer})) ? "1" : "0"}}>
                {
                    !(playing.isPlaying && JSON.stringify(element) === JSON.stringify({Name, Singer})) ?
                        <Fab sx={{mr: 2}} color="primary" aria-label="play">
                        <PlayArrowIcon/>
                        </Fab>
                        :
                        <Fab sx={{mr: 2}} color="primary" aria-label="play">
                        <PauseIcon />
                        </Fab>
                }
            </Box>
        </Box>
    );
};

export default SongCard;