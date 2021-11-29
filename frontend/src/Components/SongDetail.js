import React, {useEffect, useState} from 'react';
import DashboardLayout from "./Dashboard/DashboardLayout";
import {Box, Button, Dialog, DialogContent, DialogTitle, Fab, Grid, IconButton} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {usePage} from "./PageContext";
import {useParams} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CustomForm from "./CustomForm";
import * as Yup from "yup";
import {makeStyles} from "@mui/styles";
import FavoriteIcon from '@mui/icons-material/Favorite';
import Comment from "./Comment";
import {usePlayer} from "./PlayAudioContext";
import PauseIcon from "@mui/icons-material/Pause";
import axios from "axios";
import NotFound from "./NotFound";

const validationSchema = Yup.object({
    Content: Yup.string().required("Comment cannot be empty").max(255, "Max length is 255.")
});

const fields = [
    {
        name: "Content",
        label: "Comment",
        type: "text"
    }
];

const SongDetail = () => {
    const [page, setPage] = usePage();
    const [playing, element, togglePlay] = usePlayer();

    const {RecordID} = useParams();
    const [song, setSong] = useState(null);
    const [comments, setComments] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    console.log(isLiked);

    const fetchComments = () => {
        axios.get("http://localhost:3001/api/songs/" + RecordID + "/comments", {withCredentials: true}).then((d) => {console.log(d); setComments(d.data.results);});
    };
    const changeLike = () => {
        if (isLiked) {
            axios.post("http://localhost:3001/api/unlike", {RecordID}, {withCredentials: true}).then((d) => {console.log(d); setIsLiked(false);});
        }
        else {
            axios.post("http://localhost:3001/api/like", {RecordID}, {withCredentials: true}).then((d) => {console.log(d); setIsLiked(true);});
        }
    };

    useEffect(() => {
        setPage("search");
        axios.get("http://localhost:3001/api/songs/" + RecordID, {withCredentials: true}).then((d) => {console.log(d); setSong(d.data.results[0]);});
        fetchComments();
        axios.get("http://localhost:3001/api/songs/is-liked/" + RecordID, {withCredentials: true}).then((d) => {console.log(d); setIsLiked(d.data.results); setIsLoading(false)});
    }, []);

    const handleSubmit = (values, {resetForm}) => {
        axios.post("http://localhost:3001/api/comment", {RecordID, Content: values.Content}, {withCredentials: true}).then((d) => {console.log(d); fetchComments(); resetForm();});
    };

    return (
        <DashboardLayout>
            {
                song ?
                    <React.Fragment>
                        <Grid container wrap={"nowrap"} className={"shadow"} sx={{p: 3, height: "256px", bgcolor: "#181818"}}>
                            <img height={"100%"} width={"auto"} src={song.RecordPic} alt={"..."} />
                            <Box display={"flex"} justifyContent={"space-between"} width={"100%"}>
                                <Box display={"flex"} flexDirection={"column"} justifyContent={"space-between"} sx={{p: 3, maxWidth: "100%"}}>
                                    <Box>
                                        <h1 style={{marginBottom: "16px"}}>{song.Name}</h1>
                                    </Box>
                                    <Box display={"flex"}>
                                        <Box sx={{mr: 3}}>
                                            <p style={{opacity: "0.8", fontWeight: "bolder", margin: 0, marginBottom: "4px"}}>Singer</p>
                                            <p style={{opacity: "0.7"}}>{song.Singer}</p>
                                        </Box>
                                        <Box sx={{mr: 3}}>
                                            <p style={{opacity: "0.8", fontWeight: "bolder", margin: 0, marginBottom: "4px"}}>Publish Date</p>
                                            <p style={{opacity: "0.7"}}>
                                                {new Date(Date.parse(song.PublishDate)).toLocaleString("tr").replaceAll(".", "/").split(" ")[0]}
                                            </p>
                                        </Box>
                                        <Box>
                                            <p style={{opacity: "0.8", fontWeight: "bolder", margin: 0, marginBottom: "4px"}}>Genre</p>
                                            <p style={{opacity: "0.7"}}>
                                                {song.G_NAME}
                                            </p>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box display={"flex"} alignItems={"center"}>
                                    <Fab onClick={() => changeLike()} sx={{mr: 4}} color="primary" aria-label="fav">
                                        <FavoriteIcon sx={{color: isLiked ? "white" : ""}} />
                                    </Fab>
                                    <Box onClick={() => {togglePlay({Name: song.Name, Singer: song.Name}, `http://localhost:3001/api/record-file/${song.RecordID}`); axios.post(`http://localhost:3001/api/played-songs`, {RecordID}, {withCredentials: true}).then((d) => {console.log(d.data)});}}>
                                        {
                                            !(playing.isPlaying && JSON.stringify(element) === JSON.stringify({Name: song.Name, Singer: song.Name})) ?
                                                <Fab sx={{mr: 2}} color="primary" aria-label="play">
                                                    <PlayArrowIcon/>
                                                </Fab>
                                                :
                                                <Fab sx={{mr: 2}} color="primary" aria-label="play">
                                                    <PauseIcon />
                                                </Fab>
                                        }
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        {
                            song.Content &&
                            <Box sx={{mt: 2}}>
                                <Box className={"shadow"} sx={{bgcolor: "#181818", width: "100%", p: 3}}>
                                    <h4>Lyrics</h4>
                                    <p style={{textAlign: "justify", margin: 0}}>
                                        {song.Content}
                                    </p>
                                </Box>
                            </Box>
                        }
                        <Box sx={{mt: 1}}>
                            <Box className={"shadow"} sx={{display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#181818", height: "160px", width: "100%", p: 3}}>
                                <Grid xs={6}>
                                    <CustomForm styled={true} buttonText={"Publish"} fields={fields} onSubmit={handleSubmit} validationSchema={validationSchema} initialValues={{Content: ""}} />
                                </Grid>
                            </Box>
                            {
                                comments.length > 0 && comments.map((comment) => (
                                    <Comment {...comment} />
                                ))
                            }
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

export default SongDetail;