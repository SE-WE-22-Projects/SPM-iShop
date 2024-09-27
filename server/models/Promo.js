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
        defaultValue : true
    },
    dis_percentage : {
        type: DataTypes.FLOAT,
         validate:{
            min : 0,
            max : 100
         }
    },
    dis_amount : {
        type: DataTypes.FLOAT,
         validate:{
            min : 0,
            //max : Get Price from Item and set to to max
         }
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isAfter: function(value) {
                console.log(typeof value)
                return value >= sequelize.fn('NOW');
            }
        }
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isAfter: function(value) {
                return value >= sequelize.fn('NOW');
            }
        }
    }
});

Promo.belongsTo(Item, { onDelete: "CASCADE", onUpdate: "CASCADE" })

module.exports = Promo;



