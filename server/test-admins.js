require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admins = await User.find({ role: 'admin' }, 'email fullName');
        console.log("=== REGISTERED ADMINS ===");
        if (admins.length === 0) {
            console.log("No admins found in the database.");
        } else {
            admins.forEach(admin => {
                console.log(`- ${admin.fullName} (${admin.email})`);
            });
        }
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
