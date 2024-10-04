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
// get all unalloacated items
router.get('/items/unallocated',inventoryService.getUnallocatedItems);
// get all allocated items
router.get('/items/allocated',inventoryService.getAllocatedItems);
// allocate rack to item
router.put('/items/allocate/:itemId',inventoryService.allocateRackToItem);
// get item by name route
router.get('/search',inventoryService.getItemsByName);

module.exports = router;