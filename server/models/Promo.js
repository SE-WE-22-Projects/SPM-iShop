const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Item = require("./Item");

const Promo = sequelize.define("promo", {
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
});

Promo.belongsTo(Item, { onDelete: "CASCADE", onUpdate: "CASCADE" })

module.exports = Promo;



