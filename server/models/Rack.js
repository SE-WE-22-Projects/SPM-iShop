const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
const Section = require("./Section");

const Rack = sequelize.define("rack", {
    top_x: DataTypes.FLOAT,
    top_y: DataTypes.FLOAT,
    bottom_x: DataTypes.FLOAT,
    bottom_y: DataTypes.FLOAT,
});

Rack.belongsTo(Section, { onDelete: "CASCADE", onUpdate: "CASCADE" });

module.exports = Rack;



