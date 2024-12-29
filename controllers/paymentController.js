const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

exports.createPaymentIntent = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        // Get appointment and service details
        const appointment = await Appointment.findByPk(appointmentId, {
            include: [{ model: Service }]
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Create payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(appointment.Service.price * 100), // Stripe expects amount in cents
            currency: 'usd',
            metadata: {
                appointmentId: appointmentId
            }
        });

        // Create payment record
        await Payment.create({
            appointmentId,
            amount: appointment.Service.price,
            stripePaymentId: paymentIntent.id
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment processing failed' });
    }
};

exports.confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        // Verify payment with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Update payment record
            const payment = await Payment.findOne({
                where: { stripePaymentId: paymentIntentId }
            });

            await payment.update({
                status: 'completed',
                paymentDate: new Date()
            });

            // Update appointment payment status
            await Appointment.update(
                { paymentStatus: 'paid' },
                { where: { id: payment.appointmentId } }
            );

            res.json({
                success: true,
                message: 'Payment confirmed successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not successful'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment confirmation failed' });
    }
};
