const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Section = require("./Section");

const Employee = sequelize.define("employee", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Name cannot be empty",
      },
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Role cannot be empty",
      },
    },
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("male", "female", "other"),
    allowNull: false,
    validate: {
      isIn: {
        args: [["male", "female", "other"]],
        msg: "Invalid gender value",
      },
    },
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: "Invalid email format",   

      },
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Address cannot be empty",
      },
    },
  },
  hireDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  basicSalary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: "Invalid basic salary format",
      },
      min: 0, // Enforce a minimum salary
    },
  },
  employmentStatus: {
    type: DataTypes.ENUM("full-time", "part-time", "contract"),
    allowNull: false,
    validate: {
      isIn: {
        args: [["full-time", "part-time", "contract"]],
        msg: "Invalid employment status",
      },
    },
  },
});

Employee.belongsTo(Section, { onDelete: "CASCADE", onUpdate: "CASCADE" });

module.exports = Employee;