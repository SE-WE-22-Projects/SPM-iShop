const express = require("express");
const router = express.Router();

const inventoryService = require('../services/inventoryService/inventoryService');

// create Item route 
router.post('/item',inventoryService.createItem);
// get all items route
router.get('/item',inventoryService.getAllItems);
// get item by id route
router.get('/item/:itemId',inventoryService.getItemById);
// update item by id route
router.put('/item/:itemId',inventoryService.updateItemById);
// delete item by id route
router.delete('/item/:itemId',inventoryService.deleteItemById);

module.exports = router;