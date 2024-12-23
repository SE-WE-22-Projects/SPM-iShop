const express = require("express");
const router = express.Router();
const promotion = require("../services/promotionService/promotionService");

// Promotion route test
router.get("/testPromotion", promotion.testPromotion);
//create promotion
router.post("/promotion", promotion.createPromotion);
//get all promotions
router.get("/promotion", promotion.getPromotions);
//get a promotion by ID
router.get("/promotion/:id", promotion.getPromotionByID);
//update a promotion by ID
router.put("/promotion/:id", promotion.updatePromotion);
//delete a promotion by ID
router.delete("/promotion/:id", promotion.deletePromotion);
//get promotions by category
router.get("/promotion/section/:sectionID", promotion.getPromotionsBySectionID);

module.exports = router;
