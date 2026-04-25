# Group 5 members:
### Irakoze Ritha Theonestine		26016751
### RUTIJANWA Herve		26017216
### NTAGANIRA Victor First-born		25052719
### Gitare Shema Nobel		26016298
### Clement MUTUYIMANA		25095065
### HATANGIMBABAZI Hilaire		25093937
### Izere Marie Vincent Patience		25093891

#  Encryption Algorithms Assignment

A comprehensive web application demonstrating two fundamental encryption algorithms:
- **Vigenère Cipher** (Polyalphabetic substitution)
- **El Gamal Encryption** (Asymmetric encryption based on discrete logarithms)

## Project Structure

```
CN CS Assignment/
├── app.py                    # Flask backend with encryption implementations
├── requirements.txt          # Python dependencies
├── templates/
│   └── index.html           # Main HTML template with two tabs
├── static/
│   ├── css/
│   │   └── style.css        # Styling for both tabs
│   └── js/
│       └── script.js        # Frontend logic and AJAX calls
└── README.md                # This file
```

## Installation & Setup

### Prerequisites
- Python 3.7 or higher
- Flask 2.3.3 or compatible

### Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

Or manually install Flask:
```bash
pip install Flask
```

### Step 2: Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

### Step 3: Open in Browser

Navigate to `http://localhost:5000` in your web browser.

## Features

### Tab 1: Vigenère Cipher

**What it does:**
- Encrypts plaintext using a keyword-based polyalphabetic substitution
- Each character in the keyword determines the shift for each plaintext character
- Stronger than Caesar cipher because the shift varies

**How to use:**
1. Enter plaintext (letters only)
2. Enter a keyword (letters only)
3. Click "Encrypt" to encrypt the message
4. Click "Decrypt" to decrypt (uses the ciphertext from encryption)

**Example Input/Output:**
```
Plaintext: HELLOWORLD
Keyword: SECRET
Ciphertext: ZQQQNNWPAP
```

**Visualization:**
- Step-by-step breakdown showing each character shift
- Display of which keyword character is used for each plaintext character
- Position values showing the mathematical shift calculation

---

### Tab 2: El Gamal Encryption

**What it does:**
- Implements asymmetric encryption based on discrete logarithm problem
- Generates public-private key pair
- Encrypts messages using public key
- Decrypts using private key

**How to use:**
1. Enter parameters:
   - Prime number (p): A large prime (default: 61)
   - Generator (g): Primitive root of p (default: 2)
   - Private key (x): 1 < x < p (default: 7)
2. Click "Generate Keys" to create public key y
3. Enter a message (max 20 characters)
4. Click "Encrypt" to encrypt the message
5. Click "Decrypt" to decrypt the ciphertext

**Example Parameters:**
```
Prime (p): 61
Generator (g): 2
Private Key (x): 7
Public Key (y): 2^7 mod 61 = 45
```

**Example Encryption/Decryption:**
```
Message: "HELLO"
After encryption: (c1=..., c2=...)
After decryption: "HELLO"
```

**Mathematical Process:**
1. **Key Generation:**
   - Public key y = g^x mod p
   - Private key x kept secret

2. **Encryption:**
   - Choose random k
   - c1 = g^k mod p
   - Shared secret s = y^k mod p
   - c2 = (message × s) mod p
   - Send (c1, c2)

