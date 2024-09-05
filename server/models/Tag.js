const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Item = require("./Item");

const Tag = sequelize.define("tag", {
    tag_code: DataTypes.INTEGER
});

Tag.belongsTo(Item, { onDelete: "CASCADE", onUpdate: "CASCADE" })

module.exports = Tag;



