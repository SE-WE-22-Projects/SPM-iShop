const express = require("express");

// use this end point for testing purposes

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const testService = async (req, res) => {
    console.log("test service working");
    res.sendStatus(200);
}

module.exports = {
    testService
};