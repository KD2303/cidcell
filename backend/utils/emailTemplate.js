/**
 * Simplified Retro-themed welcome email template
 * Focuses on: Name, Branch, Batch Year
 * @param {Object} user - User object containing name, branch, batch, etc.
 * @returns {string} HTML string
 */
const getRetroWelcomeTemplate = (user) => {
    const username = user.username || 'Player One';
    const branch = user.branch || 'N/A';
    const batch = user.batch || 'N/A';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to CID CELL</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

        body {
            margin: 0;
            padding: 0;
            background-color: #0d0221;
            font-family: 'VT323', monospace;
            color: #39ff14;
            -webkit-font-smoothing: antialiased;
        }

        .container {
            max-width: 500px;
            margin: 30px auto;
            background: #1a0b2e;
            border: 4px solid #ff00ff;
            box-shadow: 0 0 15px #ff00ff, 10px 10px 0px #00ffff;
            padding: 30px;
            position: relative;
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 2px solid #00ffff;
            padding-bottom: 15px;
        }

        .title {
            font-family: 'Press Start 2P', cursive;
            font-size: 20px;
            color: #39ff14;
            text-transform: uppercase;
            margin: 0;
            text-shadow: 3px 3px #ff00ff;
        }

        .status-bar {
            background: #000;
            color: #39ff14;
            padding: 5px 10px;
            font-size: 11px;
            margin-bottom: 20px;
            border: 1px solid #39ff14;
            display: flex;
            justify-content: space-between;
        }

        .terminal-text {
            font-size: 18px;
            line-height: 1.5;
        }

        .user-greeting {
            color: #ffff00;
            font-size: 22px;
            display: block;
            margin-bottom: 20px;
            border-left: 4px solid #ff00ff;
            padding-left: 10px;
        }

        .info-grid {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid #00ffff;
            padding: 15px;
            margin: 20px 0;
        }

        .info-item {
            display: block;
            margin-bottom: 8px;
        }

        .label {
            color: #00ffff;
            font-weight: bold;
            text-transform: uppercase;
            width: 80px;
            display: inline-block;
        }

        .value {
            color: #ffffff;
        }

        .btn-container {
            text-align: center;
            margin: 30px 0;
        }

        .retro-button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #ff00ff;
            color: #ffffff;
            text-decoration: none;
            font-family: 'Press Start 2P', cursive;
            font-size: 12px;
            border: 3px solid #00ffff;
            box-shadow: 6px 6px 0px #39ff14;
        }

        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #888;
            text-align: center;
            border-top: 1px dotted #00ffff;
            padding-top: 15px;
        }

        .pixel-art {
            text-align: center;
            font-family: monospace;
            white-space: pre;
            color: #39ff14;
            font-size: 6px;
            line-height: 1;
            margin: 20px 0;
            opacity: 0.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="status-bar">
            <span>CID_OS_VER.2.1</span>
            <span>AUTH: OK</span>
        </div>

        <div class="header">
            <img src="cid:logo" alt="CID" style="max-height: 50px; margin-bottom: 10px;">
            <h1 class="title">ACCESS GRANTED</h1>
        </div>

        <div class="terminal-text">
            <span class="user-greeting">> WELCOME, ${username.toUpperCase()}</span>
            
            <p>Your profile has been <span style="color: #00ffff;">Verified</span> and initialized in the CID Cell Database.</p>
            
            <div class="info-grid">
                <div class="info-item">
                    <span class="label">NAME:</span>
                    <span class="value">${username.toUpperCase()}</span>
                </div>
                <div class="info-item">
                    <span class="label">BRANCH:</span>
                    <span class="value">${branch.toUpperCase()}</span>
                </div>
                <div class="info-item">
                    <span class="label">BATCH:</span>
                    <span class="value">${batch.toUpperCase()}</span>
                </div>
            </div>

            <div class="btn-container">
                <a href="https://cid-cell-mits.vercel.app" class="retro-button">ENTER DASHBOARD</a>
            </div>
        </div>

        <div class="pixel-art">
  _      __________________  __  __________
 | | /| / / __/ / ___/ __ \/  |/  / __/
 | |/ |/ / _// / /__/ /_/ / /|_/ / _/  
 |__/|__/___/_/\___/\____/_/  /_/___/  
        </div>

        <div class="footer">
            [SYS]: USER_INIT_COMPLETE<br>
            MITS GWALIOR - CID CELL &copy; 2026
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = { getRetroWelcomeTemplate };
