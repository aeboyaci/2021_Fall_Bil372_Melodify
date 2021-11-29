import React, {useEffect, useState} from 'react';
import {Link, useHistory, useParams} from "react-router-dom";
import DashboardLayout from "../Components/Dashboard/DashboardLayout";
import UserHeader from "../Components/UserHeader";
import {Box, Grid} from "@mui/material";
import {usePage} from "../Components/PageContext";
import axios from "axios";

const FollowRelation = ({Type}) => {
    const {Username} = useParams();

    const [others, setOthers] = useState(null);
    const [user, setUser] = useState(null);

    const [page, setPage] = usePage();
    useEffect(() => {
        setPage("search");
        axios.get(`http://localhost:3001/api/users/${Username}`, {withCredentials: true}).then((d) => {console.log(d.data); setUser(d.data.results[0]);});
        axios.get(`http://localhost:3001/api/users/${Username}/${Type}`, {withCredentials: true}).then((d) => {console.log(d); setOthers(d.data.results);});
    }, [Type]);

    return (
        <DashboardLayout>
            {
                (user && others) &&
                    <React.Fragment>
                        <Grid container className={"shadow"} sx={{height: "192px", p: 3, bgcolor: "#181818"}}>
                            <UserHeader user={user}/>
                        </Grid>
                        <h4 style={{marginTop: "16px"}}>{Type}</h4>
                        <Box sx={{mt: 1, p: 3, bgcolor: "#181818"}}>
                            <ul className={"custom-list"}>
                                {
                                    others.map((f) => (
                                        <Link to={`/users/${f.Username}`}>
                                            <li>
                                                <img className={"shadow"} style={{borderRadius: "50%"}} src={f.ProfilePic} height={"64px"} width={"64px"} alt={"..."} />
                                                <span style={{marginLeft: "16px"}}>{f.Username}</span>
                                            </li>
                                        </Link>
                                    ))
                                }
                            </ul>
                        </Box>
                    </React.Fragment>
            }
        </DashboardLayout>
    );
};

export default FollowRelation;