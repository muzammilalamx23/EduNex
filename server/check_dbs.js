require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkDBs = async () => {
    try {
        const uriTest = process.env.MONGO_URI;
        await mongoose.connect(uriTest);
        let usersTest = await User.countDocuments();
        console.log(`Users in 'test' DB: ${usersTest}`);
        await mongoose.disconnect();

        const uriEdunex = process.env.MONGO_URI.includes('?') 
            ? process.env.MONGO_URI.replace(/\/\?/, '/edunex?') 
            : process.env.MONGO_URI + '/edunex';
        await mongoose.connect(uriEdunex);
        let usersEdunex = await User.countDocuments();
        console.log(`Users in 'edunex' DB: ${usersEdunex}`);
        await mongoose.disconnect();

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDBs();
