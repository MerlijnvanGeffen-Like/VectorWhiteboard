from flask import Flask, render_template, request, redirect, jsonify, make_response, send_from_directory
from jose import jwt
from datetime import datetime, timedelta
from config import CONFIG
import sqlite3
from create_db import hash_password
import json
from flask_cors import CORS
import os
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__, static_folder='../vector-whiteboard/build')
CORS(app, 
     resources={r"/api/*": {"origins": ["http://localhost:3000"], "supports_credentials": True}},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
app.secret_key = CONFIG["jwt"]["secret_key"]
app.config['JSON_SORT_KEYS'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

def get_db_connection():
    conn = sqlite3.connect(CONFIG["database"]["name"])
    conn.row_factory = sqlite3.Row
    return conn

def create_access_token(data: dict, expire_minutes: int):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, CONFIG["jwt"]["secret_key"], algorithm=CONFIG["jwt"]["algorithm"])
    return encoded_jwt

def verify_token(token):
    try:
        payload = jwt.decode(token, CONFIG["jwt"]["secret_key"], algorithms=[CONFIG["jwt"]["algorithm"]])
        return payload
    except Exception:
        return None

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")
    username = data.get("username")

    if not all([email, name, password, username]):
        return jsonify({"error": "All fields are required"}), 400

    conn = get_db_connection()
    try:
        hashed_password = hash_password(password)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO user (Email, Name, Password, Username)
            VALUES (?, ?, ?, ?)
        """, (email, name, hashed_password, username))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username or email already exists"}), 400
    finally:
        conn.close()

@app.route("/api/login", methods=["POST"])
def login():
    print("Login request received")
    data = request.get_json()
    print(f"Request data: {data}")
    email = data.get("email")
    password = data.get("password")
    remember_me = data.get("remember_me", False)

    if not email or not password:
        print("Missing email or password")
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        print(f"Searching for user with email: {email}")
        cursor.execute("SELECT * FROM user WHERE Email = ?", (email,))
        user = cursor.fetchone()
        print(f"User found: {user is not None}")

        if user and user["Password"] == hash_password(password):
            print("Password verified, creating token")
            # Set token expiration based on remember_me
            expire_minutes = 10080 if remember_me else CONFIG["jwt"]["access_token_expire_minutes"]  # 7 days if remember_me is True
            token = create_access_token(data={"user_id": user["Email"]}, expire_minutes=expire_minutes)
            response = make_response(jsonify({
                "message": "Login successful",
                "user": {
                    "email": user["Email"],
                    "name": user["Name"],
                    "username": user["Username"]
                }
            }))
            # Set cookie expiration based on remember_me
            max_age = 7 * 24 * 60 * 60 if remember_me else None  # 7 days in seconds if remember_me is True
            response.set_cookie("token", token, httponly=True, samesite='Lax', max_age=max_age)
            print("Login successful")
            return response
        else:
            print("Invalid credentials")
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        print(f"Error during login: {str(e)}")
        return jsonify({"error": "An error occurred during login"}), 500
    finally:
        conn.close()

def get_user_email_from_token(token):
    try:
        payload = jwt.decode(token, CONFIG["jwt"]["secret_key"], algorithms=[CONFIG["jwt"]["algorithm"]])
        return payload.get("user_id")
    except Exception:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        payload = verify_token(token)
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        # Geef een dict met 'email' door als current_user
        return f({'email': payload.get('user_id')}, *args, **kwargs)
    return decorated

@app.route('/api/quiz-summaries', methods=['POST'])
@token_required
def save_quiz_summary(current_user):
    try:
        data = request.get_json()
        print('Received POST /api/quiz-summaries:', data)
        user_email = current_user['email']
        quiz_id = data.get('quizId')
        quiz_name = data.get('quizName')
        quiz_data = json.dumps({
            'questions': data.get('questions', []),
            'trueFalseQuestions': data.get('trueFalseQuestions', []),
            'polls': data.get('polls', []),
            'theme': data.get('theme')
        })
        print(f'Saving summary for user: {user_email}, quiz_id: {quiz_id}')
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('DELETE FROM quiz_summaries WHERE user_email = ? AND quiz_id = ?', (user_email, quiz_id))
        c.execute('''
            INSERT INTO quiz_summaries (user_email, quiz_id, quiz_name, quiz_data)
            VALUES (?, ?, ?, ?)
        ''', (user_email, quiz_id, quiz_name, quiz_data))
        conn.commit()
        conn.close()
        print('Summary saved to DB.')
        return jsonify({'message': 'Quiz summary saved', 'quizId': quiz_id}), 200
    except Exception as e:
        print('Error in save_quiz_summary:', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/quiz-summaries', methods=['GET'])
@token_required
def get_quiz_summaries(current_user):
    user_email = current_user['email']
    quiz_id = request.args.get('quiz_id')
    conn = get_db_connection()
    c = conn.cursor()
    if quiz_id:
        c.execute('SELECT quiz_id, quiz_name, quiz_data FROM quiz_summaries WHERE user_email = ? AND quiz_id = ?', (user_email, quiz_id))
    else:
        c.execute('SELECT quiz_id, quiz_name, quiz_data FROM quiz_summaries WHERE user_email = ? ORDER BY updated_at DESC', (user_email,))
    rows = c.fetchall()
    conn.close()
    summaries = {}
    for row in rows:
        quiz_id = row['quiz_id']
        quiz_name = row['quiz_name']
        quiz_data = json.loads(row['quiz_data'])
        summaries[quiz_id] = {
            'quizId': quiz_id,
            'quizName': quiz_name,
            **quiz_data
        }
    return jsonify({'summaries': summaries}), 200

@app.route('/api/quiz-summaries/<quiz_id>', methods=['DELETE'])
def delete_quiz_summary(quiz_id):
    try:
        token = request.cookies.get('token')
        if not token:
            return jsonify({'error': 'No token provided'}), 401

        user_email = get_user_email_from_token(token)
        if not user_email:
            return jsonify({'error': 'Invalid token'}), 401

        conn = get_db_connection()
        cursor = conn.cursor()

        # Verwijder de summary
        cursor.execute('DELETE FROM quiz_summaries WHERE user_email = ? AND quiz_id = ?', (user_email, quiz_id))
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'Quiz summary not found'}), 404

        conn.commit()
        conn.close()
        return jsonify({'message': 'Quiz summary deleted successfully'})

    except Exception as e:
        print(f"Error deleting quiz summary: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route("/api/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({"message": "Logged out successfully"}))
    response.delete_cookie("token")
    return response

@app.route("/api/current-quiz", methods=["POST"])
def save_current_quiz():
    token = request.cookies.get("token")
    if not token:
        return jsonify({"error": "Not authenticated"}), 401

    payload = verify_token(token)
    if not payload:
        return jsonify({"error": "Invalid token"}), 401

    data = request.get_json()
    quiz_id = data.get("quiz_id")

    if not quiz_id:
        return jsonify({"error": "Quiz ID is required"}), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        # Check if user already has a current quiz
        cursor.execute("""
            SELECT Quiz_ID FROM current_quizzes 
            WHERE UserEmail = ?
        """, (payload["user_id"],))
        existing = cursor.fetchone()

        if existing:
            # Update existing quiz
            cursor.execute("""
                UPDATE current_quizzes 
                SET Quiz_ID = ?, Updated_At = CURRENT_TIMESTAMP
                WHERE UserEmail = ?
            """, (quiz_id, payload["user_id"]))
        else:
            # Insert new quiz
            cursor.execute("""
                INSERT INTO current_quizzes (UserEmail, Quiz_ID)
                VALUES (?, ?)
            """, (payload["user_id"], quiz_id))
        
        conn.commit()
        return jsonify({"message": "Current quiz saved successfully"}), 201
    finally:
        conn.close()

@app.route("/api/current-quiz", methods=["GET"])
def get_current_quiz():
    token = request.cookies.get("token")
    if not token:
        return jsonify({"error": "Not authenticated"}), 401

    payload = verify_token(token)
    if not payload:
        return jsonify({"error": "Invalid token"}), 401

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT Quiz_ID FROM current_quizzes 
            WHERE UserEmail = ?
        """, (payload["user_id"],))
        quiz = cursor.fetchone()
        
        if quiz:
            return jsonify({"quiz_id": quiz["Quiz_ID"]})
        else:
            return jsonify({"quiz_id": None})
    finally:
        conn.close()

