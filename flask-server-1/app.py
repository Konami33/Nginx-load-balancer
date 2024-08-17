from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, from Flask server 1!"

@app.route('/api/data')
def get_data():
    data = {"message": "Hello, World!", "status": "success"}
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
