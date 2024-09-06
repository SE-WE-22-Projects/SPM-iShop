const express = require("express");

const Promo = require('../../models/Promo');

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

   try{
    const {name , desc, start_date, end_date} = req.body;

    const newPromo = await Promo.create({
        name, desc, start_date, end_date
    })

    console.log(`${name} , ${desc}`);

    res.status(201).json({
        message : "New Promotion Created Successfully",
        Promo : newPromo
    })

   } catch(error){
    res.status(500).json({
        error:'Failed to create promotions'
    });
   }   
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getPromotions = async (req, res)=>{
    try{

        const promos = await Promo.findAll();
        res.json(promos);
    }catch(error){
        res.status(500).json({
            error: "Failed to fetch promotions"
        });
    }   
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getPromotionByID = async (req, res)=>{

    try{

        const promoID = req.params.id;

        const promoByID = await Promo.findByPk(promoID)

        if(promoByID){
             res.json(promoByID);
        }else{
            res.json("Promotion doesn't exist");
        }
         
    }catch(error){

        res.status(500).json({
            error: "Failed to fetch promotion"
        });

    } 
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

    const promoID = req.params.id;
    try{
        Promo.destroy({
            where:{
                id:`${promoID}`
            }
        }).then(
            res.status(200).send("Record deleted successfully")
        ).catch(error =>{
            res.status(500).send( error , "Could not delete, error occured");
        })
    }catch(error){

        res.status(500).json({
            error: "Failed to fetch promotion"
        });

    }   
}


module.exports = {
    testPromotion, 
    createPromotion,
    getPromotions,
    getPromotionByID,
    updatePromotion,
    deletePromotion
};