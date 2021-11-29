import React from 'react';
import {Box} from "@mui/material";
import {useHistory} from "react-router-dom";

const PlaylistCard = ({ SongListID, SongListPic, Name, Description }) => {
    const history = useHistory();

    return (
        <Box onClick={() => history.push(`/playlists/${SongListID}`)} className={"shadow"} sx={{":hover": {bgcolor: "#282828", cursor: "pointer"}, width: "230px", height: "290px", bgcolor: "#181818", display: "flex", flexDirection: "column", p: 2, mb: 2, mr: 2}}>
            <img style={{margin: "auto"}} height={"195px"} width={"195px"} src={SongListPic} alt={"..."} />
            <Box sx={{mt: 2}}>
                <p style={{fontSize: "13px", whiteSpace: "nowrap", marginBottom: "8px", fontWeight: "bolder", overflow: "hidden", textOverflow: "ellipsis", display: "block"}}>{Name}</p>
                <p style={{fontSize: "12px", whiteSpace: "nowrap", opacity: "0.7", overflow: "hidden", textOverflow: "ellipsis", display: "block"}}>{Description}</p>
            </Box>
        </Box>
    );
};

export default PlaylistCard;