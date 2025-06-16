import sqlite3
from flask import jsonify, request
from config import CONFIG

def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

def get_db_connection():
    db_conn = sqlite3.connect(CONFIG["database"]["name"])
    db_conn.row_factory = dict_factory
    return db_conn


# user crud
def add_user(body):
    INSERT_user = "INSERT INTO user (Email, Name, Password, Username) VALUES (?, ?, ?, ?)"
    user = body
    email = user.get("Email")
    name = user.get("Name")
    Password = user.get("Password")
    username = user.get("Username")
    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute(INSERT_user, (email, name, Password, username))
    db_conn.commit()
    db_conn.close()
    return jsonify({"Username": username}), 201

def delete_user(Email):
    DELETE_user = "DELETE FROM user WHERE Email=?"
    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute(DELETE_user, (Email,))
    db_conn.commit()
    db_conn.close()
    return "Successfully deleted.", 204

def update_user(email, password):
    update_user_sql = """
    UPDATE user
    SET Password = ?
    WHERE email = ?
    """

    db_conn = get_db_connection()
    cursor = db_conn.cursor()

    cursor.execute(update_user_sql, (password, email))
    db_conn.commit()
    db_conn.close()

    return read_one_user(email)

def list_of_users():
    ALL_users = "SELECT * FROM user"
    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute(ALL_users)
    resultset = cursor.fetchall()
    db_conn.close()
    return jsonify(resultset)


def read_one_user(Email):
    GET_user = "SELECT * FROM user WHERE Email = ?"
    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute(GET_user, (Email,))
    resultset = cursor.fetchone()
    db_conn.close()
    resultset['Email'] = resultset.pop('email', None)
    resultset['Name'] = resultset.pop('name', None)
    resultset['Password'] = resultset.pop('password', None)
    return jsonify(resultset)


# quizes
def add_quiz(body):
    INSERT_QUIZ = "INSERT INTO quizes (TeacherEmail, Name, Column) VALUES (?, ?, ?)"
    INSERT_QUIZ_USER = "INSERT INTO quiz_user (QuizQuiz_ID, TeacherEmail) VALUES (?, ?)"
    quiz = body
    TeacherEmail = quiz.get("TeacherEmail")
    Name = quiz.get("Name")
    Column = quiz.get("Column")
    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute(INSERT_QUIZ, (TeacherEmail, Name, Column))
    quiz_id = cursor.lastrowid
    cursor.execute(INSERT_QUIZ_USER, (quiz_id, TeacherEmail))
    db_conn.commit()
    db_conn.close()

    return jsonify({"Quiz_ID": quiz_id}), 201

def delete_quiz(id):
    DELETE_QUIZ = "DELETE FROM quizes WHERE Quiz_ID=?"
    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute(DELETE_QUIZ, (id,))
    db_conn.commit()
    db_conn.close()
    return "Successfully deleted.", 204

def update_quiz(ID, TeacherEmail, Name, Column):
    UPDATE_QUIZ_SQL = """
    UPDATE quizes
    SET TeacherEmail = ?,
        Name = ?,
        Column = ?
    WHERE Quiz_ID = ?
    """
    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute(UPDATE_QUIZ_SQL, (TeacherEmail, Name, Column, ID))
    db_conn.commit()
    db_conn.close()
    return read_one_quiz(ID)

def list_of_quizes_of_user(email):
    GET_QUIZES = "SELECT * FROM quizes WHERE TeacherEmail = ?"
    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute(GET_QUIZES, (email,))
    resultset = cursor.fetchall()
    db_conn.close()
    return jsonify(resultset)

