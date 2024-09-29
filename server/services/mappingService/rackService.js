const express = require("express");
const Rack = require("../../models/Rack");
const yup = require('yup');


const rackSchema = yup.object({
    name: yup.string(),
})

/**
 * Create a new rack.
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const createRack = async (req, res) => {

    var rackData;
    try {
        rackData = await rackSchema.validate(req.body);
    } catch (e) {
        console.error("bad request", e);
        res.status(400).send({ msg: "bad request" });
        return;
    }

    try {
        var rack = await Rack.create(rackData);
        res.status(200).json({ data: rack });
    }
    catch (e) {
        console.error("Error in database operation", e);
        res.status(500).send({ msg: "Error in DB operation" });
        return;
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getAllRacks = async (req, res) => {
    try {
        var rackList = await Rack.findAll();
        res.status(200).json(rackList);
    }
    catch (e) {
        console.error("Error in database operation", e);
        res.status(500).send({ msg: "Error in DB operation" });
        return;
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getRackById = async (req, res) => {
    const rackId = Number.parseInt(req.params.rid);

    // check if rack id is valid
    if (!Number.isInteger(rackId)) {
        res.status(400).json({ msg: "Invalid rack ID" });
        return;
    }

    try {
        var rack = await Rack.findOne({ where: { id: rackId } });
        if (!rack) {
            res.status(404).send({ msg: "Rack not found" });
        } else {
            res.status(200).json({ data: rack });
        }
    }
    catch (e) {
        console.error("Error in database operation", e);
        res.status(500).send({ msg: "Error in DB operation" });
        return;
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const updateRackById = async (req, res) => {
    const rackId = Number.parseInt(req.params.rid);

    // check if rack id is valid
    if (!Number.isInteger(rackId)) {
        res.status(400).json({ msg: "Invalid rack id" });
        return;
    }

    try {
        rackData = await rackSchema.validate(req.body);
    } catch (e) {
        console.error("bad request", e);
        res.status(400).send({ msg: "bad request" });
        return;
    }


    try {
        var rack = await Rack.findByPk(rackId);

        if (!rack) {
            res.status(404).json({ msg: "The rack does not exist" });
            return;
        }

        // update rack
        rack = await rack.update(rackData);
        res.status(200).json(rack);
    }
    catch (e) {
        console.error("Error in database operation", e);
        res.status(500).send({ msg: "Error in DB operation" });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const deleteRackById = async (req, res) => {
    const rackId = Number.parseInt(req.params.rid);

    // check if rack id is valid
    if (!Number.isInteger(rackId)) {
        res.status(400).json({ msg: "Invalid rack id" });
        return;
    }

    try {
        var rack = await Rack.findByPk(rackId);

        if (!rack) {
            res.status(404).json({ msg: "The rack does not exist" });
            return;
        }

        await rack.destroy();
        res.sendStatus(204);
    }
    catch (e) {
        console.error("Error in database operation", e);
        res.status(500).send("Error in database operation");
    }
}

module.exports = {
    createRack,
    getAllRacks,
    getRackById,
    updateRackById,
    deleteRackById,
};