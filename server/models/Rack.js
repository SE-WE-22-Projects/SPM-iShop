const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
const Section = require("./Section");

const Rack = sequelize.define("rack", {
    tag_code: DataTypes.INTEGER
});

Rack.belongsTo(Section, { onDelete: "CASCADE", onUpdate: "CASCADE" });

module.exports = Rack;



