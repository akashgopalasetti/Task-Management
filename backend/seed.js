const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));

// Seed users
const seed = async () => {
  const hashedPassword = await bcrypt.hash('123456', 10);

  const users = [
    {
      name: 'Manager 1',
      email: 'manager@example.com',
      password: hashedPassword,
      role: 'manager',
    },
    {
      name: 'Employee 1',
      email: 'employee1@example.com',
      password: hashedPassword,
      role: 'employee',
    },
    {
      name: 'Employee 2',
      email: 'employee2@example.com',
      password: hashedPassword,
      role: 'employee',
    },
    {
      name: 'Employee 3',
      email: 'employee3@example.com',
      password: hashedPassword,
      role: 'employee',
    },
    {
      name: 'Employee 4',
      email: 'employee4@example.com',
      password: hashedPassword,
      role: 'employee',
    },
    {
      name: 'Employee 5',
      email: 'employee5@example.com',
      password: hashedPassword,
      role: 'employee',
    },
    {
      name: 'Employee 6',
      email: 'employee6@example.com',
      password: hashedPassword,
      role: 'employee',
    },
    {
      name: 'Employee 7',
      email: 'employee7@example.com',
      password: hashedPassword,
      role: 'employee',
    },
    {
      name: 'Employee 8',
      email: 'employee8@example.com',
      password: hashedPassword,
      role: 'employee',
    },
    {
      name: 'Employee 9',
      email: 'employee9@example.com',
      password: hashedPassword,
      role: 'employee',
    },
    {
      name: 'Employee 10',
      email: 'employee10@example.com',
      password: hashedPassword,
      role: 'employee',
    }
  ];

  await User.deleteMany(); // Optional: clears existing users
  await User.insertMany(users);
  console.log('✅ Users seeded successfully');
  mongoose.disconnect();
};

seed();
