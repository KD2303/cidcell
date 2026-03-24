require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const email = process.argv[2];
const role = process.argv[3];

if (!email || !role) {
  console.error('Please provide an email address and a role. Usage: node setUserRole.js <email> <role>');
  process.exit(1);
}

const validRoles = ['student', 'faculty', 'HOD', 'Admin', 'admin', 'member', 'mentor'];
if (!validRoles.includes(role)) {
  console.error(`Error: Invalid role "${role}". Valid roles are: ${validRoles.join(', ')}`);
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('Connected to MongoDB');
    
    const user = await User.findOneAndUpdate(
      { email },
      { userType: role },
      { new: true }
    );

    if (user) {
      console.log(`Success: ${user.email} is now a ${role}.`);
    } else {
      console.log(`Error: User with email ${email} not found.`);
    }

    mongoose.disconnect();
})
.catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
});
