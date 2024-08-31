const express = require("express");


/**
 * Handles exceptions thrown by routes
 * @returns {express.ErrorRequestHandler}
 */
function errorHandler() {
    /**
     * @param {Error} err 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {any} next 
     */
    return function errorHandler(err, req, res, next) {
        console.error();
        console.error(`An exception was thrown while handling route ${req.method} ${req.url}`)
        console.error(err);
        if (!res.headersSent) {
            res.status(500).send("An internal error occurred while handling request");
        }
    }
}

module.exports = errorHandler;