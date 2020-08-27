import React from 'react';
import { Toolbar, IconButton, makeStyles } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';


const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
});

const TracklistPagination = ({ pagination }) => {
    const classes = useStyles();

    const handleNextClick = async () => {
        await pagination.setSearchOffset(prevValue => prevValue + 20);
        pagination.search();
    };

    const handlePrevClick = async () => {
        await pagination.setSearchOffset(prevValue => prevValue - 20);
        pagination.search();
    };

    return (
        <Toolbar className={classes.root}> 
            <IconButton disabled={!pagination.prev} onClick={handlePrevClick}>
                <ArrowBackIosIcon/>
            </IconButton>
            <IconButton disabled={!pagination.next} onClick={handleNextClick}>
                <ArrowForwardIosIcon/>
            </IconButton>
        </Toolbar>
    )
};

export default TracklistPagination;
