import React from 'react';
import { Button, makeStyles, Typography, Paper } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import TextFieldWithCopy from '../Inputs/TextFieldWithCopy';
import { URL } from '../../config/config';


const useStyles = makeStyles({
    root: {
        maxWidth: '700px',
        margin: '50px auto',
    },
    paper: {
        padding: '30px'
    },
    text: {
        marginBottom: '20px'
    },
    infoText: {
        marginTop: '5px'
    }
});

const OwnerScreen = ({userId, history, match}) => {
    const classes = useStyles();
    

    const closeParty = () => {
        fetch(`/party?ownerid=${match.params.id}`, { method: 'DELETE' });
        history.push('/');
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Typography variant="h5" className={classes.text}>A playlist named <b>Party-{match.params.id}</b> has been created on your Spotify-Account!</Typography>
                <Typography variant="h5">Copy this link and <b>share</b> it with your friends. They will be able to add songs to the playlist!</Typography>
                <TextFieldWithCopy value={`${URL}/${userId}`}/>
                <Button 
                    variant="contained"
                    color="secondary"
                    onClick={closeParty}
                >
                    Close Party
                </Button>
                <Typography variant="body2" className={classes.infoText}>Your party will be automatically closed after 12 hours.</Typography>
            </Paper>
        </div>
    )
};

export default withRouter(OwnerScreen);
