const Staff = require('../models/Staff');
const User = require('../models/User');
const StaffService = require('../models/StaffService');

exports.createStaffMember = async (req, res) => {
    try {
        const { userId, specialization, bio, workingHours } = req.body;

        // Verify user exists and is not already a staff member
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user role to staff
        await user.update({ role: 'staff' });

        const staff = await Staff.create({
            userId,
            specialization,
            bio,
            workingHours
        });

        res.status(201).json({
            success: true,
            data: staff
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.assignService = async (req, res) => {
    try {
        const { staffId, serviceId } = req.body;

        const staffService = await StaffService.create({
            staffId,
            serviceId
        });
        await staffService.setStaff(staffId);
        await staffService.setService(serviceId);

        res.status(201).json({
            success: true,
            data: staffService
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateStaffAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { workingHours, isAvailable } = req.body;

        const staff = await Staff.findByPk(id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        await staff.update({
            workingHours: workingHours || staff.workingHours,
            isAvailable: isAvailable !== undefined ? isAvailable : staff.isAvailable
        });

        res.json({
            success: true,
            data: staff
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStaffServices = async (req, res) => {
    try {
        const { id } = req.params;

        const staffServices = await StaffService.findAll({
            where: { staffId: id },
            include: ['Service']
        });

        res.json({
            success: true,
            data: staffServices
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