3. **Decryption:**
   - Recover s = c1^x mod p
   - Calculate s_inv = s^(p-2) mod p (Fermat's Little Theorem)
   - message = (c2 × s_inv) mod p

## API Endpoints

### GET `/`
Returns the main HTML page.

### POST `/vigenere`
Handles Vigenère cipher operations.

**Request Body (Encrypt):**
```json
{
  "action": "encrypt",
  "plaintext": "HELLOWORLD",
  "keyword": "SECRET"
}
```

**Response (Encrypt):**
```json
{
  "ciphertext": "ZQQQNNWPAP",
  "breakdown": [
    {"plain": "H", "cipher": "Z", "shift": 18},
    {"plain": "E", "cipher": "Q", "shift": 4},
    ...
  ],
  "keyword": "SECRET"
}
```

**Request Body (Decrypt):**
```json
{
  "action": "decrypt",
  "ciphertext": "ZQQQNNWPAP",
  "keyword": "SECRET"
}
```

**Response (Decrypt):**
```json
{
  "plaintext": "HELLOWORLD",
  "keyword": "SECRET"
}
```

### POST `/elgamal`
Handles El Gamal encryption operations.

**Request Body (Key Generation):**
```json
{
  "action": "keygen",
  "p": 61,
  "g": 2,
  "x": 7
}
```

**Response (Key Generation):**
```json
{
  "public_key": 45,
  "p": 61,
  "g": 2,
  "x": 7
}
```

**Request Body (Encrypt):**
```json
{
  "action": "encrypt",
  "message": "HELLO",
  "p": 61,
  "g": 2,
  "y": 45
}
```

**Response (Encrypt):**
```json
{
  "c1": 35,
  "c2": 48,
  "k": 23,
  "message": "HELLO"
}
```

**Request Body (Decrypt):**
```json
{
  "action": "decrypt",
  "c1": 35,
  "c2": 48,
  "x": 7,
  "p": 61
}
```

**Response (Decrypt):**
```json
{
  "message": "HELLO",
  "c1": 35,
  "c2": 48
}
```

## Testing Examples

### Vigenère Cipher Test Cases

**Test 1: Basic Encryption**
- Input: "ATTACKATDAWN", Keyword: "KEY"
- Expected: "KXEXICBQSGD"

**Test 2: With Spaces**
- Input: "HELLO WORLD", Keyword: "SECRET"
- Expected: "ZQQQN CZZAO"

**Test 3: Different Keyword**
- Input: "CRYPTOGRAPHY", Keyword: "CIPHER"
- Expected: "EVPTSGZVGTYD"

### El Gamal Test Cases

**Test 1: Small Prime (for verification)**
```
p = 23 (prime)
g = 5 (primitive root)
x = 6 (private key)
y = 5^6 mod 23 = 8 (public key)
Message: "A"
Encrypt: Produces (c1, c2)
Decrypt: Recovers "A"
```

**Test 2: Larger Prime**
```
p = 61
g = 2
x = 7
y = 2^7 mod 61 = 45
Message: "HELLO"
Encrypt: Produces (c1, c2)
Decrypt: Recovers "HELLO"
```

## Visualization Features

### Vigenère Cipher Visualization
- Shows each step of the encryption process
- Displays the plaintext character, keyword character, shift amount, and resulting ciphertext character
- Shows the position calculation (plaintext_pos + shift) mod 26

### El Gamal Visualization
- Step-by-step breakdown of key generation
- Shows the random k selection during encryption
- Displays modular exponentiation calculations
- Shows the shared secret calculation during decryption

## Error Handling

The application includes comprehensive error handling:

1. **Vigenère Cipher:**
   - Input validation for plaintext and keyword
   - Checks that keyword contains only letters
   - Error messages for empty inputs

2. **El Gamal Encryption:**
   - Validates that p, g, x are valid integers and mathematically sound
   - Ensures 1 < x < p
   - Ensures g < p
   - Limits message length (max 20 characters)
   - Error modal displays for all validation errors

## How to Extend

### Adding More Algorithms
1. Implement the encryption algorithm class (e.g., `RSACrypto`)
2. Add API endpoint in `app.py`
3. Add HTML tab in `templates/index.html`
4. Add CSS styling for the new tab
5. Add JavaScript functions in `static/js/script.js`

### Improving Visualization
- Add more detailed breakdowns in the API response
- Use Canvas or SVG for graphical representations
- Add animation to the step-by-step process

## Security Notice

⚠️ **This is a EDUCATIONAL DEMONSTRATION ONLY**

This application is designed for learning purposes. The implementations are simplified for clarity:
- Vigenère cipher is known to be vulnerable to frequency analysis
- El Gamal implementation uses small primes and simplified message encoding
- Random number generation is not cryptographically secure
- This should NOT be used for actual encryption of sensitive data

For real-world encryption, use established libraries like:
- `cryptography` (Python)
- OpenSSL
- libsodium

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Port 5000 Already in Use
```bash
# Change the port in app.py
if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5001)
```

### Module Not Found Error
```bash
# Ensure Flask is installed
pip install Flask --upgrade
```

### CORS Issues
The application runs entirely on localhost by default. If you need CORS support, install Flask-CORS:
```bash
pip install Flask-CORS
```

## License

Educational use only.

## Author Notes

This project demonstrates:
1. Understanding of classical cryptography (Vigenère)
2. Understanding of modern asymmetric cryptography (El Gamal)
3. Full-stack web development (Frontend HTML/CSS/JS + Backend Python/Flask)
4. API design and RESTful principles
5. Interactive visualization of cryptographic processes

## Further Reading

- **Vigenère Cipher:** https://en.wikipedia.org/wiki/Vigenère_cipher
- **El Gamal Encryption:** https://en.wikipedia.org/wiki/ElGamal_encryption
- **Discrete Logarithm:** https://en.wikipedia.org/wiki/Discrete_logarithm
- **Public Key Cryptography:** https://en.wikipedia.org/wiki/Public-key_cryptography
