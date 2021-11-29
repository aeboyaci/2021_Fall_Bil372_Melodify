import React, {useEffect, useRef, useState} from 'react';
import DashboardLayout from "../Components/Dashboard/DashboardLayout";
import CustomForm from "../Components/CustomForm";
import {Alert, Box, Button, Grid, Slide, Snackbar} from "@mui/material";
import * as Yup from "yup";
import {usePage} from "../Components/PageContext";
import UploadIcon from '@mui/icons-material/Upload';
import UserHeader from "../Components/UserHeader";
import axios from "axios";
import {useAuth} from "../Components/AuthContext";

const validationSchema = Yup.object({
    Password: Yup.string(),
    RePassword: Yup.string().oneOf([Yup.ref("Password"), null], "Passwords do not match.")
});

const fields = [
    {
        name: "Password",
        label: "Password",
        type: "password"
    },
    {
        name: "RePassword",
        label: "Re-type Password",
        type: "password"
    }
];

// .MuiInputLabel-root
// .MuiInputBase-root

const Profile = () => {
    const [page, setPage] = usePage();

    const [auth, setAuth] = useAuth();
    const profilePicRef = useRef(null);
    const [user, setUser] = useState(null);
    const [snackbar, setSnackbar] = useState(false);

    useEffect(() => {
        setPage("profile");
        axios.get(`http://localhost:3001/api/users/${auth.Username}`, {withCredentials: true}).then((d) => {console.log(d.data); setUser(d.data.results[0]);});
    }, []);

    const updateProfile = () => {
        profilePicRef.current.value = "";
        axios.get(`http://localhost:3001/api/users/${auth.Username}`, {withCredentials: true}).then((d) => {console.log(d.data); setUser(d.data.results[0]); setSnackbar(true);});
    };

    const handleSubmit = (values, {resetForm}) => {
        let formData = new FormData();
        formData.append("ProfilePic", profilePicRef.current.files[0]);
        formData.append("Password", values.Password);
        axios.post("http://localhost:3001/api/user/update", formData, {withCredentials: true}).then((d) => {console.log(d.data); resetForm(); updateProfile();});
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
                    Profile successfully updated.
                </Alert>
            </Snackbar>
            {
                user &&
                <React.Fragment>
                    <Grid container className={"shadow"} sx={{height: "192px", p: 3, bgcolor: "#181818"}}>
                        <UserHeader user={user} />
                    </Grid>
                    <Box className={"shadow"} sx={{mt: 2, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#181818", p: 3}}>
                        <Grid xs={12} sm={6}>
                            <input ref={profilePicRef} type={"file"} style={{display: "none"}} accept={".png,.jpg,.jpeg,.webp"} />
                            <p style={{marginBottom: "8px", color: "rgba(255,255,255,0.7)"}}>Profile avatar</p>
                            <Button onClick={() => profilePicRef.current.click()} sx={{mb: 2}}>
                                <UploadIcon />
                                Upload
                            </Button>
                            <CustomForm styled={true} onSubmit={handleSubmit} validationSchema={validationSchema} fields={fields} buttonText={"Update"} initialValues={{Password: "", RePassword: ""}}/>
                        </Grid>
                    </Box>
                </React.Fragment>
            }
        </DashboardLayout>
    );
};

export default Profile;