const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

class EmailService {

    // ─── STYLES ─────────────────────────────────────────────────────────────────
    generateStyles() {
        return `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
        font-family: 'Inter', 'Segoe UI', sans-serif;
        background-color: #f0ede0;
        color: #1A1A1A;
        padding: 20px 10px;
        -webkit-font-smoothing: antialiased;
    }

    .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: #FFFDF5;
        border: 3px solid #1A1A1A;
        box-shadow: 8px 8px 0px 0px #1A1A1A;
        overflow: hidden;
    }

    /* ── HAZARD STRIPE TOP BAR ── */
    .hazard-bar {
        height: 12px;
        background-image: repeating-linear-gradient(
            -45deg,
            #FFDE59,
            #FFDE59 10px,
            #1A1A1A 10px,
            #1A1A1A 20px
        );
        border-bottom: 3px solid #1A1A1A;
    }

    /* ── HEADER ── */
    .header {
        background: #1A1A1A;
        padding: 30px 25px 25px;
        text-align: center;
        position: relative;
        border-bottom: 3px solid #1A1A1A;
    }
    .logo-container { margin-bottom: 14px; }
    .logo {
        width: 90px;
        height: 90px;
        border-radius: 0;
        object-fit: contain;
        background: transparent;
        padding: 0;
        display: block;
        margin: 0 auto 12px;
        border: none;
        box-shadow: none;
    }
    .college-name {
        font-family: 'Anton', sans-serif;
        color: #FFFDF5;
        font-size: 20px;
        letter-spacing: 1px;
        margin-bottom: 4px;
        text-transform: uppercase;
    }
    .dept-tag {
        display: inline-block;
        background: #FFDE59;
        color: #1A1A1A;
        font-family: 'Inter', sans-serif;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 3px;
        padding: 3px 12px;
        border: 2px solid #1A1A1A;
        margin: 8px 4px 4px;
    }
    .dept-tag-purple {
        background: #C0B6F2;
    }
    .welcome-title {
        font-family: 'Anton', sans-serif;
        color: #FFDE59;
        font-size: 22px;
        letter-spacing: 1px;
        margin-top: 14px;
        text-transform: uppercase;
    }

    /* ── CONTENT ── */
    .content { padding: 32px 25px; background: #FFFDF5; }

    /* ── STATUS BANNER ── */
    .status-banner {
        padding: 14px 20px;
        margin: 0 0 24px 0;
        text-align: center;
        font-family: 'Inter', sans-serif;
        font-size: 15px;
        font-weight: 700;
        border: 2px solid #1A1A1A;
    }
    .status-verified {
        background: #98FB98;
        color: #1A1A1A;
        box-shadow: 4px 4px 0 #1A1A1A;
    }
    .status-pending {
        background: #FFDE59;
        color: #1A1A1A;
        box-shadow: 4px 4px 0 #1A1A1A;
    }

    /* ── GREETING ── */
    .greeting {
        font-family: 'Anton', sans-serif;
        font-size: 28px;
        color: #1A1A1A;
        margin-bottom: 12px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }
    .sub-text {
        font-family: 'Inter', sans-serif;
        color: #444;
        font-size: 15px;
        text-align: center;
        line-height: 1.7;
        margin-bottom: 28px;
    }

    /* ── DETAILS CARD ── */
    .details-card {
        border: 3px solid #1A1A1A;
        box-shadow: 6px 6px 0 #1A1A1A;
        overflow: hidden;
        margin: 20px 0;
        background: #fff;
    }
    .details-card-header {
        background: #1A1A1A;
        color: #FFDE59;
        padding: 14px 20px;
        font-family: 'Anton', sans-serif;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 2px;
        border-bottom: 3px solid #1A1A1A;
    }
    .details-content {
        padding: 12px;
        font-size: 0;
        text-align: left;
        background: #FFFDF5;
    }
    .detail-item-box {
        display: inline-block;
        width: 46%;
        margin: 2%;
        background: #fff;
        border: 2px solid #1A1A1A;
        box-shadow: 3px 3px 0 #1A1A1A;
        border-radius: 0;
        padding: 14px;
        text-align: left;
        vertical-align: top;
        box-sizing: border-box;
    }
    .detail-label {
        font-family: 'Inter', sans-serif;
        font-size: 10px;
        font-weight: 800;
        color: #777;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 6px;
        display: block;
    }
    .detail-value {
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 700;
        color: #1A1A1A;
        display: block;
        word-break: break-all;
    }
    .details-card-footer {
        background: #f5f0e0;
        padding: 10px 20px;
        border-top: 2px solid #1A1A1A;
        text-align: center;
    }
    .reg-date {
        font-family: 'Inter', sans-serif;
        font-size: 11px;
        color: #777;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    /* ── STATUS PILL ── */
    .status-pill {
        display: inline-block;
        padding: 3px 10px;
        font-family: 'Inter', sans-serif;
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1px;
        border: 2px solid #1A1A1A;
        box-shadow: 2px 2px 0 #1A1A1A;
    }
    .status-pill-verified { background: #98FB98; color: #1A1A1A; }
    .status-pill-pending  { background: #FFDE59; color: #1A1A1A; }

    /* ── CTA BUTTON ── */
    .cta-wrap { text-align: center; margin: 30px 0; }
    .cta-button {
        display: inline-block;
        padding: 14px 32px;
        font-family: 'Anton', sans-serif;
        font-size: 15px;
        text-decoration: none;
        border: 3px solid #1A1A1A;
        color: #1A1A1A;
        background: #FFDE59;
        box-shadow: 6px 6px 0 #1A1A1A;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .cta-button-pending {
        background: #FF914D;
    }
    .cta-sub {
        margin-top: 14px;
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        color: #888;
    }
    .cta-sub a { color: #1A1A1A; font-weight: 700; text-decoration: underline; }

    /* ── FEATURES GRID ── */
    .features-section {
        margin-top: 32px;
        padding-top: 24px;
        border-top: 2px dashed #1A1A1A;
    }
    .features-label {
        font-family: 'Anton', sans-serif;
        font-size: 12px;
        color: #1A1A1A;
        text-transform: uppercase;
        letter-spacing: 3px;
        text-align: center;
        margin-bottom: 16px;
    }
    .feature-box {
        display: inline-block;
        width: 46%;
        margin: 2%;
        background: #fff;
        border: 2px solid #1A1A1A;
        box-shadow: 3px 3px 0 #1A1A1A;
        padding: 18px 10px;
        text-align: center;
        vertical-align: top;
        box-sizing: border-box;
    }
    .feature-icon { font-size: 26px; margin-bottom: 10px; display: block; }
    .feature-text {
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        font-weight: 600;
        color: #1A1A1A;
        line-height: 1.4;
    }

    /* ── SUPPORT SECTION ── */
    .support-section { padding: 10px 25px 25px; }
    .support-title {
        font-family: 'Anton', sans-serif;
        font-size: 13px;
        color: #1A1A1A;
        text-align: center;
        margin-bottom: 14px;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    .support-grid {
        width: 100%;
        border-collapse: separate;
        border-spacing: 10px;
    }
    .support-card {
        background: #FFFDF5;
        padding: 18px 12px;
        text-align: center;
        border: 2px solid #1A1A1A;
        box-shadow: 4px 4px 0 #1A1A1A;
        width: 50%;
        vertical-align: top;
    }
    .support-card-title {
        font-family: 'Inter', sans-serif;
        color: #777;
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 8px;
        display: block;
    }
    .support-card-action {
        font-family: 'Inter', sans-serif;
        color: #1A1A1A;
        font-size: 15px;
        font-weight: 700;
        text-decoration: none;
        display: block;
        margin-bottom: 4px;
    }
    .support-card-detail {
        font-family: 'Inter', sans-serif;
        color: #888;
        font-size: 11px;
    }

    /* ── FOOTER ── */
    .footer {
        background: #1A1A1A;
        color: white;
        padding: 28px 20px;
        text-align: center;
        border-top: 3px solid #1A1A1A;
    }
    .footer-portal-name {
        font-family: 'Anton', sans-serif;
        font-size: 16px;
        color: #FFDE59;
        letter-spacing: 3px;
        text-transform: uppercase;
        margin-bottom: 6px;
    }
    .footer-inst {
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        color: rgba(255,255,255,0.65);
        margin-bottom: 18px;
    }
    .footer-credit {
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        color: #ffffff;
        margin-bottom: 6px;
    }
    .footer-credit a {
        color: #FFDE59;
        text-decoration: none;
        font-weight: 700;
    }
    .footer-copy {
        font-family: 'Inter', sans-serif;
        font-size: 11px;
        color: rgba(255,255,255,0.4);
    }

    /* ── HAZARD BOTTOM BAR ── */
    .hazard-bar-bottom {
        height: 12px;
        background-image: repeating-linear-gradient(
            -45deg,
            #C0B6F2,
            #C0B6F2 10px,
            #1A1A1A 10px,
            #1A1A1A 20px
        );
        border-top: 3px solid #1A1A1A;
    }

    @media only screen and (max-width: 480px) {
        .detail-item-box { width: 96%; margin: 2%; }
        .feature-box { width: 96%; margin: 2%; }
        .support-card { display: block; width: 100% !important; margin-bottom: 10px; }
        .greeting { font-size: 22px; }
        .welcome-title { font-size: 18px; }
    }
</style>`;
    }

