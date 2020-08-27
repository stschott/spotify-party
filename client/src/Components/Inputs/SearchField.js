import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton, makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';


const useStyles = makeStyles({
    textField: {
        width: '100%',
        marginTop: '20px',
        marginBottom: '20px'
    }
})

const SearchField = ({search, searchFieldValue, setSearchFieldValue}) => {
    const classes = useStyles();

    const handleChange = event => {
        setSearchFieldValue(event.target.value);
    };

    const triggerSearch = () => {
        if (searchFieldValue.trim() !== ''){
            search();
        }
    };

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            triggerSearch();
        }
    };

    return (
        <TextField
            variant="outlined"
            InputProps={{ endAdornment: <InputAdornment position="end">
                                            <IconButton onClick={triggerSearch}><SearchIcon/></IconButton>
                                        </InputAdornment>  
                        }}
            value={searchFieldValue}
            onChange={handleChange}
            className={classes.textField}
            placeholder="Search for a song to add"
            onKeyPress={handleKeyPress}
        />
    )
};

export default SearchField;
