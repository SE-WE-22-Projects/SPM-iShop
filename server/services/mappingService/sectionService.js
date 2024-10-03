const express = require("express");
const Section = require("../../models/Section");
const yup = require('yup');


const sectionSchema = yup.object({
    name: yup.string(),
    top_x: yup.number(),
    top_y: yup.number(),
    bottom_x: yup.number(),
    bottom_y: yup.number(),
})

/**
 * Create a new section.
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const createSection = async (req, res) => {

    var sectionData;
    try {
        sectionData = await sectionSchema.validate(req.body);
    } catch (e) {
        console.error("bad request", e);
        res.status(400).send({ msg: "bad request" });
        return;
    }

    try {
        var section = await Section.create(sectionData);
        res.status(200).json({ data: section });
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
const getAllSections = async (req, res) => {
    try {
        var sectionList = await Section.findAll();
        res.status(200).json(sectionList);
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
const getSectionById = async (req, res) => {
    const sectionId = Number.parseInt(req.params.sid);

    // check if section id is valid
    if (!Number.isInteger(sectionId)) {
        res.status(400).json({ msg: "Invalid section ID" });
        return;
    }

    try {
        var section = await Section.findOne({ where: { id: sectionId } });
        if (!section) {
            res.status(404).send({ msg: "Section not found" });
        } else {
            res.status(200).json({ data: section });
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
const updateSectionById = async (req, res) => {
    const sectionId = Number.parseInt(req.params.sid);

    // check if section id is valid
    if (!Number.isInteger(sectionId)) {
        res.status(400).json({ msg: "Invalid section id" });
        return;
    }

    try {
        var sectionData = await sectionSchema.validate(req.body);
    } catch (e) {
        console.error("bad request", e);
        res.status(400).send({ msg: "bad request" });
        return;
    }


    try {
        var section = await Section.findByPk(sectionId);

        if (!section) {
            res.status(404).json({ msg: "The section does not exist" });
            return;
        }

        // update section
        section = await section.update(sectionData);
        res.status(200).json(section);
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
const deleteSectionById = async (req, res) => {
    const sectionId = Number.parseInt(req.params.sid);

    // check if section id is valid
    if (!Number.isInteger(sectionId)) {
        res.status(400).json({ msg: "Invalid section id" });
        return;
    }

    try {
        var section = await Section.findByPk(sectionId);

        if (!section) {
            res.status(404).json({ msg: "The section does not exist" });
            return;
        }

        await section.destroy();
        res.sendStatus(204);
    }
    catch (e) {
        console.error("Error in database operation", e);
        res.status(500).send("Error in database operation");
    }
}

module.exports = {
    createSection,
    getAllSections,
    getSectionById,
    updateSectionById,
    deleteSectionById,
};