const Appointment = require('../models/Appointment');
const Staff = require('../models/Staff');
const Service = require('../models/Service');
const { sendEmail } = require('../utils/email');
const moment = require('moment');

exports.checkAvailability = async (req, res) => {
    try {
        const { staffId, date } = req.query;
        
        // Get all appointments for the specified date and staff
        const appointments = await Appointment.findAll({
            where: {
                staffId,
                appointmentDate: {
                    [Op.between]: [
                        moment(date).startOf('day'),
                        moment(date).endOf('day')
                    ]
                },
                status: ['pending', 'confirmed']
            }
        });

        // Get staff working hours
        const staff = await Staff.findByPk(staffId);
        const workingHours = staff.workingHours;

        // Calculate available slots
        // This is a simplified version - you might want to make it more sophisticated
        const availableSlots = calculateAvailableSlots(workingHours, appointments);

        res.json({
            success: true,
            data: availableSlots
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createAppointment = async (req, res) => {
    try {
        const { staffId, serviceId, appointmentDate, notes } = req.body;
        const userId = req.user.id; // From auth middleware

        // Check if the slot is available
        const isSlotAvailable = await checkSlotAvailability(staffId, appointmentDate);
        if (!isSlotAvailable) {
            return res.status(400).json({ message: 'This slot is not available' });
        }

        // Create appointment
        const appointment = await Appointment.create({
            userId,
            staffId,
            serviceId,
            appointmentDate,
            notes
        });

        // Send confirmation email
        await sendEmail({
            to: req.user.email,
            subject: 'Appointment Confirmation',
            text: `Your appointment has been scheduled for ${moment(appointmentDate).format('LLLL')}`
        });

        res.status(201).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if user has permission
        if (req.user.role !== 'admin' && appointment.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // If date is being updated, check availability
        if (updates.appointmentDate) {
            const isSlotAvailable = await checkSlotAvailability(
                appointment.staffId,
                updates.appointmentDate
            );
            if (!isSlotAvailable) {
                return res.status(400).json({ message: 'This slot is not available' });
            }
        }

        await appointment.update(updates);

        res.json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        
        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if user has permission
        if (req.user.role !== 'admin' && appointment.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await appointment.update({ status: 'cancelled' });

        // Send cancellation email
        await sendEmail({
            to: req.user.email,
            subject: 'Appointment Cancellation',
            text: `Your appointment scheduled for ${moment(appointment.appointmentDate).format('LLLL')} has been cancelled`
        });

        res.json({
            success: true,
            message: 'Appointment cancelled successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Helper function to check slot availability
const checkSlotAvailability = async (staffId, appointmentDate) => {
    const existingAppointment = await Appointment.findOne({
        where: {
            staffId,
            appointmentDate,
            status: ['pending', 'confirmed']
        }
    });

    return !existingAppointment;
};

// Helper function to calculate available slots
const calculateAvailableSlots = (workingHours, appointments) => {
    // Implementation depends on your business logic
    // This is where you'd implement the logic to determine available time slots
    // based on working hours and existing appointments
    // Return array of available time slots
};
