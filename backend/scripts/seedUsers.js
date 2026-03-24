/**
 * Seed script: creates 5 users for each userType
 * Run: node backend/scripts/seedUsers.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern_db2';

const users = [
  // ── 5 Students ──
  { username: 'Aarav Sharma',   email: 'aarav.sharma@mitsgwl.ac.in',   userType: 'student', enrollmentNo: '24CS10S001', branch: 'CSE', batch: '2024', skills: ['React', 'Node.js', 'MongoDB'],   socialLinks: { linkedin: 'https://linkedin.com/in/aarav', github: 'https://github.com/aarav' } },
  { username: 'Priya Patel',    email: 'priya.patel@mitsgwl.ac.in',    userType: 'student', enrollmentNo: '24CS10S002', branch: 'CSE', batch: '2024', skills: ['Python', 'Django', 'PostgreSQL'], socialLinks: { linkedin: 'https://linkedin.com/in/priya', github: 'https://github.com/priya' } },
  { username: 'Rohit Verma',    email: 'rohit.verma@mitsgwl.ac.in',    userType: 'student', enrollmentNo: '24CS10S003', branch: 'CSE', batch: '2024', skills: ['Java', 'Spring Boot', 'MySQL'],   socialLinks: { linkedin: 'https://linkedin.com/in/rohit', github: 'https://github.com/rohit' } },
  { username: 'Sneha Gupta',    email: 'sneha.gupta@mitsgwl.ac.in',    userType: 'student', enrollmentNo: '24CS10S004', branch: 'IT',  batch: '2024', skills: ['Flutter', 'Dart', 'Firebase'],    socialLinks: { linkedin: 'https://linkedin.com/in/sneha', github: 'https://github.com/sneha' } },
  { username: 'Kunal Joshi',    email: 'kunal.joshi@mitsgwl.ac.in',    userType: 'student', enrollmentNo: '24CS10S005', branch: 'CSE', batch: '2024', skills: ['C++', 'DSA', 'Competitive Coding'], socialLinks: { linkedin: 'https://linkedin.com/in/kunal', github: 'https://github.com/kunal' } },

  // ── 5 Mentors ──
  { username: 'Dr. Ankit Mishra',  email: 'ankit.mishra@mitsgwl.ac.in',  userType: 'mentor', domainOfExpertise: 'Web Development',  department: 'CSE', aboutMentor: 'Full-stack web mentor with 5+ years experience.', expertise: ['React', 'Node.js', 'Express'] },
  { username: 'Dr. Neha Singh',    email: 'neha.singh@mitsgwl.ac.in',    userType: 'mentor', domainOfExpertise: 'AI / ML',           department: 'CSE', aboutMentor: 'ML researcher specializing in NLP and deep learning.', expertise: ['Python', 'TensorFlow', 'PyTorch'] },
  { username: 'Dr. Vikram Rao',    email: 'vikram.rao@mitsgwl.ac.in',    userType: 'mentor', domainOfExpertise: 'App Development',   department: 'IT',  aboutMentor: 'Mobile dev expert in cross-platform frameworks.',     expertise: ['Flutter', 'React Native', 'Swift'] },
  { username: 'Dr. Kavita Dubey',  email: 'kavita.dubey@mitsgwl.ac.in',  userType: 'mentor', domainOfExpertise: 'Cybersecurity',     department: 'CSE', aboutMentor: 'Cybersecurity specialist and ethical hacking mentor.',  expertise: ['Kali Linux', 'Burp Suite', 'Networking'] },
  { username: 'Dr. Rahul Tiwari',  email: 'rahul.tiwari@mitsgwl.ac.in',  userType: 'mentor', domainOfExpertise: 'Cloud Computing',   department: 'CSE', aboutMentor: 'AWS certified cloud architect and DevOps mentor.',     expertise: ['AWS', 'Docker', 'Kubernetes'] },

  // ── 5 Faculty ──
  { username: 'Prof. Sunita Agrawal', email: 'sunita.agrawal@mitsgwl.ac.in', userType: 'faculty', department: 'CSE', branch: 'CSE' },
  { username: 'Prof. Manoj Kumar',    email: 'manoj.kumar@mitsgwl.ac.in',    userType: 'faculty', department: 'CSE', branch: 'CSE' },
  { username: 'Prof. Deepa Jain',     email: 'deepa.jain@mitsgwl.ac.in',     userType: 'faculty', department: 'IT',  branch: 'IT'  },
  { username: 'Prof. Arvind Saxena',   email: 'arvind.saxena@mitsgwl.ac.in',  userType: 'faculty', department: 'CSE', branch: 'CSE' },
  { username: 'Prof. Meena Srivastava', email: 'meena.srivastava@mitsgwl.ac.in', userType: 'faculty', department: 'CSE', branch: 'CSE' },

  // ── 5 Admins ──
  { username: 'Admin Ravi',     email: 'admin.ravi@mitsgwl.ac.in',     userType: 'Admin' },
  { username: 'Admin Pooja',    email: 'admin.pooja@mitsgwl.ac.in',    userType: 'Admin' },
  { username: 'Admin Sanjay',   email: 'admin.sanjay@mitsgwl.ac.in',   userType: 'Admin' },
  { username: 'Admin Divya',    email: 'admin.divya@mitsgwl.ac.in',    userType: 'Admin' },
  { username: 'Admin Kiran',    email: 'admin.kiran@mitsgwl.ac.in',    userType: 'Admin' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  let created = 0, skipped = 0;

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`  ⏭️  ${u.userType.padEnd(8)} | ${u.username} — already exists`);
      skipped++;
    } else {
      await User.create(u);
      console.log(`  ✅ ${u.userType.padEnd(8)} | ${u.username} — created`);
      created++;
    }
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
