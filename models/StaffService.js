const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StaffService = sequelize.define('StaffService', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
}, {
    tableName: 'StaffServices'
});

module.exports = StaffService;
