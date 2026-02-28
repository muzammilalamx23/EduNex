require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'fullName email role');
        console.log('--- Current Users in DB ---');
        users.forEach(u => {
            console.log(`- ${u.fullName} (${u.email}) [Role: ${u.role || 'user'}]`);
        });
        console.log('---------------------------');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listUsers();
