const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    appointmentId: {
        type: DataTypes.UUID,
        references: {
            model: 'Appointments',
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending'
    },
    paymentMethod: {
        type: DataTypes.STRING
    },
    stripePaymentId: {
        type: DataTypes.STRING
    },
    paymentDate: {
        type: DataTypes.DATE
    }
});

module.exports = Payment;
