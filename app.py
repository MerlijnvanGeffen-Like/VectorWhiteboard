from flask import Flask, render_template, request, jsonify
import json
import base64

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save_path', methods=['POST'])
def save_path():
    try:
        data = request.json
        return jsonify({
            'success': True,
            'path_data': data['path_data']
        })
    except Exception as e:
        print(f"Error in save_path: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(debug=True) 