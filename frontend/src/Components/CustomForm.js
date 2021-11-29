import React, {useState} from 'react';
import {Formik, Form} from "formik";
import {Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import PropTypes from 'prop-types';
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles({
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

const CustomForm = ({ fields, buttonText,initialValues, onSubmit, validationSchema, styled }) => {
    const styles = useStyles();
    const [dynamicData, setDynamicData] = useState([]);
    console.log(dynamicData);

    return (
        <React.Fragment>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                {({values, touched, errors, handleChange, handleBlur, handleSubmit}) => (
                    <Form onSubmit={handleSubmit}>
                        {
                            fields.map((field) => {
                                if (field.type === "dropdown")
                                    return (
                                        <FormControl className={styled && styles.root} sx={{mb: 2}} fullWidth={true} error={touched[field.name] && Boolean(errors[field.name])}>
                                            <InputLabel id="table-select-label">{field.label}</InputLabel>
                                            <Select
                                                labelId="table-select-label"
                                                id="table-select"
                                                value={values[field.name] || ""}
                                                name={field.name}
                                                label={field.label}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            >
                                                {
                                                    field.items.map((d) => (
                                                        <MenuItem key={d} value={d  || ""}>{d}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                            <FormHelperText>{touched[field.name] && errors[field.name]}</FormHelperText>
                                        </FormControl>
                                    )
                                else if (field.type === "dynamic")
                                    return (
                                        <FormControl className={styled && styles.root} sx={{mb: 2}} fullWidth={true} error={touched[field.name] && Boolean(errors[field.name])}>
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
                                                    setDynamicData(result);
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
                                    )
                                else
                                    return (
                                        <TextField
                                            className={styled && styles.root}
                                            label={field.label}
                                            name={field.name}
                                            type={field.type}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched[field.name] && Boolean(errors[field.name])}
                                            helperText={touched[field.name] && errors[field.name]}
                                            fullWidth={true}
                                            sx={{mb: 2}}
                                            autoComplete={"off"}
                                            key={field.name}
                                            value={values[field.name]}
                                        />
                                    )
                            })
                        }
                        <Button type={"submit"} sx={{py: "10px", borderRadius: "50px", color: "#fff"}} fullWidth={true} variant={"contained"}>{buttonText}</Button>
                    </Form>
                )}
            </Formik>
        </React.Fragment>
    );
};
CustomForm.propTypes = {
    fields: PropTypes.array.isRequired,
    buttonText: PropTypes.string.isRequired,
    initialValues: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    validationSchema: PropTypes.object.isRequired
}

export default CustomForm;