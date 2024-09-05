const express = require("express");

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const testPromotion = async (req, res)=>{

    res.status(200).send("Testing route for promotions");

    
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const createPromotion = async (req, res)=>{

    res.status(200).send("Testing route for promotions");

    
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getPromotions = async (req, res)=>{

    res.status(200).send("Testing route for promotions");

    
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getPromotionByID = async (req, res)=>{

    res.status(200).send("Testing route for promotions");

    
}



/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const updatePromotion = async (req, res)=>{

    res.status(200).send("Testing route for promotions");

    
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const deletePromotion = async (req, res)=>{

    res.status(200).send("Testing route for promotions");

    
}





module.exports = {
    testPromotion, 
    createPromotion,
    getPromotions,
    getPromotionByID,
    updatePromotion,
    deletePromotion
};