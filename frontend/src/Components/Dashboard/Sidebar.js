import React from 'react';
import {Box, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import {makeStyles} from "@mui/styles";
import {usePage} from "../PageContext";
import {useHistory} from "react-router-dom";
import {useAuth} from "../AuthContext";
import Cookies from "js-cookie";

const useStyles = makeStyles({
    active: {
        backgroundColor: "#282828 !important",
        opacity: "1",
        "& .MuiSvgIcon-root": {
            fill: "#fff",
        },
        "& .MuiListItemText-primary": {
            color: "#fff",
        }
    }
});

const listItems = [
    {
        icon: <HomeIcon/>,
        label: "Home",
        path: "home",
        requiredRole: ["Creator", "Consumer"]
    },
    {
        icon: <SearchIcon/>,
        label: "Search",
        path: "search",
        requiredRole: ["Creator", "Consumer"]
    },
    {
        icon: <AddIcon/>,
        label: "Creator Panel",
        path: "Creator-panel",
        requiredRole: ["Creator"]
    },
    {
        icon: <PersonIcon/>,
        label: "Profile",
        path: "profile",
        requiredRole: ["Creator", "Consumer"]
    }
];

const Sidebar = () => {
    const styles = useStyles();
    const [page, setPage] = usePage();
    const history = useHistory();
    const [auth, setAuth] = useAuth();

    return (
        <Box display={"flex"} flexDirection={"column"} justifyContent={"space-between"}
             sx={{height: "100vh", minWidth: "241px", width: "241px", bgcolor: "#000", pt: 3}}>
            <Box>
                <Box display={"flex"} alignItems={"center"} sx={{mb: "18px", ml: "24px"}}>
                    <svg fill={"#fff"} style={{marginRight: "24px"}} xmlns="http://www.w3.org/2000/svg" width="32"
                         height="32" viewBox="0 0 24 24">
                        <path
                            d="M12 9c-3.865 0-7 3.134-7 7s3.135 7 7 7 7-3.134 7-7-3.135-7-7-7zm.067 11.026l-1.546-1.546c.396-.396.943-.641 1.546-.641.604 0 1.151.245 1.546.641l-1.546 1.546zm2.262-2.259c-.58-.578-1.379-.936-2.262-.936-.881 0-1.681.358-2.26.936l-.951-.95c.823-.822 1.958-1.331 3.211-1.331s2.389.508 3.21 1.331l-.948.95zm1.663-1.665c-1.005-1.004-2.392-1.625-3.925-1.625-1.532 0-2.919.621-3.924 1.625l-.977-.975c1.256-1.254 2.987-2.03 4.9-2.03 1.914 0 3.646.775 4.901 2.03l-.975.975zm-11.476 4.898c-2.951-.61-4.516-3.09-4.516-5.5 0-2.615 1.731-5.198 5.283-5.5-1.415 1.591-2.283 3.708-2.283 6 0 1.782.618 3.6 1.516 5zm19.484-5.5c0 2.409-1.55 4.889-4.5 5.5.897-1.4 1.5-3.218 1.5-5 0-2.292-.868-4.409-2.283-6 3.552.303 5.283 2.886 5.283 5.5zm-5.074-7.487c.942.084 1.782.294 2.529.601-1.27-4.388-4.666-7.614-9.455-7.614-4.786 0-8.173 3.225-9.442 7.607.744-.303 1.582-.512 2.52-.595 1.347-2.538 3.842-4.04 6.922-4.034 3.081-.006 5.578 1.496 6.926 4.035z"/>
                    </svg>
                    <Typography sx={{color: "#fff"}} variant={"h4"}>
                        Melodify
                    </Typography>
                </Box>
                <Box>
                    {
                        listItems.map((item, i) => (
                            (item.requiredRole.includes(auth.Role)) && <ListItem onClick={() => {
                                setPage(item.path);
                                history.push("/" + item.path);
                            }} key={i} disablePadding={true} sx={{px: 2}}>
                                <ListItemButton className={page === item.path && styles.active}>
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label}/>
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </Box>
            </Box>
            <Box>
                <ListItem onClick={() => {setAuth({Username: "", Role: ""}); Cookies.remove("user"); history.push("/account/login");}} disablePadding={true} sx={{px: 2}}>
                    <ListItemButton>
                        <ListItemIcon>
                            <LogoutIcon/>
                        </ListItemIcon>
                        <ListItemText primary={"Logout"}/>
                    </ListItemButton>
                </ListItem>
            </Box>
        </Box>
    );
};

export default Sidebar;