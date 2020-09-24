const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cors = require('cors');

const middlewares = require('./middlewares');

require('dotenv').config();

const homeRouter = require('./routes/homeRoutes');
const partyRouter = require('./routes/partyRoutes');
const searchRouter = require('./routes/searchRoutes');

const SpotifyParty = require('./models/spotifyParty');

// rate limit config
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const app = express();
app.set('trust proxy', 1);

// connect to mongodb
mongoose.connect(process.env.DATBASE_URL, { 
        useUnifiedTopology: true, 
        useNewUrlParser: true, 
        useCreateIndex: true, 
        useFindAndModify: false 
    }, 
    () => app.listen(process.env.PORT || 3001));

// middleware
// app.use(morgan('dev'));
app.use(helmet());
app.use(limiter);
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));
app.use(express.json());

// routers
app.use('/party', partyRouter);
app.use('/search', searchRouter);
app.use('/', homeRouter);

// Not found
app.use(middlewares.notFound);

// Error handler
app.use(middlewares.errorHandler);


