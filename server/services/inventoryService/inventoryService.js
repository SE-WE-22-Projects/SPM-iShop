const express = require("express");
const Item = require("../../models/Item");

const sq = require("sequelize");
const Rack = require("../../models/Rack");
const Op = sq.Op;

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const createItem = async (req, res) => {
    const reqData = req.body;
    try{
        var item = await Item.create(reqData);
        res.status(200).json({data: item});
    }
    catch(e){
        console.error("Error in database operation",e);
        res.status(500).send("Error in database operation");
        return;
    }    
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getAllItems = async (req,res) => {
    try{
        var itemList = await Item.findAll();
        res.status(200).json(itemList);
    }
    catch(e){
        console.error("Error in database operation",e);
        res.status(500).send("Error in database operation");
        return;
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getItemById = async (req,res) => {
    const itemId = Number.parseInt(req.params.itemId);
    // check if Item id is valid
    if (!Number.isInteger(itemId)) {
        res.status(400).json({ msg: "Invalid Item ID (format error)" });
        return;
    }

    try{
        var item = await Item.findOne({where: { id: itemId }});
        if(!item){
            res.status(404).send("Item not found");
        }
        else{
            res.status(200).json({data: item});
        }  
    }
    catch(e){
        console.error("Error in database operation",e);
        res.status(500).send("Error in database operation");
        return;
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const updateItemById = async (req,res) => {
    const itemId = Number.parseInt(req.params.itemId);
    const {name, desc, price, qty} = req.body;
    // check if Item id is valid
    if (!Number.isInteger(itemId)) {
        res.status(400).json({ msg: "Invalid Item ID (format error)" });
        return;
    }

    try{
        // check existance of item
        var item = await Item.findByPk(itemId);
        if (!item) {
            res.status(404).json({ msg: "The Item does not exist" });
            return;
        }
        // update item
        item = await item.update(
            {   
                name,
                desc,
                price,
                qty
            }
        );
        res.status(200).json(item);
    }
    catch(e){
        console.error("Error in database operation",e);
        res.status(500).send("Error in database operation");
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const deleteItemById = async (req,res)=> {
    const itemId = Number.parseInt(req.params.itemId);
    // check if Item id is valid
    if (!Number.isInteger(itemId)) {
        res.status(400).json({ msg: "Invalid Item ID (format error)" });
        return;
    }
    try {
        // check existance of item
        let item = await Item.findByPk(itemId);
        if (!item) {
            res.status(404).json({ msg: "The Item does not exist" });
            return;
        }
        // delete item
        await item.destroy();
        res.sendStatus(204);
    }
    catch(e){
        console.error("Error in database operation",e);
        res.status(500).send("Error in database operation");
    }
}


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getItemsByName = async (req,res) => {
    try{
        var itemList = await Item.findOne({
            where: {
              name: {
                [Op.like]: `%${req.query.q}%`
              }
            }
          });
        res.status(200).json(itemList);
    }
    catch(e){
        console.error("Error in database operation",e);
        res.status(500).send("Error in database operation");
        return;
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getUnallocatedItems = async (req,res)=> {
    try{
        var itemList = await Item.findAll({
            where: {
                rackId: null
            }
        });
        res.status(200).json(itemList);
    }
    catch(e){
        console.error("Error in database operation",e);
        res.status(500).send("Error in database operation");
        return;
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getAllocatedItems = async (req,res)=> {
    try{
        var itemList = await Item.findAll({
            where: {
                rackId: {
                    [Op.not]: null
                }
            }
        });
        res.status(200).json(itemList);
    }
    catch(e){
        console.error("Error in database operation",e);
        res.status(500).send("Error in database operation");
        return;
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const allocateRackToItem = async (req,res)=> {
    const itemId = Number.parseInt(req.params.itemId);
    const rackId = req.body.rackId;
    // check if Item id is valid
    if (!Number.isInteger(rackId)) {
        res.status(400).json({ msg: "Invalid Rack ID (format error)" });
        return;
    }
    try{
        // check existance of item
        var item = await Item.findByPk(itemId);
        if(!item){
            res.status(404).json({ msg: "The Item does not exist" });
            return;
        }
        // check existance of rack
        const rack = await Rack.findByPk(rackId);
        if(!rack){
            res.status(404).json({ msg: "The Rack does not exist" });
            return;
        }
        // allocate rack
        item = await item.update({
            rackId: rackId,
        });
        res.status(200).json(item);
    }
    catch(e){
        console.error("Error in database operation",e);
        res.status(500).send("Error in database operation");
        return;
    }
}

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    updateItemById,
    deleteItemById,
    getUnallocatedItems,
    getAllocatedItems,
    allocateRackToItem,
    getItemsByName
};
