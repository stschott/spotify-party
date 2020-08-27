const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

require('dotenv').config();

const homeRouter = require('./routes/homeRoutes');
const partyRouter = require('./routes/partyRoutes');
const searchRouter = require('./routes/searchRoutes');

const SpotifyParty = require('./models/spotifyParty');
const { handleError } = require('./helpers/ErrorHandler');

// rate limit config
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const app = express();
app.set('trust proxy', 1);

// connect to mongodb
const dbConnection = 'mongodb+srv://stefan:node192@cluster0.v3q7h.mongodb.net/spotify-party';
mongoose.connect(dbConnection, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }, 
    () => app.listen(process.env.PORT || 3001));

// middleware
// app.use(morgan('dev'));
app.use(helmet());
app.use(limiter);
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// routers
app.use('/party', partyRouter);
app.use('/search', searchRouter);
app.use('/', homeRouter);

// Error handler
app.use((err, req, res, next) => {
    handleError(err, res);
});


