const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config({ path: ['.env.local', '.env'] });
const app = express();

const { initDB } = require('./models');

// json pars
app.use(express.json());

// cross origin resources
app.use(cors());

// connect routes
const router = require('./routes/router');
const { auth } = require('./middleware/auth');
app.use('/api',auth, router);


initDB().then(() => {
    //server init
    const server = app.listen(process.env.PORT, () => {
        console.log(`Server is running on ${server.address().port}`);
    });
})
