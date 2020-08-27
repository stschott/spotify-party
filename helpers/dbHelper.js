const SpotifyParty = require('../models/spotifyParty');

const findOneParty = async (searchQuery) => {
    const party = await SpotifyParty.findOne(searchQuery);

    return party;
};

module.exports = {
    findOneParty
}