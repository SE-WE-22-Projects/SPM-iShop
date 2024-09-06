const Employee = require('../../models/Employee'); // Import the Employee model
const express = require("express");

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const testEmployee = async (req, res)=>{

    res.status(200).send("Testing route for employees");

 
}

// Create an employee
const createEmployee = async (req, res) => {
  try {
    const { name, role } = req.body;
    const newEmployee = await Employee.create({ name, role });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).send("Bad request");
  }
};

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

// Get an employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      res.status(404).send("Employee not found");
    } else {
      res.status(200).json(employee);
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

// Update an employee by ID
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      res.status(404).send("Employee not found");
    } else {
      await employee.update(req.body);
      res.status(200).send("Employee updated successfully");
    }
  } catch (error) {
    res.status(400).send("Bad request");
  }
};

// Delete an employee by ID
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      res.status(404).send("Employee not found");
    } else {
      await employee.destroy();
      res.status(200).send("Employee deleted successfully");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  testEmployee,
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};