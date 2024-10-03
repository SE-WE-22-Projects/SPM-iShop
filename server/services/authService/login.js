const express = require("express");
const Employee = require("../../models/Employee");
const { generateToken } = require("../../util/jwtUtil");

const testPassword = "test";
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const employee = await Employee.findOne({where:{
            email: email
        }});

        if(!employee){
            return res.status(401).json({message: "Invalid email or password"});
        }

        if(testPassword != password){
            return res.status(401).json({message: "Invalid email or password"});
        }

        const token =  generateToken(employee.id, employee.name, employee.email, employee.role);

        res.status(200).json({token});
    }
    catch(e){
        
    }
}

module.exports = {
    login
}