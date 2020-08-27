import React, { useState, useEffect } from 'react';
import Tracklist from '../Tracklist/Tracklist';
import { Grid, IconButton } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SearchField from '../Inputs/SearchField';
import { useQuery, usePaginatedQuery } from 'react-query';
import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';

const UserScreen = ({ userId }) => {
    // searchString and searchFieldValue needed to be split up in order to only change the searchQuery
    // when the search has been triggered, so that the playlist screen won't be shown when changing the search string
    const [searchFieldValue, setSearchFieldValue] = useState('');
    const [searchString, setSearchString] = useState('');
    const [searchOffset, setSearchOffset] = useState(0);
    const [searchEnabled, setSearchEnabled] = useState(false);

    // reset search offset if the search string has been changed
    useEffect(() => {
        setSearchOffset(0);
    }, [searchString]);

    // queries
    const getPlaylist = async (key, userId) => {
        const playlistResponse = await fetch(`/party/playlist?userid=${userId}`);
        // return playlistResponse.json();
        const data = await playlistResponse.json();
        console.log(data);
        return data;
    };
    
    const getSearchResults = async (key, searchString, offset) => {
        const searchResponse = await fetch(`/search?userid=${userId}&searchstring=${searchString}&offset=${offset}`);
        const data = await searchResponse.json();
        console.log(data);
        return data;
        // return await searchResponse.json();
    };

    // react-query hooks
    const playlistQuery = useQuery(['playlist', userId], getPlaylist, { refetchInterval: 10000 , staleTime: 10000 });
    const searchQuery = usePaginatedQuery(['search', searchString, searchOffset], getSearchResults, { enabled: searchEnabled, staleTime: 60000 });

    const search = async () => {
        await setSearchString(searchFieldValue);
        setSearchEnabled(true);
    };

    const resetSearch = () => {
        setSearchString('');
        setSearchFieldValue('');
        setSearchEnabled(false);
    };

    const renderPlaylist = () => {
        if (!playlistQuery.data.error) {
            // check if there is data regarding the currently played song
            const currentlyPlayingTrack = !playlistQuery.data.currentlyPlaying.error ? { 
                                                id: playlistQuery.data.currentlyPlaying.item.id,
                                                isPlaying: playlistQuery.data.currentlyPlaying.is_playing 
                                            } : {};
            return (
                <Grid container>
                    <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                        { searchQuery.resolvedData ? <IconButton onClick={resetSearch}><ArrowBackIosIcon/></IconButton> : null}
                        <SearchField search={search} searchFieldValue={searchFieldValue} setSearchFieldValue={setSearchFieldValue}/>
                    </Grid>
                    <Grid item xs={12}>
                        { searchQuery.resolvedData ? <Tracklist 
                                            userId={userId}
                                            entries={searchQuery.resolvedData.items} 
                                            title="Search Results"
                                            type="search"
                                            refetch={playlistQuery.refetch}
                                            pagination={{ 
                                                setSearchOffset, 
                                                search,
                                                next: searchQuery.resolvedData.next != null,
                                                prev: searchOffset > 0 
                                            }}
                                        /> 
                                        :   
                                        <Tracklist 
                                            userId={userId}
                                            entries={playlistQuery.data.playlist} 
                                            title="Party Playlist"
                                            type="playlist"
                                            refetch={playlistQuery.refetch}
                                            currentlyPlayingTrack={currentlyPlayingTrack}
                                        />}
                    </Grid>
                </Grid>
            )
        } else {
            return playlistQuery.data.error.message;
        }
    };

    return (
        <div>
            {playlistQuery.status === 'loading' && (
                <ProgressIndicator/>
            )}

            {playlistQuery.status === 'error' && (
                <div>Error fetching data</div>
            )}

            {playlistQuery.status === 'success' && (
                renderPlaylist()
            )}
        </div>
        
    )
};

export default UserScreen;
