const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Rack = require("./Rack");

const Item = sequelize.define("item", {
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    price: DataTypes.REAL,
});

Item.belongsTo(Rack, { onDelete: "CASCADE", onUpdate: "CASCADE" })

module.exports = Item;



