from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

OLLAMA_URL = "http://localhost:11434/api/generate"
# Fast & lightweight model for instant response
MODEL_NAME = "qwen2.5:0.5b" 

@app.route('/api/analyze-subsystem', methods=['POST'])
def analyze_subsystem():
    data = request.json or {}
    subsystem = data.get('subsystem', 'General')
    target_role = data.get('target_role', 'Software Engineer')
    resume_text = data.get('resume_text', '')[:300]

    prompt = f"Role: {target_role}\nSubsystem: {subsystem}\nProvide 2 very short actionable points. Max 30 words."

    try:
        res = requests.post(OLLAMA_URL, json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
            "options": {
                "num_predict": 40,
                "temperature": 0.2
            }
        }, timeout=60) # Increased timeout to 60s
        
        result_data = res.json()
        return jsonify({"success": True, "response": result_data.get("response", "No response generated.")})
    except Exception as e:
        return jsonify({"success": False, "error": f"Ollama Timeout/Error: {str(e)}"}), 500


@app.route('/api/ask-question', methods=['POST'])
def ask_question():
    data = request.json or {}
    question = data.get('question', '')
    target_role = data.get('target_role', 'Software Engineer')

    prompt = f"Target Role: {target_role}\nQuestion: {question}\nAnswer in 1-2 sentences."

    try:
        res = requests.post(OLLAMA_URL, json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
            "options": {
                "num_predict": 40,
                "temperature": 0.2
            }
        }, timeout=60) # Increased timeout to 60s
        
        result_data = res.json()
        return jsonify({"success": True, "response": result_data.get("response", "No response generated.")})
    except Exception as e:
        return jsonify({"success": False, "error": f"Ollama Timeout/Error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)