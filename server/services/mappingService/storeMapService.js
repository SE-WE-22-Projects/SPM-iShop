const express = require("express");

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getStoreMap = async (req, res) => {
    res.status(200).json({});
}

module.exports = { getStoreMap }