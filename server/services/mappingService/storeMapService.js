const express = require("express");
const Tag = require("../../models/Tag");
const Section = require("../../models/Section");
const Rack = require("../../models/Rack");

const {networkInterfaces} = require('os');
const { json } = require("sequelize");
const QRCode = require('qrcode')

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getStoreMap = async (req, res) => {
    try {
        var tagData = await Tag.findAll();
        var rackData = await Rack.findAll({ include: Section });
        var sectionData = await Section.findAll();
    }
    catch (e) {
        console.error("Error in database operation", e);
        res.status(500).send({ msg: "Error in DB operation" });
        return;
    }


    // get the size of the store.
    const storeSize = sectionData.reduce((prev, current) => {
        return {
            width: Math.max(prev.width, current.top_y, current.bottom_y),
            height: Math.max(prev.height, current.top_x, current.bottom_x),
        }
    }, { width: 0, height: 0 });

    // validate the section data
    const sections = sectionData.map(s => {
        if (s.top_y < 0 || s.top_x < 0 || s.bottom_y < 0 || s.bottom_x < 0) {
            throw Error("Section positions are negative");
        }

        if (s.bottom_y < s.top_y || s.bottom_y < s.top_y) {
            throw Error("Invalid section position")
        }

        return { id: s.id, name: s.name, top_x: s.top_x, top_y: s.top_y, bottom_x: s.bottom_x, bottom_y: s.bottom_y }
    });

    // validate tag data
    const tags = tagData.map(t => {
        if (t.pos_x < 0 || t.pos_y < 0) {
            throw Error("Section positions are negative");
        }

        const section = sections.find(s => s.id === t.sectionId);
        if (section === undefined || t.sectionId === null) {
            throw Error(`Tag has invalid section (${t.sectionId})`)
        }

        if (
            t.pos_x > section.bottom_x || t.pos_x < section.top_x ||
            t.pos_y > section.bottom_y || t.pos_y < section.top_y
        ) {
            throw Error(`Tag is outsize section tag: ${t} \n section ${section}`)
        }


        return { code: t.code, pos_x: t.pos_x, pos_y: t.pos_y, section: t.sectionId };
    })

    const racks = rackData.map(r => {
        // TODO: validate the rack position coordinates.
        return { id: r.id, top_x: r.top_x, top_y: r.top_y, bottom_x: r.bottom_x, bottom_y: r.bottom_y, section: r.sectionId }
    })

    res.status(200).json({
        size: storeSize,
        tags: tags,
        racks: racks,
        sections: sections
    });
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getAvailableIpAddress = async(req,res)=>{
    const interfaces = networkInterfaces();
    var ipArray = [];

    for (const nets of Object.values(interfaces)){
        for(const net of nets){
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                ipArray.push(net.address);
            }
        }   
    }

    const qr = await QRCode.toDataURL(JSON.stringify({t: "SV", i: ipArray , ms:0.17}), {width: 750});


    
    res.status(200).json({qr});

    // const nets = networkInterfaces();
    // const results = Object.create(null); // Or just '{}', an empty object

    // for (const name of Object.keys(nets)) {
    //     for (const net of nets[name]) {
    //         // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    //         // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
    //         const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
    //         if (net.family === familyV4Value && !net.internal) {
    //             if (!results[name]) {
    //                 results[name] = [];
    //             }
    //             results[name].push(net.address);
    //     }
    // }
}

module.exports = { 
    getAvailableIpAddress,
    getStoreMap 
}