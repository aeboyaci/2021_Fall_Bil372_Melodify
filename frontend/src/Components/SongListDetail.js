import React, {useEffect, useState} from 'react';
import DashboardLayout from "./Dashboard/DashboardLayout";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab, FormControl, FormHelperText,
    Grid,
    IconButton,
    InputLabel, MenuItem,
    Select
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {usePage} from "./PageContext";
import {useParams} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import * as Yup from "yup";
import {makeStyles} from "@mui/styles";
import {usePlayer} from "./PlayAudioContext";
import PauseIcon from "@mui/icons-material/Pause";
import {Formik, Form} from "formik";
import axios from "axios";
import NotFound from "./NotFound";

const validationSchema = Yup.object({
    RecordID:  Yup.string().required("Song cannot be empty")
});

const field = {
    name: "RecordID",
    label: "Song",
    type: "dynamic",
    api: "http://localhost:3001/api/songs"
};

const useStyles = makeStyles({
    dialog: {
        "& .css-tlc64q-MuiPaper-root-MuiDialog-paper": {
            backgroundColor: "#181818"
        },
        "& .css-tlc64q-MuiPaper-root-MuiDialog-paper h2": {
            color: "#FFFFFF"
        }
    },
    root: {
        "& .MuiInputLabel-root": {
            color: "rgba(255,255,255,0.7)"
        },
        "& .MuiInputBase-root": {
            backgroundColor: "#282828"
        },
        "& .MuiInputBase-input": {
            color: "rgba(255,255,255,0.7)"
        },
        "& .css-35r8l-MuiInputBase-root-MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#15883E"
        },
        "& .css-1x7plu-MuiInputBase-root-MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#15883E"
        }
    },
    "@global": {
        ".css-1poimk-MuiPaper-root-MuiMenu-paper-MuiPaper-root-MuiPopover-paper": {
            background: "transparent",
            color: "rgba(255,255,255,0.7)"
        },
        ".css-67qhq-MuiButtonBase-root-MuiMenuItem-root:hover": {
            backgroundColor: "#282828"
        },
        ".css-6hp17o-MuiList-root-MuiMenu-list": {
            backgroundColor: "#181818"
        }
    }
});

