from flask import Flask, render_template, request, jsonify
import string
import random
from math import gcd

app = Flask(__name__)

# ============================================================================
# Vigenère Cipher Implementation
# ============================================================================

class VigenereCipher:
    """
    Vigenère cipher implementation using polyalphabetic substitution.
    Each character in the keyword defines a shift value for the plaintext.
    """
    
    @staticmethod
    def encrypt(plaintext, keyword):
        """
        Encrypt plaintext using Vigenère cipher with given keyword.
        Returns ciphertext and breakdown of each character shift.
        """
        plaintext = plaintext.upper()
        keyword = keyword.upper()
        ciphertext = ""
        breakdown = []
        
        keyword_index = 0
        
        for char in plaintext:
            if char.isalpha():
                # Get the shift value from keyword character
                shift = ord(keyword[keyword_index % len(keyword)]) - ord('A')
                
                # Encrypt character
                char_pos = ord(char) - ord('A')
                encrypted_pos = (char_pos + shift) % 26
                encrypted_char = chr(encrypted_pos + ord('A'))
                
                ciphertext += encrypted_char
                breakdown.append({
                    'plain': char,
                    'cipher': encrypted_char,
                    'shift': shift
                })
                
                keyword_index += 1
            else:
                # Non-alphabetic characters are not encrypted
                ciphertext += char
        
        return ciphertext, breakdown
    
    @staticmethod
    def decrypt(ciphertext, keyword):
        """
        Decrypt ciphertext using Vigenère cipher with given keyword.
        """
        ciphertext = ciphertext.upper()
        keyword = keyword.upper()
        plaintext = ""
        
        keyword_index = 0
        
        for char in ciphertext:
            if char.isalpha():
                # Get the shift value from keyword character
                shift = ord(keyword[keyword_index % len(keyword)]) - ord('A')
                
                # Decrypt character
                char_pos = ord(char) - ord('A')
                decrypted_pos = (char_pos - shift) % 26
                decrypted_char = chr(decrypted_pos + ord('A'))
                
                plaintext += decrypted_char
                keyword_index += 1
            else:
                plaintext += char
        
        return plaintext

# ============================================================================
# El Gamal Encryption Implementation
# ============================================================================

class ElGamalCrypto:
    """
    El Gamal encryption - asymmetric encryption based on discrete logarithm problem.
    """
    
    @staticmethod
    def mod_inverse(a, m):
        """Calculate modular inverse using Fermat's Little Theorem (for prime m)."""
        return pow(a, m - 2, m)
    
    @staticmethod
    def generate_keys(p, g, x):
        """
        Generate El Gamal keys.
        p: prime modulus
        g: primitive root generator
        x: private key (1 < x < p-1)
        Returns: public key y = g^x mod p
        """
        if not (1 < x < p):
            raise ValueError("Private key x must satisfy: 1 < x < p")
        
        if g >= p:
            raise ValueError("Generator g must be less than p")
        
        # Calculate public key: y = g^x mod p
        y = pow(g, x, p)
        return y
    
    @staticmethod
    def encrypt(message, p, g, y):
        """
        Encrypt message using El Gamal.
        message: plaintext message
        p: prime modulus
        g: generator
        y: public key
        Returns: c1_list, c2_list, k (ciphertext components for each character and random k)
        """
        # Convert message to numbers (ASCII values)
        message_numbers = [ord(c) for c in message]
        
        # Choose random k (same for all characters)
        k = random.randint(2, p - 2)
        
        # Calculate c1 = g^k mod p (same for all)
        c1 = pow(g, k, p)
        
        # Calculate shared secret: s = y^k mod p (same for all)
        s = pow(y, k, p)
        
        # Encrypt each character individually
        c2_list = []
        for msg_num in message_numbers:
            # Use ASCII value directly (no artificial reduction)
            # Encrypt: c2 = (message_number * s) mod p
            c2 = (msg_num * s) % p
            c2_list.append(c2)
        
        return c1, c2_list, k, message_numbers
    
    @staticmethod
    def decrypt(c1, c2_list, x, p):
        """
        Decrypt ciphertext using El Gamal.
        c1: first ciphertext component (same for all characters)
        c2_list: list of c2 values (one per character)
        x: private key
        p: prime modulus
        Returns: decrypted message
        """
        # Calculate shared secret: s = c1^x mod p
        s = pow(c1, x, p)
        
        # Calculate modular inverse of s
        s_inv = ElGamalCrypto.mod_inverse(s, p)
        
        # Decrypt each character
        message = ""
        for c2 in c2_list:
            # Decrypt: message_number = (c2 * s_inv) mod p
            msg_num = (c2 * s_inv) % p
            # Convert back to character
            message += chr(msg_num)
        
        return message

# ============================================================================
# Flask Routes
# ============================================================================

@app.route('/')
def index():
    """Render the main HTML template."""
    return render_template('index.html')

