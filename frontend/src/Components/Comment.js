import React from 'react';
import {Box} from "@mui/material";

const Comment = ({Content, CommentDate, Username, ProfilePic}) => {
    return (
        <Box className={"shadow"} sx={{display: "flex", flexDirection: "column", bgcolor: "#181818", height: "192px", width: "100%", p: 3, mt: 1}}>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <Box display={"flex"} alignItems={"center"}>
                    <img className={"shadow"} style={{borderRadius: "50%"}} src={ProfilePic} height={"64px"} width={"64px"} alt={"..."} />
                    <span style={{marginLeft: "16px", color: "rgba(255,255,255,0.7)"}}>{Username}</span>
                </Box>
                <Box>
                    <span style={{marginLeft: "16px", color: "rgba(255,255,255,0.7)"}}>
                        {new Date(Date.parse(CommentDate)).toLocaleString("tr").replaceAll(".", "/").split(" ")[0]}
                    </span>
                </Box>
            </Box>
            <Box sx={{mt: 2}}>
                <p style={{textAlign: "justify", color: "rgba(255,255,255,0.7)"}}>
                    {Content}
                </p>
            </Box>
        </Box>
    );
};

export default Comment;