const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Section = require("./Section");

const Tag = sequelize.define("tag", {
    tag_code: DataTypes.INTEGER,
    pos_x: DataTypes.FLOAT,
    pos_y: DataTypes.FLOAT
});

Tag.belongsTo(Section, { onDelete: "CASCADE", onUpdate: "CASCADE" })

module.exports = Tag;



