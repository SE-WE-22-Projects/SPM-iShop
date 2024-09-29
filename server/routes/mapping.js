const express = require("express");
const router = express.Router();

const sectionService = require("../services/mappingService/sectionService");
// create section
router.post('/section', sectionService.createSection);
// get all sections
router.get('/section', sectionService.getAllSections);
// get section
router.get('/section/:sid', sectionService.getSectionById);
// update section details
router.put('/section/:sid', sectionService.updateSectionById);
// delete the section
router.delete('/section/:sid', sectionService.deleteSectionById);

const rackService = require("../services/mappingService/rackService");
// create rack
router.post('/rack', rackService.createRack);
// get all racks
router.get('/rack', rackService.getAllRacks);
// get rack
router.get('/rack/:rid', rackService.getRackById);
// update rack details
router.put('/rack/:rid', rackService.updateRackById);
// delete the rack
router.delete('/rack/:rid', rackService.deleteRackById);

const tagService = require("../services/mappingService/tagService");
// create tag
router.post('/tag', tagService.createTag);
// get all tags
router.get('/tag', tagService.getAllTags);
// get tag
router.get('/tag/:tid', tagService.getTagById);
// update tag details
router.put('/tag/:tid', tagService.updateTagById);
// delete the tag
router.delete('/tag/:tid', tagService.deleteTagById);

const storeMapService = require("../services/mappingService/storeMapService");
// get the complete map of the store
router.get("/map", storeMapService.getStoreMap);

module.exports = router;