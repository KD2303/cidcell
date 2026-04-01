require('dotenv').config();
const { sendWelcomeEmail } = require('./utils/emailService');

(async () => {
    try {
        console.log("🚀 Initializing Live SMTP Nodemailer Test...");
        
        // Mock User Payload
        const mockUser = {
            username: 'Anurag Mishra',
            branch: 'CSD',
            batch: '2024-2028',
            email: '24cd10an13@mitsgwl.ac.in'
        };

        console.log(`📡 Dispatching secure Welcome payload to: ${mockUser.email}`);
        
        // Trigger the unified email sending logic
        await sendWelcomeEmail(mockUser);
        
        console.log("✅ Transmission Successful! Please check your inbox.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Transmission Failure:", error);
        process.exit(1);
    }
})();
