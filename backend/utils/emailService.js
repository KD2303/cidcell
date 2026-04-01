const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { getPremiumEmailTemplate } = require('./emailTemplate');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    // Connection pool
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
});

transporter.verify((error) => {
    if (error) {
        console.error('❌ Nodemailer transporter verification failed:', error.message);
    } else {
        console.log('✅ Nodemailer is ready to send emails');
    }
});

/** Helper to provide standard attachments like Logo to templates */
const getStandardAttachments = () => [
    {
        filename: 'logo.png',
        path: require('path').join(__dirname, '../assets/logo.png'),
        cid: 'logo',
    }
];

const sendWelcomeEmail = async (user) => {
    try {
        const username = user.username || 'Developer';
        
        const html = getPremiumEmailTemplate({
            title: 'ACCESS GRANTED',
            preheader: 'Welcome to the CID Cell Developer Matrix.',
            greeting: `Hello ${username},`,
            bodyLines: [
                `Your neural link to the **Collaborative Innovation & Development Cell** has been successfully established. Your credentials are now authenticated across the network.`,
                `**Name:** ${username}`,
                `**Branch:** ${user.branch || 'Unassigned'}`,
                `**Batch:** ${user.batch || 'Unassigned'}`,
                `You are now cleared to access active workspaces, join collaborative projects, and expand your technical potential.`
            ],
            cta: {
                text: 'ENTER DASHBOARD',
                link: 'https://cid-cell-mits.vercel.app/dashboard'
            }
        });

        const mailOptions = {
            from: `"CID Cell MITS" <${process.env.MAIL_USER}>`,
            to: user.email,
            subject: '⚡ Welcome to CID Cell — Access Granted',
            html,
            attachments: getStandardAttachments()
        };
        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${user.email}`);
    } catch (error) {
        console.error('❌ Error sending welcome email:', error.message);
        throw error;
    }
};

const getPreviewHtml = () => {
    return getPremiumEmailTemplate({
        title: 'ACCESS GRANTED',
        preheader: 'Welcome to the CID Cell Matrix preview.',
        greeting: `Hello PREVIEW USER,`,
        bodyLines: [
            `Your profile has been verified and initialized in the database.`,
            `This is a preview of the new CID-Cell Cybernetic Email Aesthetic.`
        ],
        cta: { text: 'VISIT HUB', link: 'https://cid-cell-mits.vercel.app' }
    });
};

const sendJoinRequestStatusEmail = async (userEmail, projectName, status) => {
    try {
        const approved = status.toLowerCase() === 'approved';
        const title = approved ? 'JOIN REQUEST APPROVED' : 'JOIN REQUEST DECLARED';
        const colorTitle = approved ? 'successfully integrated' : `marked as ${status}`;

        const html = getPremiumEmailTemplate({
            title,
            preheader: `Update regarding your application to ${projectName}`,
            greeting: `Incoming Network Alert,`,
            bodyLines: [
                `Your recent request to join the project workspace **${projectName}** has been automatically processed.`,
                `Your status has been **${colorTitle}** by the project supervisor.`,
                `Please navigate to your dynamic dashboard to review your active clusters and team communications.`
            ],
            cta: {
                text: 'VIEW TEAMS',
                link: 'https://cid-cell-mits.vercel.app/dashboard'
            }
        });

        const mailOptions = {
            from: `"CID Cell MITS" <${process.env.MAIL_USER}>`,
            to: userEmail,
            subject: `Status Update: ${projectName}`,
            html,
            attachments: getStandardAttachments()
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userEmail} regarding join request ${status}`);
    } catch (error) {
        console.error("Error sending join request email:", error);
    }
};

const sendDoubtSessionRequestEmail = async (mentorEmail, studentName, domain) => {
    try {
        const html = getPremiumEmailTemplate({
            title: 'NEW MENTORSHIP REQUEST',
            preheader: `Doubt session ticket from ${studentName}`,
            greeting: `Hello Mentor,`,
            bodyLines: [
                `A new mentorship ticket has been filed in your sector.`,
                `**Student:** ${studentName}`,
                `**Domain Flag:** ${domain}`,
                `Please authenticate into your administrative dashboard to review the query logs and schedule an advisory sync.`
            ],
            cta: {
                text: 'REVIEW TICKET',
                link: 'https://cid-cell-mits.vercel.app/faculty-dashboard'
            }
        });

        const mailOptions = {
            from: `"CID Cell MITS" <${process.env.MAIL_USER}>`,
            to: mentorEmail,
            subject: `Action Required: Session Request from ${studentName}`,
            html,
            attachments: getStandardAttachments()
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to mentor ${mentorEmail} regarding doubt session`);
    } catch (error) {
        console.error("Error sending doubt session email:", error);
    }
};

const sendEventApprovalEmail = async (organizerEmail, eventName) => {
    try {
        const html = getPremiumEmailTemplate({
            title: 'EVENT COMPILED & APPROVED',
            preheader: `Your proposal for ${eventName} has been accepted.`,
            greeting: `Initiative Authorized,`,
            bodyLines: [
                `Your architectural proposal for **${eventName}** is completely authorized by the administrative subnet.`,
                `The event is now officially injected into the global node matrix and visible to all registered developers.`
            ],
            cta: {
                text: 'MANAGE EVENT',
                link: 'https://cid-cell-mits.vercel.app/events'
            }
        });

        const mailOptions = {
            from: `"CID Cell MITS" <${process.env.MAIL_USER}>`,
            to: organizerEmail,
            subject: `Proposal Approved: ${eventName}`,
            html,
            attachments: getStandardAttachments()
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to organizer ${organizerEmail} regarding event approval`);
    } catch (error) {
        console.error("Error sending event approval email:", error);
    }
};

const sendEventRegistrationEmail = async (userEmail, userName, eventName, date, time) => {
    try {
        const html = getPremiumEmailTemplate({
            title: 'TICKET & RSVP CONFIRMED',
            preheader: `Registration locked for ${eventName}`,
            greeting: `Hello ${userName},`,
            bodyLines: [
                `Your registration node for **${eventName}** has successfully synchronized with our attendance registry.`,
                `**Deployment Date:** ${date}`,
                `**Time:** ${time || 'TBD'}`,
                `Your seat array is securely reserved. Connect to your dashboard via the hub to view live location details or any future timing patches.`
            ],
            cta: {
                text: 'VIEW DETAILS',
                link: 'https://cid-cell-mits.vercel.app/events'
            }
        });

        const mailOptions = {
            from: `"CID Cell MITS" <${process.env.MAIL_USER}>`,
            to: userEmail,
            subject: `RSVP Confirmed: ${eventName}`,
            html,
            attachments: getStandardAttachments()
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userEmail} regarding registration for ${eventName}`);
    } catch (error) {
        console.error("Error sending registration email:", error);
    }
};

module.exports = {
    sendWelcomeEmail,
    getPreviewHtml,
    sendJoinRequestStatusEmail,
    sendDoubtSessionRequestEmail,
    sendEventApprovalEmail,
    sendEventRegistrationEmail
};
