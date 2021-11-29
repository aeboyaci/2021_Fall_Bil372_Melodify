import React from 'react';
import {Box, Grid, Typography} from "@mui/material";
import {Link, useHistory} from "react-router-dom";
import * as Yup from "yup";
import CustomForm from "../Components/CustomForm";
import axios from "axios";

const validationSchema = Yup.object({
    UserType: Yup.string().required("User type cannot be empty."),
    Email: Yup.string().required("E-mail address cannot be empty.").email("Invalid e-mail format."),
    Username: Yup.string().required("Username cannot be empty."),
    Password: Yup.string().required("Password cannot be empty").min(8, "Length must be at least 8."),
    RePassword: Yup.string().required("Password confirmation cannot be empty").oneOf([Yup.ref("Password"), null], "Passwords do not match.")
});

const fields = [
    {
        name: "UserType",
        label: "User Type",
        type: "dropdown",
        items: [
            "Creator",
            "Consumer"
        ]
    },
    {
        name: "Email",
        label: "E-mail Address",
        type: "text"
    },
    {
        name: "Username",
        label: "Username",
        type: "text"
    },
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
]

const Register = () => {
    const history = useHistory();

    const handleSubmit = (values, {resetForm}) => {
        axios.post("http://localhost:3001/api/account/register", {...values}, {withCredentials: true}).then((d) => {
            console.log(d.data);
            history.push("/account/login");
            resetForm();
        });
    };

    return (
        <Grid container sx={{height: "100vh", width: "100%"}} justifyContent={"center"} alignItems={"center"}>
            <Grid item display={"flex"} flexDirection={"column"} xs={12} sm={6} justifyContent={"center"} alignItems={"center"}>
                <Grid item xs={12} sm={6} sx={{pb: 8, px: 2}}>
                    <Typography textAlign={"center"} sx={{mb: 4}} variant={"h3"}>Register</Typography>
                    <CustomForm onSubmit={handleSubmit} validationSchema={validationSchema} fields={fields} buttonText={"Register"} initialValues={{UserType: "", Email: "", Username: "", Password: "", RePassword: ""}} />
                    <Box sx={{mt: 2}}>
                        <Typography textAlign={"center"}>Already have an account? <Link to={"/account/login"} style={{textDecoration: "none", color: "#1DB954"}}>Login</Link></Typography>
                    </Box>
                </Grid>
            </Grid>
            <Box display={"flex"} alignItems={"center"} sx={{mb: 4, position: "absolute", bottom: 0}}>
                <svg fill={"#1DB954"} style={{marginRight: "8px"}} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M12 9c-3.865 0-7 3.134-7 7s3.135 7 7 7 7-3.134 7-7-3.135-7-7-7zm.067 11.026l-1.546-1.546c.396-.396.943-.641 1.546-.641.604 0 1.151.245 1.546.641l-1.546 1.546zm2.262-2.259c-.58-.578-1.379-.936-2.262-.936-.881 0-1.681.358-2.26.936l-.951-.95c.823-.822 1.958-1.331 3.211-1.331s2.389.508 3.21 1.331l-.948.95zm1.663-1.665c-1.005-1.004-2.392-1.625-3.925-1.625-1.532 0-2.919.621-3.924 1.625l-.977-.975c1.256-1.254 2.987-2.03 4.9-2.03 1.914 0 3.646.775 4.901 2.03l-.975.975zm-11.476 4.898c-2.951-.61-4.516-3.09-4.516-5.5 0-2.615 1.731-5.198 5.283-5.5-1.415 1.591-2.283 3.708-2.283 6 0 1.782.618 3.6 1.516 5zm19.484-5.5c0 2.409-1.55 4.889-4.5 5.5.897-1.4 1.5-3.218 1.5-5 0-2.292-.868-4.409-2.283-6 3.552.303 5.283 2.886 5.283 5.5zm-5.074-7.487c.942.084 1.782.294 2.529.601-1.27-4.388-4.666-7.614-9.455-7.614-4.786 0-8.173 3.225-9.442 7.607.744-.303 1.582-.512 2.52-.595 1.347-2.538 3.842-4.04 6.922-4.034 3.081-.006 5.578 1.496 6.926 4.035z"/></svg>
                <Typography color={"primary"} variant={"h4"}>
                    Melodify
                </Typography>
            </Box>
        </Grid>
    );
};

export default Register;