@app.route('/api/quiz-question', methods=['POST'])
@token_required
def save_quiz_question(current_user):
    data = request.get_json()
    print('Received POST /api/quiz-question:', data)
    user_email = current_user['email']
    quiz_id = data.get('quizId')
    question_data = json.dumps(data.get('question'))
    print(f'Saving question for user: {user_email}, quiz_id: {quiz_id}')
    
    # Determine question type
    question = data.get('question', {})
    question_type = 'quiz'
    if 'answer' in question and isinstance(question['answer'], bool):
        question_type = 'true_false'
    elif 'options' in question:
        question_type = 'poll'
    
    conn = get_db_connection()
    c = conn.cursor()
    
    # Save to quiz_questions table
    c.execute('''
        INSERT INTO quiz_questions (user_email, quiz_id, question_data, question_type)
        VALUES (?, ?, ?, ?)
    ''', (user_email, quiz_id, question_data, question_type))
    
    # Also save to quiz_summaries to maintain backward compatibility
    c.execute('''
        SELECT quiz_data FROM quiz_summaries
        WHERE user_email = ? AND quiz_id = ?
    ''', (user_email, quiz_id))
    summary = c.fetchone()
    
    if summary:
        summary_data = json.loads(summary['quiz_data'])
        if question_type == 'quiz':
            summary_data['questions'].append(question)
        elif question_type == 'true_false':
            summary_data['trueFalseQuestions'].append(question)
        elif question_type == 'poll':
            summary_data['polls'].append(question)
        
        c.execute('''
            UPDATE quiz_summaries
            SET quiz_data = ?
            WHERE user_email = ? AND quiz_id = ?
        ''', (json.dumps(summary_data), user_email, quiz_id))
    else:
        summary_data = {
            'questions': [],
            'trueFalseQuestions': [],
            'polls': [],
            'theme': 'default'
        }
        if question_type == 'quiz':
            summary_data['questions'].append(question)
        elif question_type == 'true_false':
            summary_data['trueFalseQuestions'].append(question)
        elif question_type == 'poll':
            summary_data['polls'].append(question)
        
        c.execute('''
            INSERT INTO quiz_summaries (user_email, quiz_id, quiz_name, quiz_data)
            VALUES (?, ?, ?, ?)
        ''', (user_email, quiz_id, f'Quiz {quiz_id}', json.dumps(summary_data)))
    
    conn.commit()
    conn.close()
    print('Question saved to DB.')
    return jsonify({'message': 'Question saved'}), 200

