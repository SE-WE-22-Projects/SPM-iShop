const express = require("express");

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const testEmployee = async (req, res)=>{

    res.status(200).send("Testing route for employees");

 
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const createEmployee = async (req, res)=>{

    res.status(200).send("Testing route for employees");

    
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getEmployees = async (req, res)=>{

    res.status(200).send("Testing route for employees");

 
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const getEmployeeByID = async (req, res)=>{

    res.status(200).send("Testing route for employees");

 
}



/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const updateEmployee = async (req, res)=>{

    res.status(200).send("Testing route for employees");

 
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const deleteEmployee = async (req, res)=>{

    res.status(200).send("Testing route for employees");

 
}





module.exports = {
    testEmployee, 
    createEmployee,
    getEmployees,
    getEmployeeByID,
    updateEmployee,
    deleteEmployee
};