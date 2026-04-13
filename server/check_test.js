require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkTestDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'fullName email role');
        console.log(JSON.stringify(users, null, 2));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkTestDB();
