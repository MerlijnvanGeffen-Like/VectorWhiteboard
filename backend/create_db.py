import sqlite3
import sys
from config import CONFIG
import hashlib
from werkzeug.security import generate_password_hash

class QuizManagerDB:
    @staticmethod
    def initialize(database_connection: sqlite3.Connection):
        cursor = database_connection.cursor()
        try:
            print("Dropping existing tables (if present)...")
            cursor.execute("DROP TABLE IF EXISTS user")
            cursor.execute("DROP TABLE IF EXISTS quizes")
            cursor.execute("DROP TABLE IF EXISTS questions")
            cursor.execute("DROP TABLE IF EXISTS quiz_user")
            cursor.execute("DROP TABLE IF EXISTS quiz_summaries")
            cursor.execute("DROP TABLE IF EXISTS quiz_questions")
        except sqlite3.OperationalError as db_error:
            print(f"Unable to drop table. Error: {db_error}")

        print("Creating tables...")
        cursor.execute(QuizManagerDB.CREATE_TABLE_user)
        cursor.execute(QuizManagerDB.CREATE_TABLE_quizes)
        cursor.execute(QuizManagerDB.CREATE_TABLE_questions)
        cursor.execute(QuizManagerDB.CREATE_TABLE_quiz_user)
        cursor.execute(QuizManagerDB.CREATE_TABLE_quiz_summaries)
        cursor.execute(QuizManagerDB.CREATE_TABLE_quiz_questions)
        database_connection.commit()

    CREATE_TABLE_user = """ 
    CREATE TABLE IF NOT EXISTS user (
        Email TEXT PRIMARY KEY,
        Name TEXT NOT NULL,
        Password TEXT NOT NULL,
        Username TEXT NOT NULL UNIQUE
    )
    """

    CREATE_TABLE_quizes = """
    CREATE TABLE IF NOT EXISTS quizes (
        Quiz_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        TeacherEmail TEXT NOT NULL,
        FOREIGN KEY (TeacherEmail) REFERENCES user(Email)
    )
    """

    CREATE_TABLE_questions = """
    CREATE TABLE IF NOT EXISTS questions (
        Questions_id INTEGER PRIMARY KEY AUTOINCREMENT,
        Quiz_ID INTEGER NOT NULL,
        TeacherEmail TEXT NOT NULL,
        Question TEXT NOT NULL,
        PossibleAnswers INTEGER NOT NULL,
        RightAnswers TEXT NOT NULL,
        WrongAnswer TEXT NOT NULL,
        Description TEXT NOT NULL,
        AmountAnswers INTEGER NOT NULL,
        FOREIGN KEY (Quiz_ID) REFERENCES quizes(Quiz_ID),
        FOREIGN KEY (TeacherEmail) REFERENCES user(Email)
    )
    """

    CREATE_TABLE_quiz_user = """
    CREATE TABLE IF NOT EXISTS quiz_user (
        QuizQuiz_ID INTEGER NOT NULL,
        TeacherEmail TEXT NOT NULL,
        FOREIGN KEY (QuizQuiz_ID) REFERENCES quizes(Quiz_ID),
        FOREIGN KEY (TeacherEmail) REFERENCES user(Email),
        PRIMARY KEY (QuizQuiz_ID, TeacherEmail)
    )
    """

    CREATE_TABLE_quiz_summaries = """
    CREATE TABLE IF NOT EXISTS quiz_summaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        quiz_id TEXT NOT NULL,
        quiz_name TEXT,
        quiz_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_email, quiz_id)
    )
    """

    CREATE_TABLE_quiz_questions = """
    CREATE TABLE IF NOT EXISTS quiz_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        quiz_id TEXT NOT NULL,
        question_data TEXT NOT NULL,
        question_type TEXT NOT NULL DEFAULT 'quiz',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """

def hash_password(password: str) -> str:
    """Hash a password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()

def insert_test_user(db_conn):
    try:
        cursor = db_conn.cursor()
        hashed_password = hash_password("test12345")
        cursor.execute("""
            INSERT INTO user (Email, Name, Password, Username)
            VALUES (?, ?, ?, ?)
        """, ("test@test.com", "Test User", hashed_password, "testuser"))
        db_conn.commit()
        print("Test user inserted.")
    except sqlite3.IntegrityError:
        print("Test user already exists or failed to insert.")

def get_db_connection():
    conn = sqlite3.connect(CONFIG["database"]["name"])
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        UserEmail TEXT PRIMARY KEY,
        Username TEXT UNIQUE NOT NULL,
        Password TEXT NOT NULL,
        Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Create quiz_summaries table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS quiz_summaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        quiz_id TEXT NOT NULL,
        quiz_name TEXT,
        quiz_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_email, quiz_id)
    )
    ''')

    # Create current_quizzes table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS current_quizzes (
        UserEmail TEXT PRIMARY KEY,
        Quiz_ID INTEGER NOT NULL,
        Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserEmail) REFERENCES users(UserEmail)
    )
    ''')

    # Create test user
    cursor.execute('''
    INSERT OR IGNORE INTO users (UserEmail, Username, Password)
    VALUES (?, ?, ?)
    ''', ('test@test.com', 'testuser', generate_password_hash('test12345')))

    conn.commit()
    conn.close()

def main():
    db_conn = sqlite3.connect(CONFIG["database"]["name"])
    db_conn.row_factory = sqlite3.Row
    QuizManagerDB.initialize(db_conn)
    insert_test_user(db_conn)
    db_conn.close()
    print("Database creation finished!")
    return 0

if __name__ == "__main__":
    create_tables()
    print("Database initialized with test user")
    sys.exit(main())
