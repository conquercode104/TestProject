import { Box, Button, Paper, TextField } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import axios from "axios";
import React, { useState } from "react";

const Board = styled(Paper)(({theme}) => ({
    color: theme.palette.text.secondary,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    padding: '10px'
}))
function Converter() {
    const [data, setData] = useState({
        keywords: "",
        origin: ""
    });

    const handleConvert = () => {
        axios.post('http://localhost:5000/change',
            {
                keywords: data.keywords,
                origin: data.origin
            }
        )
        .then(res => {
            console.log(res.data.text);
            setData({
                ...data,
                origin: res.data.text
            })
        })
    }

    const changeKeywords = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [evt.target.name]: evt.target.value
        })
    }
    return <Box sx={{display: 'flex', width: '80%', height: '500px'}}>
        <Board elevation={4}>
            <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                    <TextField name="keywords" label="Keywords & Phrases" variant="outlined" id="keywords" fullWidth={true} onChange={changeKeywords}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField name="origin" label="Origin text" variant="outlined" id="origin" multiline={true} minRows={18} fullWidth={true} maxRows={18} onChange={changeKeywords} value={data.origin}/>
                </Grid>
                <Grid item xs={12}>
                    <Button color="primary" variant="contained" fullWidth={true} onClick={handleConvert}>
                        Convert
                    </Button>
                </Grid>
            </Grid>            
        </Board>
    </Box>
}

export default Converter;