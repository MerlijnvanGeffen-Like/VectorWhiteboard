import sqlite3
import os

def update_database():
    try:
        # Connect to the database
        conn = sqlite3.connect('quiz_manager.db')
        cursor = conn.cursor()

        # Maak een tijdelijke tabel met de nieuwe structuur
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS quiz_summaries_new (
            Summary_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            UserEmail TEXT NOT NULL,
            Quiz_ID INTEGER NOT NULL,
            Screenshot_URL TEXT NOT NULL,
            Questions_Data TEXT NOT NULL,
            Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (UserEmail) REFERENCES user(Email),
            FOREIGN KEY (Quiz_ID) REFERENCES quizes(Quiz_ID),
            UNIQUE(UserEmail, Quiz_ID)
        )
        ''')

        # Verwijder de oude tabel
        cursor.execute('DROP TABLE IF EXISTS quiz_summaries')

        # Hernoem de nieuwe tabel
        cursor.execute('ALTER TABLE quiz_summaries_new RENAME TO quiz_summaries')

        # Commit de wijzigingen en sluit de verbinding
        conn.commit()
        conn.close()
        print("Database succesvol geüpdatet naar de nieuwe structuur met screenshot en quiz data")

    except Exception as e:
        print(f"Error updating database: {str(e)}")
        if conn:
            conn.close()

if __name__ == "__main__":
    update_database() 