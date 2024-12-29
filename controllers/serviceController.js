const Service = require('../models/Service');

exports.createService = async (req, res) => {
    try {
        const { name, description, duration, price } = req.body;
        
        const service = await Service.create({
            name,
            description,
            duration,
            price
        });

        res.status(201).json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            where: { isActive: true }
        });

        res.json({
            success: true,
            data: services
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        await service.update(updates);

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Soft delete by setting isActive to false
        await service.update({ isActive: false });

        res.json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
