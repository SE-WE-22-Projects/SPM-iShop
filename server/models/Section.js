const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");

const Section = sequelize.define("section", {
    name: DataTypes.STRING,
    top_x: DataTypes.FLOAT,
    top_y: DataTypes.FLOAT,
    bottom_x: DataTypes.FLOAT,
    bottom_y: DataTypes.FLOAT,
});

module.exports = Section;



