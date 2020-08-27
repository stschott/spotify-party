import React, { useContext } from 'react';
import { Tooltip, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import fetch from 'node-fetch';
import { ToastContext } from '../../contexts/ToastContext';

const AddButton = ({ trackUri, userId, refetch }) => {
    const { setToast } = useContext(ToastContext);

    const addTrackToPlaylist = async () => {
        const addStatus = await fetch('/party/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, trackUri })
        });
        
        if (addStatus ?? addStatus.status === 200) {
            refetch();
            setToast({ active: true, type: 'success', message: 'Song has been successfully added'});
        } else {
            setToast({ active: true, type: 'error', message: 'Could not add song to the playlist'});
        }
    };

    return (
        <Tooltip title="Add to Playlist">
            <IconButton onClick={addTrackToPlaylist}>
                <AddIcon/>
            </IconButton>
        </Tooltip>
    )
};

export default AddButton;