const SongListDetail = () => {
    const styles = useStyles();

    const [page, setPage] = usePage();

    const [playing, element, togglePlay] = usePlayer();
    const [playlist, setPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);
    console.log(songs);

    const {SongListID} = useParams();

    const [open, setOpen] = useState(false);
    const [dynamicData, setDynamicData] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const fetchSongs = () => {
        axios.get("http://localhost:3001/api/playlists/" + SongListID, {withCredentials: true}).then((d) => {console.log(d); setPlaylist(d.data.results[0]); setIsLoading(false)});
        axios.get("http://localhost:3001/api/playlists/" + SongListID + "/songs", {withCredentials: true}).then((d) => {console.log(d); setSongs(d.data.results); setIsLoading(false)});
    };

    useEffect(() => {
        setPage("search");
        fetchSongs();
    }, []);

    const handleSubmit = (values, {resetForm}) => {
        axios.post("http://localhost:3001/api/playlists", {SongListID, RecordID: values.RecordID}, {withCredentials: true}).then((d) => {console.log(d.data); resetForm(); setOpen(false); fetchSongs();});
    };

    return (
        <DashboardLayout>
            {
                (playlist) ?
                    <React.Fragment>
                        <Grid container wrap={"nowrap"} className={"shadow"} sx={{p: 3, height: "340px", bgcolor: "#181818"}}>
                            <img height={"100%"} width={"auto"} src={playlist.SongListPic} alt={"..."} />
                            <Box display={"flex"} flexDirection={"column"} justifyContent={"space-between"} sx={{p: 3, maxWidth: "100%"}}>
                                <Box>
                                    <h1>{playlist.SL_NAME}</h1>
                                    <p style={{fontSize: "18px", textAlign: "justify", opacity: "0.7"}}>{playlist.Description}</p>
                                </Box>
                                <Box>
                                    <p style={{opacity: "0.8", fontWeight: "bolder", margin: 0, marginBottom: "4px"}}>Publish Date</p>
                                    <p style={{opacity: "0.7"}}>
                                        {new Date(Date.parse(playlist.SL_PUBLISHDATE)).toLocaleString("tr").replaceAll(".", "/").split(" ")[0]}
                                    </p>
                                </Box>
                            </Box>
                        </Grid>
                        <Box className={"shadow"} sx={{mt: 2, p: 3, bgcolor: "#181818", position: "relative"}}>
                            <Grid container>
                                <Grid item sm={3}>
                                    Name
                                </Grid>
                                <Grid item sm={3}>
                                    Singer
                                </Grid>
                                <Grid item sm={3}>
                                    Publish Date
                                </Grid>
                                <Grid item sm={3}>
                                    Duration
                                </Grid>
                            </Grid>
                            <Box sx={{position: "absolute", top: 0, right: 0, mt: "18px", mr: 4}}>
                                <Button onClick={() => setOpen(true)}>
                                    <AddIcon sx={{mr: 1}} />
                                    <span>Add Song</span>
                                </Button>
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
                                        <Box sx={{mt: 1}}>
                                            <Formik onSubmit={handleSubmit} validationSchema={validationSchema} initialValues={{RecordID: ""}}>
                                                {
                                                    ({values, touched, errors, handleChange, handleBlur, handleSubmit}) => (
                                                        <Form onSubmit={handleSubmit}>
                                                            <FormControl className={styles.root} sx={{mb: 2}} fullWidth={true} error={touched[field.name] && Boolean(errors[field.name])}>
                                                                <InputLabel id="table-select-label">{field.label}</InputLabel>
                                                                <Select
                                                                    labelId="table-select-label"
                                                                    id="table-select"
                                                                    value={values[field.name] || ""}
                                                                    name={field.name}
                                                                    label={field.label}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    onFocus={async () => {
                                                                        let response = await fetch(field.api);
                                                                        let result = await response.json();
                                                                        setDynamicData(result.results);
                                                                    }}
                                                                >
                                                                    {
                                                                        dynamicData.length > 0 && dynamicData.map((d) => (
                                                                            <MenuItem style={{color: "rgba(255,255,255,0.7)"}} key={d.Name + " " + d.Singer} value={d.RecordID  || ""}>{d.Name + " - " + d.Singer}</MenuItem>
                                                                        ))
                                                                    }
                                                                </Select>
                                                                <FormHelperText>{touched[field.name] && errors[field.name]}</FormHelperText>
                                                            </FormControl>
                                                            <Button type={"submit"} sx={{py: "10px", borderRadius: "50px", color: "#fff"}} fullWidth={true} variant={"contained"}>Add</Button>
                                                        </Form>
                                                    )
                                                }
                                            </Formik>
                                        </Box>
                                    </DialogContent>
                                </Dialog>
                            </Box>
                        </Box>
                        <Box className={"shadow"} sx={{mt: "4px", p: 3, bgcolor: "#181818"}}>
                            <ul className={"custom-list"}>
                                {
                                    songs.length > 0 && songs.map((song) => (
                                        <li style={{position: "relative"}}>
                                            <Grid container>
                                                <Grid item xs={3}>
                                                    {song.Name}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {song.Singer}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {new Date(Date.parse(song.PublishDate)).toLocaleString("tr").replaceAll(".", "/").split(" ")[0]}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <AccessTimeIcon sx={{mr: 1}} />
                                                    <span style={{paddingTop: "2px"}}>{song.Duration}</span>
                                                </Grid>
                                            </Grid>
                                            <Box onClick={() => {togglePlay({Name: song.Name, Singer: song.Singer}, `http://localhost:3001/api/record-file/${song.RecordID}`); axios.post(`http://localhost:3001/api/played-songs`, {RecordID: song.RecordID}, {withCredentials: true}).then((d) => {console.log(d.data)});}} sx={{position: "absolute", right: 0, top: 0, mt: "5px", zIndex: "1051", display: "flex", justifyContent: "flex-end"}}>
                                                {
                                                    !(playing.isPlaying && JSON.stringify(element) === JSON.stringify({Name: song.Name, Singer: song.Singer})) ?
                                                        <Fab sx={{mr: 4}} color="primary" aria-label="play">
                                                            <PlayArrowIcon/>
                                                        </Fab>
                                                        :
                                                        <Fab sx={{mr: 4}} color="primary" aria-label="play">
                                                            <PauseIcon />
                                                        </Fab>
                                                }
                                            </Box>
                                        </li>
                                    ))
                                }
                            </ul>
                        </Box>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        {
                            !isLoading &&
                            <NotFound />
                        }
                    </React.Fragment>
            }
        </DashboardLayout>
    );
};

export default SongListDetail;