import React, { useRef, useContext } from 'react';
import { TextField, InputAdornment, IconButton, Tooltip,  makeStyles } from '@material-ui/core'; 
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { ToastContext } from '../../contexts/ToastContext';

const useStyles = makeStyles({
    userLink: {
        margin: '50px 0',
        width: '100%'
    }
})

const TextFieldWithCopy = ({value}) => {
    const { setToast } = useContext(ToastContext);
    const textFieldRef = useRef(null);
    const classes = useStyles();

    const copyLink = event => {
        textFieldRef.current.select();
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        setToast({ active: true, type: 'info', message: 'Link has been copied' });
    };

    return (
        <TextField
            variant="outlined"
            InputProps={{ readOnly: true, endAdornment: <InputAdornment position="end">
                                                            <Tooltip title="Copy link">
                                                                <IconButton onClick={copyLink}>
                                                                    <FileCopyIcon/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </InputAdornment>  
                        }}
            value={value}
            className={classes.userLink}
            inputRef={textFieldRef}
        />
    )
};

export default TextFieldWithCopy;
