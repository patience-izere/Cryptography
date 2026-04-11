// ============================================================================
// Tab Navigation
// ============================================================================

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        switchTab(tabName);
    });
});

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// ============================================================================
// Error Handling
// ============================================================================

function showError(message) {
    const modal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    modal.classList.add('show');
}

function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    modal.classList.remove('show');
}

// Close modal when clicking outside
document.getElementById('errorModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeErrorModal();
    }
});

// ============================================================================
// Vigenère Cipher Functions
// ============================================================================

function resetVigenere() {
    document.getElementById('vig-plaintext').value = '';
    document.getElementById('vig-keyword').value = 'SECRET';
    document.getElementById('vig-output').innerHTML = 'Results will appear here...';
    document.getElementById('vig-ciphertext').innerHTML = '-';
    document.getElementById('vig-steps').innerHTML = '<p class="placeholder">Visualization will appear here...</p>';
}

function encryptVigenere() {
    const plaintext = document.getElementById('vig-plaintext').value.trim();
    const keyword = document.getElementById('vig-keyword').value.trim();

    if (!plaintext) {
        showError('Please enter plaintext to encrypt');
        return;
    }

    if (!keyword) {
        showError('Please enter a keyword');
        return;
    }

    fetch('/vigenere', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            plaintext: plaintext,
            keyword: keyword,
            action: 'encrypt'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showError(data.error);
        } else {
            displayVigenereResult(data, plaintext, keyword);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('An error occurred during encryption');
    });
}

function decryptVigenere() {
    const ciphertext = document.getElementById('vig-ciphertext').innerHTML.replace(/<[^>]*>/g, '').trim();
    const keyword = document.getElementById('vig-keyword').value.trim();

    if (ciphertext === '-' || !ciphertext) {
        showError('Please encrypt a message first, or enter ciphertext');
        return;
    }

    if (!keyword) {
        showError('Please enter a keyword');
        return;
    }

    fetch('/vigenere', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ciphertext: ciphertext,
            keyword: keyword,
            action: 'decrypt'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showError(data.error);
        } else {
            const decrypted = data.plaintext;
            document.getElementById('vig-output').innerHTML = 
                `<strong>Decrypted Message:</strong><br>${escapeHtml(decrypted)}`;
            displayVigenereDecryptSteps(ciphertext, keyword, decrypted);
            document.getElementById('vig-ciphertext').innerHTML = ciphertext.toUpperCase();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('An error occurred during decryption');
    });
}

function displayVigenereResult(data, plaintext, keyword) {
    const ciphertext = data.ciphertext;
    const breakdown = data.breakdown;

    document.getElementById('vig-output').innerHTML = 
        `<strong>Encrypted Message:</strong><br>${escapeHtml(ciphertext)}`;
    
    document.getElementById('vig-ciphertext').innerHTML = escapeHtml(ciphertext);

    displayVigenereSteps(breakdown, keyword);
}

function displayVigenereSteps(breakdown, keyword) {
    const stepsContainer = document.getElementById('vig-steps');
    let stepsHTML = '';
    const keywordUpper = keyword.toUpperCase();

    breakdown.forEach((item, index) => {
        const keyChar = keywordUpper[index % keywordUpper.length];
        const shift = item.shift;
        const cipher = item.cipher;

        stepsHTML += `
            <div class="step">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                    <div class="step-title">
                        '${escapeHtml(item.plain)}' + '${keyChar}' (shift ${shift}) = '${cipher}'
                    </div>
                    <div class="step-detail">
                        Position: ${item.plain.charCodeAt(0) - 65} + ${shift} = ${(item.plain.charCodeAt(0) - 65 + shift) % 26}
                    </div>
                </div>
            </div>
        `;
    });

    stepsContainer.innerHTML = stepsHTML;
}

