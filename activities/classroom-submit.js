/**
 * Classroom Submission Module
 * Add this script to worksheets to enable submission to Firebase
 *
 * Usage: Include this script and firebase-config.js in your worksheet,
 * then add the submission UI by calling initClassroomSubmit()
 */

(function() {
    'use strict';

    let db = null;
    let worksheetId = null;

    // Detect worksheet ID from filename
    function detectWorksheetId() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '').replace('-worksheet', '');
        return filename || 'unknown';
    }

    // Initialize Firebase connection
    function initFirebase() {
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK not loaded');
            return false;
        }

        if (typeof firebaseConfig === 'undefined') {
            console.warn('Firebase config not found');
            return false;
        }

        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            db = firebase.firestore();
            return true;
        } catch (e) {
            console.error('Firebase initialization error:', e);
            return false;
        }
    }

    // Collect all form answers
    function collectAnswers() {
        const answers = {};

        // Collect radio button answers
        document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
            answers[radio.name] = radio.value;
        });

        // Collect checkbox answers
        const checkboxGroups = {};
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            if (!checkboxGroups[checkbox.name]) {
                checkboxGroups[checkbox.name] = [];
            }
            checkboxGroups[checkbox.name].push(checkbox.value);
        });
        Object.entries(checkboxGroups).forEach(([name, values]) => {
            answers[name] = values;
        });

        // Collect textarea answers
        document.querySelectorAll('textarea').forEach((textarea, index) => {
            const id = textarea.id || textarea.name || `textarea_${index}`;
            if (textarea.value.trim()) {
                answers[id + '_text'] = textarea.value.trim();
            }
        });

        // Collect other inputs
        document.querySelectorAll('.other-input').forEach((input, index) => {
            if (input.value.trim()) {
                answers[`other_${index}`] = input.value.trim();
            }
        });

        return answers;
    }

    // Submit answers to Firebase
    async function submitToFirebase(sessionCode) {
        if (!db) {
            throw new Error('Firebase not initialized');
        }

        const answers = collectAnswers();

        if (Object.keys(answers).length === 0) {
            throw new Error('No answers to submit');
        }

        const submission = {
            timestamp: new Date().toISOString(),
            answers: answers
        };

        await db.collection('sessions')
            .doc(sessionCode.toUpperCase())
            .collection(worksheetId)
            .add(submission);

        return submission;
    }

    // Create and inject the submission UI
    function createSubmissionUI() {
        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .submission-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                padding: 20px;
                z-index: 1000;
                width: 280px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .submission-panel.minimized {
                width: auto;
                padding: 10px 15px;
            }

            .submission-panel.minimized .submission-content {
                display: none;
            }

            .submission-panel h4 {
                margin: 0 0 15px 0;
                color: #333;
                font-size: 1rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .submission-panel .minimize-btn {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0 5px;
                color: #666;
            }

            .submission-panel input[type="text"] {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 1.1rem;
                text-transform: uppercase;
                letter-spacing: 3px;
                text-align: center;
                margin-bottom: 10px;
                box-sizing: border-box;
            }

            .submission-panel input[type="text"]:focus {
                outline: none;
                border-color: #4CAF50;
            }

            .submission-panel .submit-btn {
                width: 100%;
                padding: 12px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }

            .submission-panel .submit-btn:hover {
                background: #45a049;
            }

            .submission-panel .submit-btn:disabled {
                background: #ccc;
                cursor: not-allowed;
            }

            .submission-panel .status {
                margin-top: 10px;
                padding: 10px;
                border-radius: 6px;
                font-size: 0.9rem;
                text-align: center;
            }

            .submission-panel .status.success {
                background: #e8f5e9;
                color: #2e7d32;
            }

            .submission-panel .status.error {
                background: #ffebee;
                color: #c62828;
            }

            .submission-panel .status.info {
                background: #e3f2fd;
                color: #1565c0;
            }

            .submission-panel .answer-count {
                font-size: 0.85rem;
                color: #666;
                margin-bottom: 10px;
            }

            .submission-panel .demo-mode {
                font-size: 0.8rem;
                color: #ff9800;
                margin-top: 10px;
                text-align: center;
            }

            @media print {
                .submission-panel {
                    display: none;
                }
            }

            @media (max-width: 600px) {
                .submission-panel {
                    top: auto;
                    bottom: 80px;
                    right: 10px;
                    left: 10px;
                    width: auto;
                }
            }
        `;
        document.head.appendChild(styles);

        // Create panel
        const panel = document.createElement('div');
        panel.className = 'submission-panel';
        panel.innerHTML = `
            <h4>
                Submit Answers
                <button class="minimize-btn" onclick="toggleSubmissionPanel()">−</button>
            </h4>
            <div class="submission-content">
                <input type="text" id="sessionCodeInput" placeholder="SESSION CODE" maxlength="6">
                <div class="answer-count" id="answerCount">0 answers recorded</div>
                <button class="submit-btn" id="submitBtn" onclick="submitAnswers()">Submit to Class</button>
                <div class="status" id="submitStatus" style="display: none;"></div>
                <div class="demo-mode" id="demoMode" style="display: none;">Demo mode - Firebase not configured</div>
            </div>
        `;
        document.body.appendChild(panel);

        // Load saved session code
        const savedCode = localStorage.getItem('classroom-session-code');
        if (savedCode) {
            document.getElementById('sessionCodeInput').value = savedCode;
        }

        // Update answer count periodically
        updateAnswerCount();
        setInterval(updateAnswerCount, 2000);

        // Check Firebase status
        if (!db) {
            document.getElementById('demoMode').style.display = 'block';
        }
    }

    // Update answer count display
    function updateAnswerCount() {
        const answers = collectAnswers();
        const count = Object.keys(answers).length;
        const countEl = document.getElementById('answerCount');
        if (countEl) {
            countEl.textContent = `${count} answer${count !== 1 ? 's' : ''} recorded`;
        }
    }

    // Toggle panel minimized state
    window.toggleSubmissionPanel = function() {
        const panel = document.querySelector('.submission-panel');
        const btn = panel.querySelector('.minimize-btn');
        panel.classList.toggle('minimized');
        btn.textContent = panel.classList.contains('minimized') ? '+' : '−';
    };

    // Submit answers
    window.submitAnswers = async function() {
        const sessionCode = document.getElementById('sessionCodeInput').value.trim();
        const submitBtn = document.getElementById('submitBtn');
        const statusEl = document.getElementById('submitStatus');

        if (!sessionCode || sessionCode.length < 4) {
            showStatus('Please enter a valid session code', 'error');
            return;
        }

        // Save session code for next time
        localStorage.setItem('classroom-session-code', sessionCode);

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            if (db) {
                await submitToFirebase(sessionCode);
                showStatus('Submitted successfully!', 'success');
            } else {
                // Demo mode - just show success
                await new Promise(resolve => setTimeout(resolve, 500));
                showStatus('Demo: Would submit to session ' + sessionCode.toUpperCase(), 'info');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showStatus('Error: ' + error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit to Class';
        }
    };

    // Show status message
    function showStatus(message, type) {
        const statusEl = document.getElementById('submitStatus');
        statusEl.textContent = message;
        statusEl.className = 'status ' + type;
        statusEl.style.display = 'block';

        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                statusEl.style.display = 'none';
            }, 3000);
        }
    }

    // Initialize
    window.initClassroomSubmit = function() {
        worksheetId = detectWorksheetId();
        initFirebase();
        createSubmissionUI();
        console.log('Classroom submission initialized for worksheet:', worksheetId);
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.initClassroomSubmit);
    } else {
        // DOM already loaded, wait a bit for other scripts
        setTimeout(window.initClassroomSubmit, 100);
    }
})();
