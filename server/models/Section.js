const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");

const Section = sequelize.define("section", {
    name: DataTypes.STRING
});

module.exports = Section;



