const Review = require('../models/Review');
const Appointment = require('../models/Appointment');

exports.createReview = async (req, res) => {
    try {
        const { appointmentId, rating, comment } = req.body;
        const userId = req.user.id;

        // Verify appointment exists and belongs to user
        const appointment = await Appointment.findOne({
            where: { 
                id: appointmentId,
                userId,
                status: 'completed'
            }
        });

        if (!appointment) {
            return res.status(404).json({ 
                message: 'Appointment not found or not eligible for review' 
            });
        }

        const review = await Review.create({
            userId,
            appointmentId,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addStaffResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;

        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await review.update({ staffResponse: response });

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
