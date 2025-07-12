from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from models import db, User, bcrypt
from config import Config

# NLTK + Summarizer Imports
import nltk
nltk.download('punkt_tab')
import os
import traceback
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer as SumyTokenizer
from sumy.summarizers.lsa import LsaSummarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

# Configure NLTK data path
NLTK_DATA_PATH = os.path.join(os.path.dirname(__file__), 'nltk_data')
os.makedirs(NLTK_DATA_PATH, exist_ok=True)
nltk.data.path.append(NLTK_DATA_PATH)

# Download required NLTK data
try:
    nltk.download('punkt', download_dir=NLTK_DATA_PATH, quiet=True)
    nltk.download('stopwords', download_dir=NLTK_DATA_PATH, quiet=True)
except Exception as e:
    print(f"Error downloading NLTK data: {e}")

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400
    new_user = User(**data)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        token = create_access_token(identity=str(user.id))
        return jsonify(access_token=token), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "nickname": user.nickname
    })

@app.route('/summarize', methods=['POST'])
@jwt_required()
def summarize():
    data = request.get_json()
    text = data.get('text', '')

    if not text.strip():
        return jsonify({"error": "No text provided"}), 400

    try:
        # Verify punkt is available
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt', download_dir=NLTK_DATA_PATH, quiet=True)
            nltk.data.path.append(NLTK_DATA_PATH)

        # Create parser
        parser = PlaintextParser.from_string(text, SumyTokenizer("english"))

        # Summarizer setup
        summarizer = LsaSummarizer(Stemmer("english"))
        summarizer.stop_words = get_stop_words("english")

        # Generate summary
        summary = summarizer(parser.document, 3)
        summarized_text = " ".join(str(sentence) for sentence in summary)

        return jsonify({"summary": summarized_text})
    
    except Exception as e:
        print("❌ Exception in /summarize route:")
        traceback.print_exc()
        return jsonify({"error": "Failed to summarize text", "details": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
