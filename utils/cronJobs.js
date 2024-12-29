const cron = require('node-cron');
const moment = require('moment');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { sendEmail } = require('./email');

// Run every day at 8 AM
const scheduleAppointmentReminders = () => {
    cron.schedule('0 8 * * *', async () => {
        try {
            // Get all appointments for tomorrow
            const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
            
            const appointments = await Appointment.findAll({
                where: {
                    appointmentDate: {
                        [Op.between]: [
                            moment(tomorrow).startOf('day'),
                            moment(tomorrow).endOf('day')
                        ]
                    },
                    status: 'confirmed'
                },
                include: [
                    { model: User },
                    { model: Service }
                ]
            });

            // Send reminder emails
            for (const appointment of appointments) {
                await sendEmail({
                    to: appointment.User.email,
                    subject: 'Appointment Reminder',
                    text: `Reminder: You have an appointment for ${appointment.Service.name} tomorrow at ${moment(appointment.appointmentDate).format('LT')}`
                });
            }

            console.log('Appointment reminders sent successfully');
        } catch (error) {
            console.error('Error sending appointment reminders:', error);
        }
    });
};

module.exports = { scheduleAppointmentReminders }; 