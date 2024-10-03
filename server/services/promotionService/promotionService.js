const express = require("express");
const Promo = require("../../models/Promo");
const Rack = require("../../models/Rack");
const Section = require("../../models/Section");
const Item = require("../../models/Item");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../../models");
// import { object, string, number, date } from 'yup';

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const testPromotion = async (req, res) => {
  res.status(200).send("Testing route for promotions");
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const createPromotion = async (req, res) => {
  try {
    const reqData = req.body;

    const newPromo = await Promo.create(reqData);
    res.status(201).json({ data: newPromo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create promotions" });
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getPromotions = async (req, res) => {
  try {
    const promos = await Promo.findAll();
    res.status(200).json(promos);
  } catch (error) {
    res.status(500).send("Failed to fetch promotions");
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getPromotionByID = async (req, res) => {
  try {
    const promoID = req.params.id;
    const promoByID = await Promo.findByPk(promoID);
    if (promoByID) {
      res.status(200).json({ data: promoByID });
    } else {
      res.status(404).json("Promotion doesn't exist");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch promotion",
    });
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const updatePromotion = async (req, res) => {
  try {
    const promoID = Number.parseInt(req.params.id);
    const updates = req.body;
    // check existance of promotion
    var promotion = await Promo.findByPk(promoID);
    if (!promotion) {
      return res.status(404).json({
        message: "Promotion not found",
      });
    }
    // update
    promotion = await promotion.update(updates);
    res.status(200).json({
      message: "Promotion updated",
      promotion,
    });
  } catch (error) {
    res.status(500).send("Could not update, error occured");
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const deletePromotion = async (req, res) => {
  const promoID = Number.parseInt(req.params.id);
  try {
    let promo = await Promo.findByPk(promoID);
    // check existance of promotion
    if (!promo) {
      res.status(404).json({ msg: "The Promotion does not exist" });
      return;
    }
    // delete promotion
    await promo.destroy();
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.status(500).send(error, "Could not delete, error occured");
  }
};

/**
 * Get Promotions by sectionID
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getPromotionsBySectionID = async (req, res) => {
  const sectionID = Number.parseInt(req.params.sectionID);

  try {
    const promotions = await Promo.findAll({
      include: {
        model: Item,
        include: {
          model: Rack,
          include: {
            model: Section,
            where: { id: sectionID },
          },
        },
      },
      attributes: ["desc"],
    });

    const promotionDescriptions = promotions.map((promo) => promo.desc);

    res.status(200).json({
      promotionDescriptions,
    });
  } catch (error) {
    console.error("Error fetching promotions for the section: ", error);
    res.status(500).json({
      error: "Failed to fetch promotions for the section",
    });
  }
};

module.exports = {
  testPromotion,
  createPromotion,
  getPromotions,
  getPromotionByID,
  updatePromotion,
  deletePromotion,
  getPromotionsBySectionID,
};
