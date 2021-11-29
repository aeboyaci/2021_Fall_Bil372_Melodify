import React, {useEffect, useState} from 'react';
import DashboardLayout from "../Components/Dashboard/DashboardLayout";
import PlaylistCard from "../Components/PlaylistCard";
import {Box} from "@mui/material";
import SongCard from "../Components/SongCard";
import {usePage} from "../Components/PageContext";
import axios from "axios";

const RecentlyPlayed = () => {
    const [page, setPage] = usePage();

    const [recentlyPlayed, setRecentlyPlayed] = useState([]);

    useEffect(() => {
        setPage("home");
        axios.get("http://localhost:3001/api/recently-played", {withCredentials: true}).then((d) => {console.log(d); setRecentlyPlayed(d.data.results)})
    }, []);

    return (
        <DashboardLayout>
            <h4>Recently Played</h4>
            <Box sx={{mt: 2, flexWrap: "wrap"}} display={"flex"}>
                {
                    recentlyPlayed.length > 0 ? recentlyPlayed.map((record) => (
                        <SongCard {...record} />
                    ))
                        :
                        <p>There is no recently-played song!</p>
                }
            </Box>
        </DashboardLayout>
    );
};

export default RecentlyPlayed;