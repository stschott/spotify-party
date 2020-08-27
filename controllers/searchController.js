const { spotifyGetQuery, withRefresh } = require('../helpers/spotifyQueryHelper');
const { findOneParty } = require('../helpers/dbHelper');
const { ErrorHandler } = require('../helpers/ErrorHandler');

const search_index = async (req, res, next) => {
    if (!req.query.searchstring) {
        // searchstring missing as query parameter
        throw new ErrorHandler(400, 'No search string provided');
    }
    if (!req.query.userid) {
        // userid missing as query parameter
        throw new ErrorHandler(400, 'No user id provided');
    }

    try {
        const offset = req.query.offset ?? '0';
        const searchString = req.query.searchstring;
        const party = await findOneParty({ userId: req.query.userid });

        if (!party) {
            throw new ErrorHandler(404, 'Party not found');
        }
        
        const accessToken = party.accessToken;
        const refreshToken = party.refreshToken;

        const searchQueryUrl = 'https://api.spotify.com/v1/search?';
        const queryParams = new URLSearchParams({
            type: 'track',
            limit: 20,
            offset,
            q: searchString
        });
        
        const searchQuery = `${searchQueryUrl}${queryParams}`;
        const searchData = await withRefresh((at) => spotifyGetQuery(searchQuery, at), accessToken, refreshToken);

        res.json(searchData.tracks);

    } catch (err) {
        console.log(err);
        next(err);
    }
    
};

module.exports = {
    search_index
}