@app.route('/api/quiz-questions', methods=['GET'])
@token_required
def get_quiz_questions(current_user):
    user_email = current_user['email']
    quiz_id = request.args.get('quiz_id')
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        SELECT question_data FROM quiz_questions
        WHERE user_email = ? AND quiz_id = ?
        ORDER BY created_at ASC
    ''', (user_email, quiz_id))
    rows = c.fetchall()
    conn.close()
    questions = [json.loads(row['question_data']) for row in rows]
    return jsonify({'questions': questions}), 200

@app.route('/api/user-quizzes', methods=['GET'])
@token_required
def get_user_quizzes(current_user):
    user_email = current_user['email']
    conn = get_db_connection()
    c = conn.cursor()
    
    # Get all quiz questions, grouped by type
    c.execute('''
        SELECT question_data, question_type FROM quiz_questions
        WHERE user_email = ?
        ORDER BY created_at ASC
    ''', (user_email,))
    quiz_questions = []
    true_false_questions = []
    polls = []
    for row in c.fetchall():
        q = json.loads(row['question_data'])
        qtype = row['question_type']
        if qtype == 'quiz':
            quiz_questions.append(q)
        elif qtype == 'true_false':
            true_false_questions.append(q)
        elif qtype == 'poll':
            polls.append(q)
    
    conn.close()
    
    return jsonify({
        'quiz_questions': quiz_questions,
        'true_false_questions': true_false_questions,
        'polls': polls
    }), 200

@app.route('/api/quiz-question/<question_id>', methods=['DELETE'])
@token_required
def delete_quiz_question(current_user, question_id):
    try:
        user_email = current_user['email']
        conn = get_db_connection()
        c = conn.cursor()
        
        # Delete from quiz_questions table
        c.execute('''
            DELETE FROM quiz_questions 
            WHERE user_email = ? AND id = ?
        ''', (user_email, question_id))
        
        conn.commit()
        conn.close()
        return jsonify({'message': 'Question deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting question: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/quiz-questions/all', methods=['DELETE'])
@token_required
def delete_all_quiz_questions(current_user):
    try:
        user_email = current_user['email']
        conn = get_db_connection()
        c = conn.cursor()
        
        # Delete all questions for the user
        c.execute('''
            DELETE FROM quiz_questions 
            WHERE user_email = ?
        ''', (user_email,))
        
        conn.commit()
        conn.close()
        return jsonify({'message': 'All questions deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting all questions: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    token = request.cookies.get('token')
    if not token:
        return jsonify({'authenticated': False}), 200
    payload = verify_token(token)
    if not payload:
        return jsonify({'authenticated': False}), 200
    user_email = payload.get('user_id')
    if not user_email:
        return jsonify({'authenticated': False}), 200
    # Fetch user info
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT Email, Name, Username FROM user WHERE Email = ?', (user_email,))
    user = cursor.fetchone()
    conn.close()
    if not user:
        return jsonify({'authenticated': False}), 200
    return jsonify({'authenticated': True, 'user': {
        'email': user['Email'],
        'name': user['Name'],
        'username': user['Username']
    }}), 200

if __name__ == "__main__":
    app.run(
        host=CONFIG["frontend"]["listen_ip"],
        port=CONFIG["frontend"]["port"],
        debug=CONFIG["frontend"]["debug"],
        threaded=True
    )
