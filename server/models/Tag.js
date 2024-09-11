const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Item = require("./Item");

const Tag = sequelize.define("tag", {
    code: DataTypes.INTEGER,
    name: DataTypes.STRING
});

Tag.belongsTo(Item, { onDelete: "CASCADE", onUpdate: "CASCADE" })

module.exports = Tag;



