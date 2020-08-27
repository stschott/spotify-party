const SpotifyParty = require('../models/spotifyParty');
const shortid = require('shortid');
const { spotifyAuthQuery, spotifyGetQuery, spotifyPostQuery, withRefresh } = require('../helpers/spotifyQueryHelper');
const { findOneParty } = require('../helpers/dbHelper');
const { ErrorHandler } = require('../helpers/ErrorHandler');

const party_delete = async (req, res, next) => {
    try {
        await SpotifyParty.findOneAndDelete({ ownerId: req.query.ownerid });
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        next(err);
        // res.sendStatus(504).json({ error: { message: 'Error during party deletion' }});
    }
};

const party_create = async (req, res, next) => {
    try {
        if (!req.query.code) {
            throw new ErrorHandler(400, 'No authentication code provided');
            // res.status(400).json({ error: { message: 'No authentication code provided' } });
            // return;
        }

        const ownerId = await authenticateAndCreatePartyPlaylist(req.query.code);
        res.json({ ownerId });
    } catch (err) {
        console.log(err);
        next(err);
        // res.status(504).json({ error: { message: 'Error during authentication' }});
    }
};

const party_playlist = async (req, res, next) => {
    try {
        if (!req.query.userid) {
            // userid missing as query parameter
            throw new ErrorHandler(400, 'No user id provided');
            // res.status(400).json({ error: { message: 'No userid provided' } });
            // return;
        }

        const party = await findOneParty({ userId: req.query.userid });

        if (!party) {
            throw new ErrorHandler(404, 'Party not found');
            // res.status(404).json(party.error.message);
            // return;
        }
        const playlistId = party.playlistId;
        const accessToken = party.accessToken;
        const refreshToken = party.refreshToken;

        const getPlaylistQuery = `https://api.spotify.com/v1/playlists/${playlistId}?limit=999`;
        const playlistData = await withRefresh((at) => spotifyGetQuery(getPlaylistQuery, at), accessToken, refreshToken);
        
        const currentlyPlayingSongQuery = 'https://api.spotify.com/v1/me/player/currently-playing';
        const currentlyPlayingData = await withRefresh((at) => spotifyGetQuery(currentlyPlayingSongQuery, at), accessToken, refreshToken);
        
        if (!playlistData || playlistData.error) {
            throw new ErrorHandler(504, 'Playlist not found');
            // res.status(504).json(playlistData);
            // return;
        }
        res.json({ playlist: playlistData.tracks.items, currentlyPlaying: currentlyPlayingData });
    } catch (err) {
        console.log(err);
        next(err);
        // res.status(504).json({ error: { message: 'Error during playlist request' }});
    }
};

const party_add_post = async (req, res, next) => {
    try {
        if (!req.body.userId) {
            // res.status(400).json({ error: { message: 'userId is missing' }});
            // return;
            throw new ErrorHandler(400, 'No user id provided');
        }
        if (!req.body.trackUri) {
            // res.status(400).json({ error: { message: 'track uri is missing' }});
            // return;
            throw new ErrorHandler(400, 'No track uri provided');
        }
        const party = await findOneParty({ userId: req.body.userId });

        if (!party) {
            // res.status(404).json(party.error.message);
            // return;
            throw new ErrorHandler(404, 'Party not found');
        }
        const playlistId = party.playlistId;
        const accessToken = party.accessToken;
        const refreshToken = party.refreshToken;

        const addToPlaylistQuery = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        const queryPayload = { uris: [req.body.trackUri] };
        const addingStatus = await withRefresh((at) => spotifyPostQuery(addToPlaylistQuery, at, queryPayload), accessToken, refreshToken);
        
        if (addingStatus && !addingStatus.error) {
            res.sendStatus(200);
        } else {
            res.sendStatus(504);
        }

    } catch (err) {
        next(err);
    }
};


async function authenticateAndCreatePartyPlaylist(authCode) {
    // authenticate and obtain access and refresh token
    const authQueryUrl = 'https://accounts.spotify.com/api/token';
    const authData = await spotifyAuthQuery(authQueryUrl, 'access', authCode);

    const accessToken = authData.access_token;
    const refreshToken = authData.refresh_token;

    // get current user id
    const userQueryUrl = 'https://api.spotify.com/v1/me';
    const userData = await spotifyGetQuery(userQueryUrl, accessToken);
    const userId = userData.id;

    // generate an ID for the playlist name which is also used as the access id for users
    const generatedId = shortid.generate();
    const playlistName = `Party-${generatedId}`;

    // create new party playlist
    const createPlaylistQueryUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
    const createPlaylistQueryPayload = { name: playlistName };
    const playlistData = await spotifyPostQuery(createPlaylistQueryUrl, accessToken, createPlaylistQueryPayload);
    const playlistId = playlistData.id;

    // create and store a spotifyParty in the database
    const spotifyParty = new SpotifyParty({ accessToken, refreshToken, userId: generatedId, playlistId });
    await spotifyParty.save();

    return spotifyParty.ownerId;    
}


module.exports = {
    party_delete,
    party_create,
    party_playlist,
    party_add_post
}