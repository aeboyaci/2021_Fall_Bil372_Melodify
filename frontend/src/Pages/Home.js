import React, {useEffect, useState} from 'react';
import DashboardLayout from "../Components/Dashboard/DashboardLayout";
import {Box, Button, Grid, Typography} from "@mui/material";
import SongCard from "../Components/SongCard";
import PlaylistCard from "../Components/PlaylistCard";
import {usePage} from "../Components/PageContext";
import {useHistory} from "react-router-dom";
import axios from "axios";

const Home = () => {
    const [page, setPage] = usePage();
    const history = useHistory();
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    useEffect(async () => {
        setPage("home");
        axios.get("http://localhost:3001/api/recently-played/limit", {withCredentials: true}).then((d) => {console.log(d); setRecentlyPlayed(d.data.results)})
        axios.get("http://localhost:3001/api/playlists/limit", {withCredentials: true}).then((d) => {console.log(d); setPlaylists(d.data.results)})
    }, []);

    return (
        <DashboardLayout>
            <Box sx={{mb: 2}} display={"flex"} justifyContent={"space-between"}>
                <h4>Recently Played</h4>
                <Button onClick={() => history.push("/recently-played")}>SEE ALL</Button>
            </Box>
            <Box sx={{mb: 2}} display={"flex"}>
                {
                    recentlyPlayed.length > 0 ? recentlyPlayed.map((record) => (
                        <SongCard {...record} />
                    ))
                    :
                    <p>There is no recently-played song!</p>
                }
            </Box>
            <Box sx={{mb: 2}} display={"flex"} justifyContent={"space-between"}>
                <h4>Playlists</h4>
                <Button onClick={() => history.push("/playlists")}>SEE ALL</Button>
            </Box>
            <Box display={"flex"}>
                <PlaylistCard SongListID={"liked-songs"} SongListPic={"https://misc.scdn.co/liked-songs/liked-songs-640.png"} Name={"Liked Songs"} Description={"Songs that you liked before"} />
                {
                    playlists.length > 0 && playlists.map((playlist) => (
                        <PlaylistCard {...playlist} />
                    ))
                }
            </Box>
        </DashboardLayout>
    )
};

export default Home;