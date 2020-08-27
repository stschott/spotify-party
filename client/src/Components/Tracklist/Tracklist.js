import React from 'react';
import useWindowDimensions from '../../customHooks/useWindowDimensions';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, 
       makeStyles, Typography, Paper, Toolbar } from '@material-ui/core';
import AddButton from '../Buttons/AddButton';
import RefreshButton from '../Buttons/RefreshButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import TracklistPagination from './TracklistPagination';

const useStyles = makeStyles({
    root: {
        maxHeight: '80vh'
    },
    toolbar: {
        backgroundColor: '#fafafa',
        borderRadius: '4px'
    },
    refreshButton: {
        marginLeft: 'auto'
    }
});

const Tracklist = ({entries, title, type, userId, refetch, currentlyPlayingTrack, pagination}) => {
    const classes = useStyles();
    const iconThreshold = 700;
    const { width } = useWindowDimensions();
    

    const renderPlayingState = () => {
        if (currentlyPlayingTrack.isPlaying) {
            return <PlayArrowIcon fontSize="large"/>;
        } else {
            return <PauseIcon fontSize="large"/>;
        }
    };

    const renderEntries = () => {
        return (
            entries.map((entry, idx) => {
                const fixedEntry = entry.track ? entry.track : entry;
                return (
                    <TableRow key={idx}>
                        { width >= iconThreshold && <TableCell><img src={fixedEntry.album.images[2].url}/></TableCell> }
                        <TableCell>{fixedEntry.name}</TableCell>
                        <TableCell>{fixedEntry.artists.map(artist => artist.name).join(', ')}</TableCell>
                        <TableCell>
                            {type === 'search' &&
                                <AddButton userId={userId} trackUri={entry.uri} refetch={refetch}/>}
                            {type === 'playlist' && fixedEntry.id === currentlyPlayingTrack.id &&
                                renderPlayingState()}
                        </TableCell>
                    </TableRow>
                )
            })
        )
    };

    return (
        <Paper>
            <Toolbar className={classes.toolbar}>
                <Typography variant="h5">
                    {title}
                </Typography>
                {type === 'playlist' && <RefreshButton refetch={refetch} className={classes.refreshButton}/>}
            </Toolbar>
            <TableContainer className={classes.root}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            { width >= iconThreshold && <TableCell></TableCell>}
                            <TableCell><Typography varaint="subtitle1">Title</Typography></TableCell>
                            <TableCell><Typography varaint="subtitle1">Artist</Typography></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderEntries()}
                    </TableBody>
                </Table>
            </TableContainer>
            {type === 'search' && <TracklistPagination pagination={pagination}/>}
        </Paper>
    )
};

export default Tracklist;