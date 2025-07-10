# backend/app.py
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows communication with frontend

@app.route('/')
def home():
    return {"message": "Note Summarizer Backend Running"}

if __name__ == '__main__':
    app.run(debug=True)
