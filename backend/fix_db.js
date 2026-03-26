require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    // Find all users with string _ids
    const users = await db.collection('users').find({ _id: { $type: "string" } }).toArray();
    console.log(`Found ${users.length} users with string _ids`);
    
    // Backup users
    if (users.length > 0) fs.writeFileSync('users_backup.json', JSON.stringify(users, null, 2));
    
    let count = 0;
    for (const u of users) {
        // create valid objectid
        const newId = new mongoose.Types.ObjectId(u._id);
        
        // clone doc and swap id
        const newDoc = { ...u, _id: newId };
        
        // delete old FIRST to avoid unique index duplicate key errors
        await db.collection('users').deleteOne({ _id: u._id });
        
        // insert new
        await db.collection('users').insertOne(newDoc);
        
        count++;
    }
    
    console.log(`Successfully fixed ${count} users!`);
    
    // Do the same for projects, events, tasks, notifications, messages just in case
    const collections = ['projects', 'events', 'tasks', 'notifications', 'messages', 'doubts'];
    for (const col of collections) {
        const docs = await db.collection(col).find({ _id: { $type: "string" } }).toArray();
        if (docs.length > 0) {
            console.log(`Found ${docs.length} string _ids in ${col}`);
            let fixCount = 0;
            for (const d of docs) {
                const newId = new mongoose.Types.ObjectId(d._id);
                const newDoc = { ...d, _id: newId };
                await db.collection(col).deleteOne({ _id: d._id });
                await db.collection(col).insertOne(newDoc);
                fixCount++;
            }
            console.log(`Fixed ${fixCount} docs in ${col}`);
        }
    }
    
    process.exit(0);
};
run();
