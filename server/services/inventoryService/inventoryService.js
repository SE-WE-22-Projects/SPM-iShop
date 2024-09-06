const express = require("express");
const Item = require("../../models/Item");

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const createItem = async (req, res) => {
    const reqData = req.body;
    try{
        var item = await Item.create(reqData);
    }
    catch(e){
        console.error("Error in database operation",e);
        res.status(500).send("Error in database operation");
        return;
    }

    res.status(200).json({data: item});
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
        if (item === null) {
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
        return;
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
        if (item === null) {
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
        return;
    }
}

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    updateItemById,
    deleteItemById,
};