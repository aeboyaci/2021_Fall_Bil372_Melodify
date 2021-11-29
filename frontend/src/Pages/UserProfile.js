import React, {useEffect, useState} from 'react';
import DashboardLayout from "../Components/Dashboard/DashboardLayout";
import {usePage} from "../Components/PageContext";
import {Box, Button, Grid} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import PlaylistCard from "../Components/PlaylistCard";
import UserHeader from "../Components/UserHeader";
import axios from "axios";

const UserProfile = () => {
    const [page, setPage] = usePage();
    const {Username} = useParams();

    const [user, setUser] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        setPage("search");
        axios.get(`http://localhost:3001/api/users/is-following/${Username}`, {withCredentials: true}).then((d) => {console.log(d.data); setIsFollowing(d.data.results);});
        axios.get(`http://localhost:3001/api/playlists/user/${Username}`, {withCredentials: true}).then((d) => {console.log(d.data); setPlaylists(d.data.results);});
        axios.get(`http://localhost:3001/api/users/${Username}`, {withCredentials: true}).then((d) => {console.log(d.data); setUser(d.data.results[0]);});
    }, []);

    useEffect(() => {
        console.log("isFollowing", isFollowing);
        setTimeout(() => {
            axios.get(`http://localhost:3001/api/users/${Username}`, {withCredentials: true}).then((d) => {console.log(d.data); setUser(d.data.results[0]);});
        }, 500);
    }, [isFollowing]);

    return (
        <DashboardLayout>
            {
                user &&
                <React.Fragment>
                    <Grid container className={"shadow"} sx={{height: "192px", p: 3, bgcolor: "#181818"}}>
                        <UserHeader setIsFollowing={setIsFollowing} user={user} userRelation={isFollowing ? "following" : "unfollowing"} />
                    </Grid>
                    <Box sx={{mt: 2}}>
                        <h4>Playlists</h4>
                        <Box sx={{mt: 2}} display={"flex"} flexWrap={"wrap"}>
                            {
                                (playlists && playlists.length > 0) ? playlists.map((playlist) => (
                                    <PlaylistCard {...playlist} />
                                ))
                                    :
                                    <p>There is no playlist yet!</p>
                            }
                        </Box>
                    </Box>
                </React.Fragment>
            }
        </DashboardLayout>
    );
};

export default UserProfile;