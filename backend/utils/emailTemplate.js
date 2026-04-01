/**
 * Unified Premium Email Template
 * Dynamically wrapped with the CID-Cell Cybernetic Glassmorphism branding.
 * 
 * @param {Object} options
 * @param {string} options.title - The main heading of the email
 * @param {string} options.preheader - Hidden preheader text for email clients
 * @param {string} options.greeting - The greeting line (e.g. "Hello Anurag,")
 * @param {string[]} options.bodyLines - Array of HTML strings for the body paragraphs
 * @param {Object} [options.cta] - Optional Call-To-Action button
 * @param {string} options.cta.text - The text on the button
 * @param {string} options.cta.link - The URL the button directs to
 * @returns {string} Fully rendered HTML string
 */
const getPremiumEmailTemplate = ({ title, preheader, greeting, bodyLines, cta }) => {
    
    // Check if a line is a bold key-value pair and style it like a badge
    const bodyHtml = bodyLines.map(line => {
        if (line.startsWith('**') && line.includes(':**')) {
            const [keyBlock, val] = line.split(':**');
            const key = keyBlock.replace('**', '').trim();
            const value = val ? val.trim() : '';
            return `<div style="margin-bottom: 12px; padding: 12px 16px; background-color: #1a1a1a; border-left: 3px solid #8b5cf6; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                      <strong style="color: #a78bfa; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">${key}:</strong> 
                      <span style="color: #f8fafc; font-size: 15px; margin-left: 8px;">${value}</span>
                    </div>`;
        }
        return `<p style="margin-bottom: 20px; color: #cbd5e1; font-size: 16px; line-height: 1.6;">${line}</p>`;
    }).join('');

    const ctaHtml = cta ? `
        <div style="text-align: center; margin: 45px 0 25px 0;">
            <a href="${cta.link}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%); color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 50px; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);">
                ${cta.text}
            </a>
        </div>
    ` : '';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    
    <!-- Hidden Preheader for Mail Clients -->
    <span style="display:none;font-size:1px;color:#050505;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader || title}</span>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #050505; padding: 40px 10px;">
        <tr>
            <td align="center">
                <!-- Main Glass Container -->
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #0a0a0a; border: 1px solid #1f1f1f; border-top: 4px solid #8b5cf6; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);">
                    <tr>
                        <td style="padding: 40px 30px; text-align: left;">
                            
                            <!-- Header / Logo Area -->
                            <div style="text-align: center; margin-bottom: 35px; border-bottom: 1px solid #1f1f1f; padding-bottom: 35px;">
                                <img src="cid:logo" alt="CID Cell Matrix" width="180" style="max-width: 200px; height: auto; display: inline-block;">
                            </div>

                            <!-- Title -->
                            <h1 style="color: #ffffff; font-size: 26px; font-weight: 900; line-height: 1.25; margin: 0 0 25px 0; text-transform: uppercase; letter-spacing: 1.5px; text-align: center;">
                                ${title}
                            </h1>

                            <!-- Greeting -->
                            <p style="color: #c4b5fd; font-size: 18px; font-weight: 600; margin-bottom: 25px;">
                                ${greeting}
                            </p>

                            <!-- Dynamic Body Content -->
                            ${bodyHtml}

                            <!-- Optional CTA Button -->
                            ${ctaHtml}

                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin-top: 30px;">
                    <tr>
                        <td align="center" style="padding: 0 20px;">
                            <p style="color: #64748b; font-size: 12px; margin: 0 0 10px 0; letter-spacing: 1px; text-transform: uppercase;">
                                SECURE TRANSMISSION • CID-CELL MATRIX
                            </p>
                            <p style="color: #475569; font-size: 12px; margin: 0;">
                                MITS Gwalior &copy; ${new Date().getFullYear()}<br>
                                Automated System Notice - Please do not reply directly.
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>

</body>
</html>
    `;
};

module.exports = { getPremiumEmailTemplate };
