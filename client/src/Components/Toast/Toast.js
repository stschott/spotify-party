import React from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const Toast = ({ active, type, message }) => {

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={active}
        >
            <MuiAlert severity={type}>
                {message}
            </MuiAlert>
        </Snackbar>
    )
};

export default Toast;
