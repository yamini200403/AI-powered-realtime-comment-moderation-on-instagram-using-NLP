from flask import Flask, request, jsonify
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) 

# 🔹 Define Paths (Ensure Model & Tokenizer are in these folders)
BASE_DIR = r"C:\yamini\demo\pro1\src\Backend"
MODEL_PATH = os.path.join(BASE_DIR, "tanglish_model")
TOKENIZER_PATH = os.path.join(BASE_DIR, "tanglish_tokenizer")

# 🔹 Check if GPU is available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"✅ Using device: {device}")

# 🔹 Load Model & Tokenizer
try:
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH).to(device)
    tokenizer = AutoTokenizer.from_pretrained(TOKENIZER_PATH)
    print("✅ Model and tokenizer loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model/tokenizer: {e}")
    exit(1)

# 🔹 Prediction Function
def predict_comment(comment):
    try:
        inputs = tokenizer(comment, return_tensors="pt", padding=True, truncation=True, max_length=512).to(device)
        
        with torch.no_grad():
            outputs = model(**inputs)
        
        logits = outputs.logits
        prediction = torch.argmax(logits, dim=1).item()  # 0 = Negative, 1 = Positive
        
        return {"prediction": "Non-Offensive" if prediction == 1 else "Offensive"}
    
    except Exception as e:
        print(f"❌ Prediction Error: {e}")
        return {"error": "Internal server error during prediction"}

# 🔹 Home Route
@app.route("/", methods=["GET"])
def home():
    return "Flask Server is Running!"

# 🔹 Prediction Route
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    
    # Debugging: Print received request data
    print("Received JSON:", data)
    
    comment = data.get("comment") or data.get("text")  # Accept both "comment" and "text" as keys
    
    if not comment:
        return jsonify({"error": "No text provided"}), 400

    comment = comment.strip()
    result = predict_comment(comment)
    
    return jsonify(result)

# 🔹 Run the Flask App
if __name__ == "__main__":
    print(f"🔹 Model Path: {MODEL_PATH}")
    print(f"🔹 Tokenizer Path: {TOKENIZER_PATH}")
    app.run(host="0.0.0.0", port=5002)  # Removed debug=True for production safety
