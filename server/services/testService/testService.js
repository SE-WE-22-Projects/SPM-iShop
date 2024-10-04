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

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const send204 = async (req, res) => {
    res.sendStatus(204);
}


module.exports = {
    testService, send204
};