    // ─── HEADER ─────────────────────────────────────────────────────────────────
    generateHeader(title) {
        return `
<div class="hazard-bar"></div>
<div class="header">
    <div class="logo-container">
        <img src="cid:logo" alt="CID Cell Logo" class="logo">
    </div>
    <div class="college-name">Madhav Institute of Technology &amp; Science</div>
    <div>
        <span class="dept-tag">CID-Cell</span>
        <span class="dept-tag dept-tag-purple">CSE DEPT</span>
    </div>
    <div class="welcome-title">${title}</div>
</div>`;
    }

    // ─── SUPPORT SECTION ─────────────────────────────────────────────────────────
    generateSupportSection() {
        return `
<div class="support-section">
    <div class="support-title">Quick Support &amp; Access</div>
    <table class="support-grid">
        <tr>
            <td class="support-card">
                <span class="support-card-title">Visit Website</span>
                <a href="https://cid-cell-mits.vercel.app" class="support-card-action">Visit Portal</a>
                <span class="support-card-detail">cid-cell-mits.vercel.app</span>
            </td>
            <td class="support-card">
                <span class="support-card-title">Direct Support</span>
                <a href="mailto:cidcellmits@gmail.com" class="support-card-action">Contact Support</a>
                <span class="support-card-detail">cidcellmits@gmail.com</span>
            </td>
        </tr>
    </table>
</div>`;
    }

