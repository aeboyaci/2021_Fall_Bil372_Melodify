import React, {useState} from 'react';
import {Box, Button} from "@mui/material";
import {Link, Redirect} from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {useAuth} from "./AuthContext";
import axios from "axios";

const UserHeader = ({user, setIsFollowing, userRelation}) => {
    const [btnState, setBtnState] = useState(userRelation);
    const [auth, setAuth] = useAuth();

    return (
        <React.Fragment>
            {
                user.Username === auth.Username &&
                    <Redirect to={`/profile`} />
            }
            <img style={{overFlow: "hidden", borderRadius: "50%"}} className={"shadow"}
                 src={user.ProfilePic} height={"100%"} width={"auto"} alt={"..."}/>
            <Box display={"flex"} flexDirection={"column"} sx={btnState ? {px: 2} : {px: 2, pt: 3}}>
                <Box>
                    <Link to={`/users/${user.Username}`} style={{textDecoration: "none", color: "#fff"}}>
                        <h1>{user.Username}</h1>
                    </Link>
                </Box>
                <Box sx={{mb: 2}} display={"flex"}>
                    <Link to={`/users/${user.Username}/followers`}
                          style={{textDecoration: "none", color: "#fff"}}>
                        <Box display={"flex"} flexDirection={"column"}>
                            <h5 style={{
                                opacity: "0.8",
                                marginBottom: "4px",
                                fontSize: "16px"
                            }}>Followers</h5>
                            <p style={{opacity: "0.7", fontSize: "12px", margin: 0}}>
                                {user.Followers ? user.Followers: 0}
                            </p>
                        </Box>
                    </Link>
                    <Link to={`/users/${user.Username}/following`}
                          style={{textDecoration: "none", color: "#fff"}}>
                        <Box sx={{ml: 2}} display={"flex"} flexDirection={"column"}>
                            <h5 style={{opacity: "0.8", marginBottom: "4px", fontSize: "16px"}}>Following</h5>
                            <p style={{opacity: "0.7", fontSize: "12px", margin: 0}}>
                                {user.Following ? user.Following : 0}
                            </p>
                        </Box>
                    </Link>
                </Box>
                <Box>
                    {
                        userRelation === "unfollowing" &&
                        <Button onClick={() => {axios.post("http://localhost:3001/api/follow", {Username: user.Username}, {withCredentials: true}); setIsFollowing(true)}} sx={{color: "#fff"}} variant={"contained"}>
                            <AddIcon/>
                            Follow
                        </Button>
                    }
                    {
                        userRelation === "following" &&
                        <Button onClick={() => {axios.post("http://localhost:3001/api/unfollow", {Username: user.Username}, {withCredentials: true}); setIsFollowing(false)}} color={"error"} sx={{color: "#fff"}} variant={"contained"}>
                            <RemoveIcon />
                            Unfollow
                        </Button>
                    }
                </Box>
            </Box>
        </React.Fragment>
    );
};

export default UserHeader;