def read_one_quiz(id):
    GET_QUIZ = "SELECT * FROM quizes WHERE Quiz_ID = ?"
    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute(GET_QUIZ, (id,))
    resultset = cursor.fetchone()
    db_conn.close()
    if resultset:
        resultset["Quiz_ID"] = resultset.pop("Quiz_ID", None)
        resultset["TeacherEmail"] = resultset.pop("TeacherEmail", None)
        resultset["Name"] = resultset.pop("Name", None)
        resultset["Column"] = resultset.pop("Column", None)
        return jsonify(resultset)
    else:
        return jsonify({"error": "Quiz not found"}), 404

#questions
def add_question(body):
    Insert_question = """
        INSERT INTO questions 
        (Quiz_ID, TeacherEmail, Question, PossibleAnswers, RightAnswers, WrongAnswer, Description, AmountAnswers) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """
    question = body
    Quiz_ID = question.get("Quiz_ID")
    TeacherEmail = question.get("TeacherEmail")
    QuestionText = question.get("Question")
    PossibleAnswers = question.get("PossibleAnswers")
    RightAnswers = question.get("RightAnswers")
    WrongAnswer = question.get("WrongAnswer")
    Description = question.get("Description")
    AmountAnswers = question.get("AmountAnswers")

    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute(Insert_question, (
        Quiz_ID, TeacherEmail, QuestionText, PossibleAnswers,
        RightAnswers, WrongAnswer, Description, AmountAnswers
    ))
    db_conn.commit()
    db_conn.close()
    return jsonify({"Question": QuestionText}), 201


def delete_question(id):
    DELETE_Question = "DELETE FROM questions WHERE Questions_id=?"
    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute(DELETE_Question, (id,))
    db_conn.commit()
    db_conn.close()
    return "Successfully deleted.", 204


def update_question(body):
    question = body
    Questions_id = question.get("Questions_id")
    Quiz_ID = question.get("Quiz_ID")
    TeacherEmail = question.get("TeacherEmail")
    QuestionText = question.get("Question")
    PossibleAnswers = question.get("PossibleAnswers")
    RightAnswers = question.get("RightAnswers")
    WrongAnswer = question.get("WrongAnswer")
    Description = question.get("Description")
    AmountAnswers = question.get("AmountAnswers")

    update_question_sql = """
    UPDATE questions
    SET Quiz_ID = ?,
        TeacherEmail = ?,
        Question = ?,
        PossibleAnswers = ?,
        RightAnswers = ?,
        WrongAnswer = ?,
        Description = ?,
        AmountAnswers = ?
    WHERE Questions_id = ?
    """

    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute(update_question_sql, (
        Quiz_ID, TeacherEmail, QuestionText, PossibleAnswers,
        RightAnswers, WrongAnswer, Description, AmountAnswers, Questions_id
    ))
    db_conn.commit()
    db_conn.close()
    return read_one_question(Questions_id)


def list_of_Questions_of_user(TeacherEmail):
    GET_QUESTIONS = "SELECT * FROM questions WHERE TeacherEmail = ?"
    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute(GET_QUESTIONS, (TeacherEmail,))
    resultset = cursor.fetchall()
    db_conn.close()
    return jsonify(resultset)


def read_one_question(id):
    GET_question = "SELECT * FROM questions WHERE Questions_id = ?"
    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute(GET_question, (id,))
    resultset = cursor.fetchone()
    db_conn.close()
    if resultset:
        resultset['Questions_id'] = resultset.pop('Questions_id', None)
        resultset['Quiz_ID'] = resultset.pop('Quiz_ID', None)
        resultset['TeacherEmail'] = resultset.pop('TeacherEmail', None)
        resultset['Question'] = resultset.pop('Question', None)
        resultset['PossibleAnswers'] = resultset.pop('PossibleAnswers', None)
        resultset['RightAnswers'] = resultset.pop('RightAnswers', None)
        resultset['WrongAnswer'] = resultset.pop('WrongAnswer', None)
        resultset['Description'] = resultset.pop('Description', None)
        resultset['AmountAnswers'] = resultset.pop('AmountAnswers', None)
        return jsonify(resultset)
    else:
        return jsonify({"error": "Question not found"}), 404

