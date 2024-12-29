const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const initDatabase = require('./config/init');
const { scheduleAppointmentReminders } = require('./utils/cronJobs');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initDatabase().then(() => {
    // Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/users', require('./routes/users'));
    app.use('/api/services', require('./routes/services'));
    app.use('/api/staff', require('./routes/staff'));
    app.use('/api/appointments', require('./routes/appointments'));
    app.use('/api/payments', require('./routes/payments'));
    app.use('/api/reviews', require('./routes/reviews'));

    scheduleAppointmentReminders();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