function displayVigenereDecryptSteps(ciphertext, keyword, plaintext) {
    const stepsContainer = document.getElementById('vig-steps');
    let stepsHTML = '';
    const keywordUpper = keyword.toUpperCase();

    for (let i = 0; i < ciphertext.length; i++) {
        const cipherChar = ciphertext[i].toUpperCase();
        const plainChar = plaintext[i].toUpperCase();
        const keyChar = keywordUpper[i % keywordUpper.length];
        const shift = keyChar.charCodeAt(0) - 65;

        stepsHTML += `
            <div class="step">
                <div class="step-number">${i + 1}</div>
                <div class="step-content">
                    <div class="step-title">
                        '${cipherChar}' - '${keyChar}' (shift ${shift}) = '${plainChar}'
                    </div>
                    <div class="step-detail">
                        Position: ${cipherChar.charCodeAt(0) - 65} - ${shift} = ${(cipherChar.charCodeAt(0) - 65 - shift + 26) % 26}
                    </div>
                </div>
            </div>
        `;
    }

    stepsContainer.innerHTML = stepsHTML;
}

// ============================================================================
// El Gamal Functions
// ============================================================================

function resetElGamal() {
    document.getElementById('eg-message').value = '';
    document.getElementById('eg-prime').value = '61';
    document.getElementById('eg-generator').value = '2';
    document.getElementById('eg-private-key').value = '7';
    document.getElementById('eg-public-key').innerHTML = '-';
    document.getElementById('eg-private-key-display').innerHTML = '-';
    document.getElementById('eg-ciphertext').innerHTML = '-';
    document.getElementById('eg-decrypted').innerHTML = '-';
    document.getElementById('eg-steps').innerHTML = '<p class="placeholder">Steps will appear here...</p>';
}

function generateElGamalKeys() {
    const p = parseInt(document.getElementById('eg-prime').value);
    const g = parseInt(document.getElementById('eg-generator').value);
    const x = parseInt(document.getElementById('eg-private-key').value);

    if (!p || !g || !x) {
        showError('Please enter all parameters');
        return;
    }

    if (p <= 1 || g >= p || x >= p || x <= 0) {
        showError('Invalid parameters. Ensure: p > 1, g < p, 0 < x < p');
        return;
    }

    fetch('/elgamal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            p: p,
            g: g,
            x: x,
            action: 'keygen'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showError(data.error);
        } else {
            document.getElementById('eg-public-key').innerHTML = `y = g^x mod p = ${g}^${x} mod ${p} = <strong>${data.public_key}</strong>`;
            document.getElementById('eg-private-key-display').innerHTML = `<strong>x = ${x}</strong>`;
            
            // Store keys for later use
            window.elgamalKeys = {
                p: p,
                g: g,
                x: x,
                y: data.public_key
            };

            const steps = [
                {
                    title: "Step 1: Choose Parameters",
                    detail: `Prime p: ${p}, Generator g: ${g}, Private key x: ${x}`
                },
                {
                    title: "Step 2: Calculate Public Key",
                    detail: `y = g^x mod p = ${g}^${x} mod ${p} = ${data.public_key}`
                }
            ];
            displayElGamalSteps(steps);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('An error occurred during key generation');
    });
}

