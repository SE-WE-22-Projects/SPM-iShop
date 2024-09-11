const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Rack = require("./Rack");

const Item = sequelize.define("item", {
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    category: DataTypes.STRING,
    unit:{
        type: DataTypes.ENUM("grams","liters","pieces")
    },
    price: {
        type: DataTypes.REAL,
        validate: {
            min: 0.00
        }
    },
    qty: {
        type: DataTypes.INTEGER,
        validate: {
            min: 0
        }
    },
});

Item.belongsTo(Rack, { onDelete: "CASCADE", onUpdate: "CASCADE" })

module.exports = Item;



