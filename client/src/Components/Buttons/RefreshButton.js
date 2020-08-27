import React from 'react';
import { IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

const RefreshButton = ({ refetch, className }) => {

    return (
        <IconButton onClick={refetch} className={className}>
            <RefreshIcon/>
        </IconButton>
    )
};

export default RefreshButton;