@app.route('/vigenere', methods=['POST'])
def vigenere_endpoint():
    """
    Handle Vigenère cipher encryption/decryption.
    POST data:
    - action: 'encrypt' or 'decrypt'
    - plaintext: text to encrypt (for encrypt action)
    - ciphertext: text to decrypt (for decrypt action)
    - keyword: encryption keyword
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        action = data.get('action', '').lower()
        keyword = data.get('keyword', '').strip()
        
        if not keyword:
            return jsonify({'error': 'Keyword is required'}), 400
        
        # Validate keyword contains only letters
        if not keyword.replace(' ', '').isalpha():
            return jsonify({'error': 'Keyword must contain only letters'}), 400
        
        if action == 'encrypt':
            plaintext = data.get('plaintext', '').strip()
            
            if not plaintext:
                return jsonify({'error': 'Plaintext is required'}), 400
            
            ciphertext, breakdown = VigenereCipher.encrypt(plaintext, keyword)
            
            return jsonify({
                'ciphertext': ciphertext,
                'breakdown': breakdown,
                'keyword': keyword.upper()
            })
        
        elif action == 'decrypt':
            ciphertext = data.get('ciphertext', '').strip()
            
            if not ciphertext:
                return jsonify({'error': 'Ciphertext is required'}), 400
            
            plaintext = VigenereCipher.decrypt(ciphertext, keyword)
            
            return jsonify({
                'plaintext': plaintext,
                'keyword': keyword.upper()
            })
        
        else:
            return jsonify({'error': 'Invalid action. Use "encrypt" or "decrypt"'}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/elgamal', methods=['POST'])
def elgamal_endpoint():
    """
    Handle El Gamal encryption/decryption and key generation.
    POST data:
    - action: 'keygen', 'encrypt', or 'decrypt'
    - p: prime modulus
    - g: generator
    - x: private key (for keygen and decrypt)
    - y: public key (for encrypt)
    - message: plaintext (for encrypt)
    - c1, c2: ciphertext components (for decrypt)
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        action = data.get('action', '').lower()
        
        if action == 'keygen':
            p = data.get('p')
            g = data.get('g')
            x = data.get('x')
            
            if not all([p, g, x]):
                return jsonify({'error': 'p, g, and x are required'}), 400
            
            try:
                p, g, x = int(p), int(g), int(x)
            except ValueError:
                return jsonify({'error': 'p, g, and x must be integers'}), 400
            
            # Validate parameters
            if p <= 1:
                return jsonify({'error': 'Prime p must be greater than 1'}), 400
            
            if g >= p:
                return jsonify({'error': 'Generator g must be less than p'}), 400
            
            if x <= 0 or x >= p:
                return jsonify({'error': 'Private key x must satisfy: 0 < x < p'}), 400
            
            try:
                public_key = ElGamalCrypto.generate_keys(p, g, x)
                return jsonify({
                    'public_key': public_key,
                    'p': p,
                    'g': g,
                    'x': x
                })
            except ValueError as ve:
                return jsonify({'error': str(ve)}), 400
        
        elif action == 'encrypt':
            message = data.get('message', '').strip()
            p = data.get('p')
            g = data.get('g')
            y = data.get('y')
            
            if not all([message, p, g, y]):
                return jsonify({'error': 'message, p, g, and y are required'}), 400
            
            try:
                p, g, y = int(p), int(g), int(y)
            except ValueError:
                return jsonify({'error': 'p, g, and y must be integers'}), 400
            
            if len(message) > 500:
                return jsonify({'error': 'Message too long (max 500 characters)'}), 400
            
            try:
                c1, c2_list, k, _ = ElGamalCrypto.encrypt(message, p, g, y)
                return jsonify({
                    'c1': c1,
                    'c2': c2_list,  # Now returns list of c2 values
                    'k': k,
                    'message': message,
                    'message_length': len(message)
                })
            except ValueError as ve:
                return jsonify({'error': str(ve)}), 400
        
        elif action == 'decrypt':
            c1 = data.get('c1')
            c2 = data.get('c2')  # Now expects a list
            x = data.get('x')
            p = data.get('p')
            
            if not all([c1, c2 is not None, x, p]):
                return jsonify({'error': 'c1, c2, x, and p are required'}), 400
            
            try:
                c1, x, p = int(c1), int(x), int(p)
                # Handle c2 as either a list or convert single value to list
                if isinstance(c2, list):
                    c2_list = [int(val) for val in c2]
                else:
                    c2_list = [int(c2)]
            except (ValueError, TypeError):
                return jsonify({'error': 'All parameters must be integers'}), 400
            
            try:
                message = ElGamalCrypto.decrypt(c1, c2_list, x, p)
                return jsonify({
                    'message': message,
                    'c1': c1,
                    'c2': c2_list
                })
            except ValueError as ve:
                return jsonify({'error': str(ve)}), 400
        
        else:
            return jsonify({'error': 'Invalid action. Use "keygen", "encrypt", or "decrypt"'}), 400
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({'error': 'Internal server error'}), 500

# ============================================================================
# Main
# ============================================================================

if __name__ == '__main__':
    # Production: use debug=False and bind to all interfaces
    import os
    debug = os.getenv('FLASK_DEBUG', 'False') == 'True'
    port = int(os.getenv('PORT', 5000))
    app.run(debug=debug, host='0.0.0.0', port=port)
