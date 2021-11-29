import React, {useEffect, useRef, useState} from 'react';
import DashboardLayout from "../Components/Dashboard/DashboardLayout";
import PlaylistCard from "../Components/PlaylistCard";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    IconButton, Slide, Snackbar,
    Tooltip
} from "@mui/material";
import {usePage} from "../Components/PageContext";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CustomForm from "../Components/CustomForm";
import * as Yup from "yup";
import {makeStyles} from "@mui/styles";
import UploadIcon from "@mui/icons-material/Upload";
import axios from "axios";

const playlists = [
    {
        SongListPic: "https://i.scdn.co/image/ab67616d0000b27303570c198ad5e10bd8d01a8d",
        Name: "How Come You Never Go There",
        Description: "Feist's best songs!Feist's best songs!Feist's best songs!"
    }
];

const validationSchema = Yup.object({
    Name: Yup.string().required("Name cannot be empty."),
    Description: Yup.string().required("Description cannot be empty").max(255, "Max length is 255.")
});

const fields = [
    {
        name: "Name",
        label: "Name",
        type: "text"
    },
    {
        name: "Description",
        label: "Description",
        type: "text"
    }
];

const useStyles = makeStyles({
    dialog: {
        "& .css-tlc64q-MuiPaper-root-MuiDialog-paper": {
            backgroundColor: "#181818"
        },
        "& .css-tlc64q-MuiPaper-root-MuiDialog-paper h2": {
            color: "#FFFFFF"
        }
    }
});

const Playlists = () => {
    const styles = useStyles();

    const [page, setPage] = usePage();
    const [playlists, setPlaylists] = useState([]);

    const fetchPlaylists = () => {
        axios.get("http://localhost:3001/api/playlists", {withCredentials: true}).then((d) => {console.log(d); setPlaylists(d.data.results)})
    }

    useEffect(() => {
        setPage("home");
        fetchPlaylists();
    }, []);

    const [open, setOpen] = useState(false);
    const songListPicRef = useRef(null);
    const [snackbar, setSnackbar] = useState(false);

    const handleSubmit = (values, {resetForm}) => {
        let formData = new FormData();
        formData.append("SongListPic", songListPicRef.current.files[0]);
        formData.append("Name", values.Name);
        formData.append("Description", values.Description);
        axios.post("http://localhost:3001/api/playlists/create", formData, {withCredentials: true}).then((d) => {console.log(d.data); resetForm(); songListPicRef.current.value = ""; setSnackbar(true); setOpen(false); fetchPlaylists();});
    };

    return (
        <DashboardLayout>
            <Snackbar
                open={snackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                onClose={() => setSnackbar(false)}
                TransitionComponent={(props) => <Slide {...props} direction="left" />}
                autoHideDuration={1750}
            >
                <Alert onClose={() => setSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Playlist successfully created.
                </Alert>
            </Snackbar>
            <h4>Playlists</h4>
            <Box sx={{mt: 2, flexWrap: "wrap"}} display={"flex"}>
                <PlaylistCard SongListPic={"https://misc.scdn.co/liked-songs/liked-songs-640.png"} Name={"Liked Songs"} Description={"Songs that you liked before"} />
                {
                    playlists.map((playlist) => (
                        <PlaylistCard {...playlist} />
                    ))
                }
            </Box>
            <Box onClick={() => setOpen(true)} sx={{position: "absolute", right: 0, bottom: 0, mb: 3, mr: 2, zIndex: "1051"}}>
                <Tooltip title={"Create playlist"}>
                    <Fab sx={{mr: 2}} color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Box>
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={open}
                className={styles.dialog}
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        Create Playlist
                        <IconButton color={"error"} sx={{ top: "-4px" }} onClick={() => setOpen(false)}>
                            <CancelIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{mt: 1}}>
                    <input ref={songListPicRef} type={"file"} style={{display: "none"}} accept={".png,.jpg,.jpeg,.webp"} />
                    <p style={{marginBottom: "8px", color: "rgba(255,255,255,0.7)"}}>Playlist Poster Image</p>
                    <Button onClick={() => songListPicRef.current.click()} sx={{mb: 2}}>
                        <UploadIcon />
                        Upload
                    </Button>
                    <CustomForm styled={true} buttonText={"Create"} fields={fields} onSubmit={handleSubmit} validationSchema={validationSchema} initialValues={{Name: "", Description: "", FirstSong: ""}} />
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default Playlists;