require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const promote = async () => {
    const emailInput = process.argv[2];
    if (!emailInput) {
        console.error("Please provide an email: node promoteAdmin.js example@email.com");
        process.exit(1);
    }
    const email = emailInput.trim();

    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOneAndUpdate(
            { email: { $regex: new RegExp(`^${email}$`, 'i') } },
            { role: 'admin' },
            { new: true }
        );
        if (user) {
            console.log(`Success: ${email} is now an admin.`);
        } else {
            console.log(`User not found: ${email}`);
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

promote();
