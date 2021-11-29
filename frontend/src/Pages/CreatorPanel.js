import React, {useEffect, useRef, useState} from 'react';
import DashboardLayout from "../Components/Dashboard/DashboardLayout";
import {
    Alert,
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Slide,
    Snackbar
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import CustomForm from "../Components/CustomForm";
import * as Yup from "yup";
import {Form, Formik} from "formik";
import {makeStyles} from "@mui/styles";
import axios from "axios";
import {usePage} from "../Components/PageContext";

const songValidationSchema = Yup.object({
    Name: Yup.string().required("Name cannot be empty"),
    Singer: Yup.string().required("Singer cannot be empty"),
    Duration: Yup.string().required("Duration cannot be empty"),
});

const songFields = [
    {
        name: "Name",
        label: "Song Name",
        type: "text"
    },
    {
        name: "Singer",
        label: "Singer",
        type: "text"
    },
    {
        name: "Duration",
        label: "Duration",
        type: "text"
    },
    {
        name: "LyricsContent",
        label: "Lyrics",
        type: "text"
    },
];

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

const CreatorPanel = () => {
    const styles = useStyles();

    const [page, setPage] = usePage();
    useEffect(() => {
        setPage("creator-panel");
    }, []);

    const songFileRef = useRef(null);
    const posterImageRef = useRef(null);
    const [dynamicData, setDynamicData] = useState([]);
    const [genreID, setGenreID] = useState("");
    const [snackbar, setSnackbar] = useState(false);

    const handleSongSubmit = (values, {resetForm}) => {
        let formData = new FormData();
        formData.append("multi", songFileRef.current.files[0]);
        formData.append("multi", posterImageRef.current.files[0]);
        formData.append("GenreID", genreID);
        formData.append("Name", values.Name);
        formData.append("Singer", values.Singer);
        formData.append("Duration", values.Duration);
        formData.append("LyricsContent", values.LyricsContent);

        axios.post("http://localhost:3001/api/songs/create", formData, {withCredentials: true}).then((d) => {console.log(d.data); resetForm(); setSnackbar(true); songFileRef.current.value = ""; posterImageRef.current.value = ""; setGenreID("");})
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
                    Song successfully created.
                </Alert>
            </Snackbar>
            <Box sx={{p: 3, bgcolor: "#181818"}}>
                <h4>Create Song</h4>
                <input ref={songFileRef} type={"file"} style={{display: "none"}} accept={".mp3"} />
                <p style={{marginTop: "16px", marginBottom: "8px", color: "rgba(255,255,255,0.7)"}}>Audio File</p>
                <Button onClick={() => songFileRef.current.click()} sx={{mb: 2}}>
                    <UploadIcon />
                    Upload
                </Button>
                <input ref={posterImageRef} type={"file"} style={{display: "none"}} accept={".png,.jpg,.jpeg,.webp"} />
                <p style={{marginBottom: "8px", color: "rgba(255,255,255,0.7)"}}>Poster Image</p>
                <Button onClick={() => posterImageRef.current.click()} sx={{mb: 2}}>
                    <UploadIcon />
                    Upload
                </Button>
                <FormControl className={styles.root} sx={{mb: 2}} fullWidth={true}>
                    <InputLabel id="table-select-label">Genre</InputLabel>
                    <Select
                        labelId="table-select-label"
                        id="table-select"
                        value={genreID || ""}
                        name={"GenreID"}
                        label={"Genre"}
                        onChange={(e) => setGenreID(e.target.value)}
                        onFocus={async () => {
                            let response = await fetch("http://localhost:3001/api/genres");
                            let result = await response.json();
                            setDynamicData(result.results);
                        }}
                    >
                        {
                            dynamicData.length > 0 && dynamicData.map((d) => (
                                <MenuItem style={{color: "rgba(255,255,255,0.7)"}} key={d.Name} value={d.GenreID  || ""}>{d.Name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <CustomForm styled={true} buttonText={"Create"} fields={songFields} onSubmit={handleSongSubmit} validationSchema={songValidationSchema} initialValues={{Name: "", Singer: "", Duration: "", LyricsContent: ""}} />
            </Box>
        </DashboardLayout>
    );
};

export default CreatorPanel;