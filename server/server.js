const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();

const { initDB } = require('./models');

// json pars
app.use(express.json());

// cross origin resources
app.use(cors());

// connect routes
const router = require('./routes/router');
app.use('/api', router);


initDB().then(() => {
    //server init
    const server = app.listen(process.env.PORT, () => {
        console.log(`Server is running on ${server.address().port}`);
    });
})
