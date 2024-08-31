const express = require("express");
const router = express.Router();

const testService = require('../services/testService/testService');


router.get('/test',testService.testService);


module.exports = router;