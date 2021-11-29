import React, {useEffect} from 'react';
import {Box} from "@mui/material";
import Sidebar from "./Sidebar";
import {useAuth} from "../AuthContext";
import {useHistory} from "react-router-dom";

const DashboardLayout = ({children}) => {
    const [auth, setAuth] = useAuth();
    const history = useHistory();

    useEffect(() => {
        if (!(auth.Username && auth.Role))
            history.push("/account/login");
    }, []);

    return (
        <Box display={"flex"}>
            <Sidebar />
            <Box sx={{py: 3, px: 2, width: "100%", bgcolor: "#121212", color: "#ffffff", overflowY: "auto", maxHeight: "100vh"}}>
                {children}
            </Box>
        </Box>
    );
};

export default DashboardLayout;