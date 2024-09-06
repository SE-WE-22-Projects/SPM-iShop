const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Item = require("./Item");

const Promo = sequelize.define("promo", {
    name: {
        type: DataTypes.STRING,
        allowNull: false},
    desc: {
        type: DataTypes.STRING,
        allowNull: false},
    status: {
        type:DataTypes.BOOLEAN,
        defaultValue : 1
    },
    dis_percentage : DataTypes.FLOAT,
    dis_amount : DataTypes.FLOAT,
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isAfter: function(value) {
                return value >= Sequelize.fn('NOW');
            }
        }
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isAfter: function(value) {
                return value >= Sequelize.fn('NOW');
            }
        }
    }
});

Promo.belongsTo(Item, { onDelete: "CASCADE", onUpdate: "CASCADE" })

module.exports = Promo;



