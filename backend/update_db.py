import sqlite3
import os

def update_database():
    try:
        # Connect to the database
        conn = sqlite3.connect('quiz_manager.db')
        cursor = conn.cursor()

        # Check if the column already exists
        cursor.execute("PRAGMA table_info(quiz_summaries)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'Screenshot_URL' not in columns:
            # Add the new column
            cursor.execute('ALTER TABLE quiz_summaries ADD COLUMN Screenshot_URL TEXT')
            print("Successfully added Screenshot_URL column to quiz_summaries table")
        else:
            print("Screenshot_URL column already exists")

        # Commit the changes and close the connection
        conn.commit()
        conn.close()
        print("Database update completed successfully")

    except Exception as e:
        print(f"Error updating database: {str(e)}")
        if conn:
            conn.close()

if __name__ == "__main__":
    update_database() 