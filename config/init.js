const sequelize = require('./database');
const User = require('../models/User');
const Service = require('../models/Service');
const Staff = require('../models/Staff');
const StaffService = require('../models/StaffService');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');

// Define relationships
User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

Staff.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Staff, { foreignKey: 'userId' });

Staff.belongsToMany(Service, { 
    through: StaffService,
    foreignKey: 'staffId',
    otherKey: 'serviceId'
});
Service.belongsToMany(Staff, { 
    through: StaffService,
    foreignKey: 'serviceId',
    otherKey: 'staffId'
});

Appointment.belongsTo(Staff, { foreignKey: 'staffId', as: 'staff' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

const initDatabase = async () => {
    try {
        // For development only. Remove in production
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
        process.exit(1);
    }
};

module.exports = initDatabase; 