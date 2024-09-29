const express = require("express");
const Tag = require("../../models/Tag");
const yup = require('yup');


const tagSchema = yup.object({
    code: yup.number(),
    name: yup.string(),
})

/**
 * Create a new tag.
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const createTag = async (req, res) => {

    var tagData;
    try {
        tagData = await tagSchema.validate(req.body);
    } catch (e) {
        console.error("bad request", e);
        res.status(400).send({ msg: "bad request" });
        return;
    }

    try {
        var tag = await Tag.create(tagData);
        res.status(200).json({ data: tag });
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
const getAllTags = async (req, res) => {
    try {
        var tagList = await Tag.findAll();
        res.status(200).json(tagList);
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
const getTagById = async (req, res) => {
    const tagId = Number.parseInt(req.params.tid);

    // check if tag id is valid
    if (!Number.isInteger(tagId)) {
        res.status(400).json({ msg: "Invalid tag ID" });
        return;
    }

    try {
        var tag = await Tag.findOne({ where: { id: tagId } });
        if (!tag) {
            res.status(404).send({ msg: "Tag not found" });
        } else {
            res.status(200).json({ data: tag });
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
const updateTagById = async (req, res) => {
    const tagId = Number.parseInt(req.params.tid);

    // check if tag id is valid
    if (!Number.isInteger(tagId)) {
        res.status(400).json({ msg: "Invalid tag id" });
        return;
    }

    try {
        tagData = await tagSchema.validate(req.body);
    } catch (e) {
        console.error("bad request", e);
        res.status(400).send({ msg: "bad request" });
        return;
    }


    try {
        var tag = await Tag.findByPk(tagId);

        if (!tag) {
            res.status(404).json({ msg: "The tag does not exist" });
            return;
        }

        // update tag
        tag = await tag.update(tagData);
        res.status(200).json(tag);
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
const deleteTagById = async (req, res) => {
    const tagId = Number.parseInt(req.params.tid);

    // check if tag id is valid
    if (!Number.isInteger(tagId)) {
        res.status(400).json({ msg: "Invalid tag id" });
        return;
    }

    try {
        var tag = await Tag.findByPk(tagId);

        if (!tag) {
            res.status(404).json({ msg: "The tag does not exist" });
            return;
        }

        await tag.destroy();
        res.sendStatus(204);
    }
    catch (e) {
        console.error("Error in database operation", e);
        res.status(500).send("Error in database operation");
    }
}

module.exports = {
    createTag,
    getAllTags,
    getTagById,
    updateTagById,
    deleteTagById,
};