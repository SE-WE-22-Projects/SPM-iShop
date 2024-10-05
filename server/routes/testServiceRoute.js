const express = require("express");
const router = express.Router();

const testService = require('../services/testService/testService');


router.get('/test', testService.testService);
router.get('/204', testService.send204)


module.exports = router;
