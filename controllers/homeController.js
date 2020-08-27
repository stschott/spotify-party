const { findOneParty } = require('../helpers/dbHelper');
const { ErrorHandler } = require('../helpers/ErrorHandler');

const home_index = async (req, res, next) => {
    try {
        const spotifyPartyOwner = await findOneParty({ ownerId: req.params.id });
        const spotifyPartyUser = await findOneParty({ userId: req.params.id });
        if (spotifyPartyOwner && !spotifyPartyOwner.error) {
            res.json({ owner: true, userId: spotifyPartyOwner.userId });
        } else if (spotifyPartyUser && !spotifyPartyUser.error) {
            res.json({ owner: false, userId: spotifyPartyUser.userId });
        } else {
            throw new ErrorHandler(404, 'Invalid ID');
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
};


module.exports = {
    home_index
}