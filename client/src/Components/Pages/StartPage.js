import React from 'react';
import { Container, Button, makeStyles, Typography } from '@material-ui/core';
import { URL, CLIENT_ID, SCOPE } from '../../config/config';

const useStyles = makeStyles({
    root: {
        marginTop: '50px',
        display: 'flex',
        textAlign: 'left',
        flexDirection: 'row'
    },
    textContainer: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    startButton: {
        margin: '50px auto'
    },
    heading: {
        marginBottom: '20px'
    }
})

const StartPage = () => {
    const classes = useStyles();

    const authenticate = () => {
        const queryBase = 'https://accounts.spotify.com/authorize?';
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            redirect_uri: `${URL}/create`,
            response_type: 'code',
            state: '231',
            scope: SCOPE
        });
        
        const query = `${queryBase}${params}`;
        window.location.href = query;
    };

    return (
        <Container className={classes.root}>
            <div className={classes.textContainer}>
                <Typography variant="h1" className={classes.heading}>Spotify-Party</Typography>
                <Typography variant="h3">Create a Spotify Party-Playlist.</Typography>
                <Typography variant="h3">Your friends will be able to add songs to it!</Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={authenticate}
                    className={classes.startButton}
                >
                    Start Party
                </Button>
            </div>
        </Container>
    )
};

export default StartPage;