function encryptElGamal() {
    const message = document.getElementById('eg-message').value.trim();

    if (!message) {
        showError('Please enter a message to encrypt');
        return;
    }

    if (!window.elgamalKeys) {
        showError('Please generate keys first');
        return;
    }

    fetch('/elgamal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            p: window.elgamalKeys.p,
            g: window.elgamalKeys.g,
            y: window.elgamalKeys.y,
            action: 'encrypt'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showError(data.error);
        } else {
            const c1 = data.c1;
            const c2_list = data.c2;  // Now an array
            const k = data.k;
            const messageLength = data.message_length;

            // Format the ciphertext display
            let ciphertextDisplay = `(c1, c2[]) = (${c1}, [`;
            c2_list.forEach((val, idx) => {
                ciphertextDisplay += val;
                if (idx < c2_list.length - 1) ciphertextDisplay += ', ';
            });
            ciphertextDisplay += '])';

            document.getElementById('eg-ciphertext').innerHTML = ciphertextDisplay;

            // Store ciphertext for decryption
            window.elgamalCiphertext = { c1: c1, c2: c2_list };

            // Build detailed steps for each character
            let detailSteps = "";
            for (let i = 0; i < messageLength; i++) {
                detailSteps += `Char ${i + 1}: '${message[i]}' → c2[${i}] = ${c2_list[i]}<br>`;
            }

            const steps = [
                {
                    title: "Step 1: Choose Random k",
                    detail: `k = ${k} (random, 1 < k < p-1)`
                },
                {
                    title: "Step 2: Calculate c1 (same for all characters)",
                    detail: `c1 = g^k mod p = ${window.elgamalKeys.g}^${k} mod ${window.elgamalKeys.p} = ${c1}`
                },
                {
                    title: "Step 3: Encode Message to ASCII",
                    detail: `Message: "${message}"<br>ASCII: ${Array.from(message).map((c, i) => `'${c}'=${c.charCodeAt(0)}`).join(', ')}`
                },
                {
                    title: "Step 4: Calculate c2 for Each Character",
                    detail: `Each character encrypted separately:<br>${detailSteps}`
                },
                {
                    title: "Ciphertext (Complete)",
                    detail: ciphertextDisplay
                }
            ];

            displayElGamalSteps(steps);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('An error occurred during encryption');
    });
}

function decryptElGamal() {
    if (!window.elgamalCiphertext) {
        showError('Please encrypt a message first');
        return;
    }

    if (!window.elgamalKeys) {
        showError('Please generate keys first');
        return;
    }

    fetch('/elgamal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            c1: window.elgamalCiphertext.c1,
            c2: window.elgamalCiphertext.c2,  // Now an array
            x: window.elgamalKeys.x,
            p: window.elgamalKeys.p,
            action: 'decrypt'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showError(data.error);
        } else {
            const decryptedMessage = data.message;
            const c2_list = data.c2;  // Array of c2 values

            document.getElementById('eg-decrypted').innerHTML = 
                `<strong>Decrypted Message:</strong> <span style="font-weight: bold; color: #667eea;">${escapeHtml(decryptedMessage)}</span>`;

            // Build detailed steps
            let decryptSteps = "";
            for (let i = 0; i < decryptedMessage.length; i++) {
                decryptSteps += `c2[${i}]=${c2_list[i]} → '${decryptedMessage[i]}' (ASCII ${decryptedMessage.charCodeAt(i)})<br>`;
            }

            const steps = [
                {
                    title: "Step 1: Calculate Shared Secret",
                    detail: `s = (c1^x) mod p = ${window.elgamalCiphertext.c1}^${window.elgamalKeys.x} mod ${window.elgamalKeys.p}`
                },
                {
                    title: "Step 2: Calculate Multiplicative Inverse",
                    detail: `s_inv = s^(p-2) mod p (using Fermat's Little Theorem)`
                },
                {
                    title: "Step 3: Decrypt Each Character",
                    detail: `M[i] = (c2[i] × s_inv) mod p then convert to ASCII<br>${decryptSteps}`
                },
                {
                    title: "Decrypted Message",
                    detail: `"${escapeHtml(decryptedMessage)}"`
                }
            ];

            displayElGamalSteps(steps);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('An error occurred during decryption');
    });
}

function displayElGamalSteps(steps) {
    const stepsContainer = document.getElementById('eg-steps');
    let stepsHTML = '';

    steps.forEach((step, index) => {
        stepsHTML += `
            <div class="step">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                    <div class="step-title">${step.title}</div>
                    <div class="step-detail">${escapeHtml(step.detail)}</div>
                </div>
            </div>
        `;
    });

    stepsContainer.innerHTML = stepsHTML;
}

// ============================================================================
// Utility Functions
// ============================================================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Encryption Demo Loaded');
});
