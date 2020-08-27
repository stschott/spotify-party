const fetch = require('node-fetch');
const SpotifyParty = require('../models/spotifyParty');

const redirectUri = 'http://localhost:3000/create';
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const spotifyAuthQuery = async (queryUrl, type, token) => {
    let authData = new URLSearchParams();
    authData.append('client_id', clientId);
    authData.append('client_secret', clientSecret);

    switch (type) {
        case 'access':      authData.append('grant_type', 'authorization_code');
                            authData.append('code', token);
                            authData.append('redirect_uri', redirectUri);
                            break;
        case 'refresh':     authData.append('grant_type', 'refresh_token');
                            authData.append('refresh_token', token);
                            break;
    }
    
    const response = await fetch(queryUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: authData
    });
    return await response.json();
};

const spotifyGetQuery = async (queryUrl, accessToken) => {
    const response = await fetch(queryUrl, {
        headers: {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    if (response.status === 204){
        return { error: { message: 'no payload' } };
    }
    return await response.json();
};

const spotifyPostQuery = async (queryUrl, accessToken, payload) => {
    const response = await fetch(queryUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    return await response.json();
};

const withRefresh = async (queryFunction, accessToken, refreshToken) => {
    let queryData = await queryFunction(accessToken);

    if (queryData.error && queryData.error.message === 'The access token expired'){
        newAccessToken = await refreshAccessToken(refreshToken);
        console.log('token refreshed');
        queryData = await queryFunction(newAccessToken);
        console.log('new query data ', queryData);
    }
    return queryData;
}

async function refreshAccessToken (refreshToken) {
    const refreshQueryUrl = 'https://accounts.spotify.com/api/token';

    const refreshData = await spotifyAuthQuery(refreshQueryUrl, 'refresh', refreshToken);
    if (refreshData.access_token) {
        await SpotifyParty.findOneAndUpdate({ refreshToken }, { $set: { accessToken: refreshData.access_token }});
        return refreshData.access_token;
    }
    return null;
}

module.exports = {
    spotifyAuthQuery,
    spotifyGetQuery,
    spotifyPostQuery,
    withRefresh
}