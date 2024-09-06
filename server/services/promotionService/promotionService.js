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
    const {name, desc, status, dis_percentage, dis_amount, start_date, end_date} = req.body;

    const newPromo = await Promo.create({
        name, desc, status, dis_percentage, dis_amount, start_date, end_date
    })


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

    try{
        const promoID = req.params.id;
        const updates = req.body;

        const promotion = await Promo.findByPk(promoID);
        
        if(!promotion){
           return  res.status(404).json({
                message : "Promotion not found"
            });
        }

        await promotion.update(updates);

        const updatedPromo = await promotion.reload();

        res.status(200).json({

                message: "Promotion updated",
                updatedPromo
        })
    }catch(error){
        res.status(400).json({
            message : error.message
        });
    }
    
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