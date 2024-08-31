const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();

// json pars
app.use(express.json());

// cross origin resources
app.use(cors());

//server init
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${server.address().port}`);
});