const express = require("express");
const router = express.Router();
const employee = require("../services/employeeService/employeeService");

// register routes here
router.get("/testEmployee", employee.testEmployee);
//create employee
router.post("/employee", employee.createEmployee);
//get all employees
router.get("/employee", employee.getEmployees);
//get an employee by ID
router.get("/employee/:id", employee.getEmployeeByID);
//update an employee by ID
router.put("/employee/:id", employee.updateEmployee);
//delete an employee by ID
router.delete("/employee/:id", employee.deleteEmployee);


module.exports = router;