    // ─── FOOTER ─────────────────────────────────────────────────────────────────
    generateFooter() {
        const year = new Date().getFullYear();
        return `
<div class="footer">
    <div class="footer-portal-name">CID Cell Portal</div>
    <div class="footer-inst">Madhav Institute of Technology &amp; Science, Gwalior — CSE Dept</div>
    <div class="footer-credit">
        Made with &#10084;&#65039; by <a href="https://cid-cell-mits.vercel.app">CID Cell Team</a>
        &nbsp;under&nbsp; <span style="color:#C0B6F2; font-weight:700;">Software Development Club</span>
    </div>
    <div class="footer-copy">&copy; ${year} CID Cell MITS &mdash; All rights reserved</div>
    <div style="display:none;visibility:hidden;opacity:0;font-size:1px;line-height:1px;max-height:0;overflow:hidden;">Ref:${Date.now()}</div>
</div>
<div class="hazard-bar-bottom"></div>`;
    }

    // ─── WELCOME TEMPLATE ────────────────────────────────────────────────────────
    generateWelcomeTemplate(user) {
        const userTypeText = user.userType === 'alumni' ? 'Alumni' : 'Student';
        const isVerified = true; // New CID Cell users are always verified on creation

        const features = [
            { icon: '📂', text: 'Collaborate on cutting-edge Projects' },
            { icon: '🎓', text: 'Connect with Mentors for guidance' },
            { icon: '📌', text: 'Participate in Campus Events' },
            { icon: '📈', text: 'Follow Skill Roadmaps &amp; grow' },
        ];

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to CID Cell</title>
    ${this.generateStyles()}
</head>
<body>
<div class="email-container">

    ${this.generateHeader('CID Cell Portal')}

    <div class="content">

        <!-- Status Banner -->
        <div class="status-banner ${isVerified ? 'status-verified' : 'status-pending'}">
            ${isVerified ? '&#9989; Account Verified &amp; Ready to Use' : '&#128274; Registration Under Verification'}
        </div>

        <!-- Greeting -->
        <div class="greeting">Welcome, ${user.username || 'New Member'}!</div>
        <p class="sub-text">
            ${isVerified
                ? `Great news! Your account has been officially verified. You now have full access to all CID Cell features.`
                : `Thank you for joining us. Our administration team is currently reviewing your registration details for verification.`
            }
        </p>

        <!-- Account Overview Card -->
        <div class="details-card">
            <div class="details-card-header">Account Overview</div>
            <div class="details-content">

                <div class="detail-item-box">
                    <span class="detail-label">Verified Name</span>
                    <span class="detail-value">${user.username || 'N/A'}</span>
                </div>

                <div class="detail-item-box">
                    <span class="detail-label">✉️ &nbsp;Login Email</span>
                    <span class="detail-value">${user.email || 'N/A'}</span>
                </div>

                ${user.branch ? `
                <div class="detail-item-box">
                    <span class="detail-label">🏛️ &nbsp;Specialization</span>
                    <span class="detail-value">${user.branch}</span>
                </div>` : ''}

                ${user.batch ? `
                <div class="detail-item-box">
                    <span class="detail-label">📆 &nbsp;Batch Year</span>
                    <span class="detail-value">${user.batch}</span>
                </div>` : ''}

            </div>
            <div class="details-card-footer">
                <span class="reg-date">Joined: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
        </div>

        <!-- CTA Button -->
        <div class="cta-wrap">
            <a href="https://cid-cell-mits.vercel.app" class="cta-button ${isVerified ? '' : 'cta-button-pending'}">
                ${isVerified ? '&#9654; Enter CID Cell' : '&#9203; Review in Progress'}
            </a>
            ${isVerified ? `
            <div class="cta-sub">
                Or copy: <a href="https://cid-cell-mits.vercel.app">cid-cell-mits.vercel.app</a>
            </div>` : ''}
        </div>

        <!-- Platform Capabilities -->
        <div class="features-section">
            <div class="features-label">Platform Capabilities</div>
            <div style="font-size:0; text-align:left;">
                ${features.map(f => `
                <div class="feature-box">
                    <span class="feature-icon">${f.icon}</span>
                    <div class="feature-text">${f.text}</div>
                </div>`).join('')}
            </div>
        </div>

    </div><!-- /content -->

    ${this.generateSupportSection()}
    ${this.generateFooter()}

</div><!-- /email-container -->
</body>
</html>`;
    }

    // ─── SEND WELCOME EMAIL ──────────────────────────────────────────────────────
    async sendWelcomeEmail(user) {
        try {
            if (!user || !user.email) throw new Error('User object with email is required');

            const mailOptions = {
                from: `"CID Cell MITS" <${process.env.MAIL_USER}>`,
                to: user.email,
                subject: '🎉 Welcome to CID Cell — Access Granted!',
                html: this.generateWelcomeTemplate(user),
                attachments: [{
                    filename: 'logo.png',
                    path: path.join(__dirname, '../assets/logo.png'),
                    cid: 'logo'
                }],
                priority: 'high',
                headers: {
                    'X-Priority': '1',
                    'X-MSMail-Priority': 'High',
                    'Importance': 'high'
                }
            };

            const result = await transporter.sendMail(mailOptions);
            console.log(`✅ Welcome email sent to ${user.email} — ID: ${result.messageId}`);
            return { success: true, messageId: result.messageId };

        } catch (error) {
            let errorDetails = error.message;
            if (error.code === 'EAUTH')        errorDetails = 'Authentication failed — check Gmail credentials/app password';
            else if (error.code === 'ECONNECTION') errorDetails = 'Connection failed — check internet & SMTP settings';
            else if (error.code === 'ETIMEDOUT')   errorDetails = 'Connection timed out — check firewall settings';
            else if (error.code === 'ESOCKET')     errorDetails = 'Socket error — port 587 may be blocked';
            else if (error.code === 'EMESSAGE')    errorDetails = 'Message rejected — check email content & recipient';

            console.error(`❌ Failed to send welcome email to ${user.email}: ${errorDetails}`);
            return { success: false, error: errorDetails, code: error.code };
        }
    }

    // ─── BROWSER PREVIEW ────────────────────────────────────────────────────────
    getPreviewHtml() {
        const dummyUser = {
            username: 'Harsh Manmode',
            email: 'harsh@mitsgwl.ac.in',
            userType: 'student',
            branch: 'Information Technology',
            batch: '2024-2028',
            enrollmentNo: 'BTIT24O1058'
        };
        let html = this.generateWelcomeTemplate(dummyUser);
        html = html.replace('cid:logo', '/api/auth/logo-preview');
        return html;
    }
}

const emailService = new EmailService();
module.exports = emailService;
