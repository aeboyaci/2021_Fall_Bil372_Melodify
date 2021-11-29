import React from 'react';
import {Box} from "@mui/material";

const NotFound = () => {
    return (
        <Box sx={{height: "calc(100vh - 48px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h1>404</h1>
            <h2>Not Found!</h2>
        </Box>
    );
};

export default NotFound;