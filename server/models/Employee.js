const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Section = require("./Section");

const Employee = sequelize.define("employee", {
    name: DataTypes.STRING,
    role: DataTypes.STRING,
});

Employee.belongsTo(Section, { onDelete: "CASCADE", onUpdate: "CASCADE" })

module.exports = Employee;



