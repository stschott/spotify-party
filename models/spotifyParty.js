const mongoose = require('mongoose');
const shortid = require('shortid');

const SpotifyPartySchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true,
        default: shortid.generate
    },
    userId: {
        type: String,
        required: true
    },
    playlistId: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    expire_at: {
        type: Date,
        default: Date.now,
        expires: 43200
    }
});

module.exports = mongoose.model('spotifyParty', SpotifyPartySchema);