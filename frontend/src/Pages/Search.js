import React, {useEffect, useState} from 'react';
import DashboardLayout from "../Components/Dashboard/DashboardLayout";
import {Box} from "@mui/material";
import CustomForm from "../Components/CustomForm";
import * as Yup from "yup";
import {usePage} from "../Components/PageContext";
import {Link} from "react-router-dom";
import axios from "axios";

const validationSchema = Yup.object({
    Search: Yup.string().required("Search area cannot be empty")
});

const fields = [
    {
        name: "Search",
        label: "Search",
        type: "text"
    }
];

const Search = () => {
    const [page, setPage] = usePage();
    const [searchResult, setSearchResult] = useState(null);

    useEffect(() => {
        setPage("search");
    }, []);

    const handleSubmit= (values, {resetForm}) => {
        axios.get("http://localhost:3001/api/search/" + values.Search).then((d) => {console.log(d.data);setSearchResult(d.data.results);});
    };

    return (
        <DashboardLayout>
            <h4>Search</h4>
            <Box sx={{mt: 2}}>
               <CustomForm buttonText={"Search"} fields={fields} onSubmit={handleSubmit} validationSchema={validationSchema} initialValues={{SearchScope: "", Search: ""}} styled={true} />
            </Box>
            {
                searchResult &&
                    <React.Fragment>
                        {
                            searchResult.users.length > 0 &&
                            <Box className={"shadow"} sx={{mt: 2, p: 3, bgcolor: "#181818"}}>
                                <h5 style={{marginBottom: "16px"}}>Users</h5>
                                <ul className={"custom-list"}>
                                    {
                                        searchResult.users.map((user) => (
                                            <Link to={`/users/${user.Username}`}>
                                                <li>
                                                    <img className={"shadow"} style={{borderRadius: "50%"}} src={user.ProfilePic} height={"64px"} width={"64px"} alt={"..."} />
                                                    <span style={{marginLeft: "16px"}}>{user.Username}</span>
                                                </li>
                                            </Link>
                                        ))
                                    }
                                </ul>
                            </Box>
                        }
                        {
                            searchResult.songs.length > 0 &&
                            <Box className={"shadow"} sx={{mt: 2, p: 3, bgcolor: "#181818"}}>
                                <h5 style={{marginBottom: "16px"}}>Songs</h5>
                                <ul className={"custom-list"}>
                                    {
                                        searchResult.songs.map((song) => (
                                            <Link to={`/songs/${song.RecordID}`}>
                                                <li>
                                                    <img className={"shadow"} style={{borderRadius: "50%"}} src={song.RecordPic} height={"64px"} width={"64px"} alt={"..."} />
                                                    <span style={{marginLeft: "16px"}}>{song.R_NAME}</span>
                                                </li>
                                            </Link>
                                        ))
                                    }
                                </ul>
                            </Box>
                        }
                        {
                            searchResult.playlists.length > 0 &&
                            <Box className={"shadow"} sx={{mt: 2, p: 3, bgcolor: "#181818"}}>
                                <h5 style={{marginBottom: "16px"}}>Playlists</h5>
                                <ul className={"custom-list"}>
                                    {
                                        searchResult.playlists.map((playlist) => (
                                            <Link to={`/playlists/${playlist.SongListID}`}>
                                                <li>
                                                    <img className={"shadow"} style={{borderRadius: "50%"}} src={playlist.SongListPic} height={"64px"} width={"64px"} alt={"..."} />
                                                    <span style={{marginLeft: "16px"}}>{playlist.Name}</span>
                                                </li>
                                            </Link>
                                        ))
                                    }
                                </ul>
                            </Box>
                        }
                    </React.Fragment>
            }
        </DashboardLayout>
    );
};

export default Search;