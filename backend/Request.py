import json
import requests
from config import CONFIG

def add_task(description, status, username):
    new_task = {
        "Description": description,
        "Status": status,
        "CreatedBye": username
    }
    response = requests.post(f"{CONFIG['api']['url']}/task", json=new_task)
    return response.json().get("id")

def list_of_tasks(username):
    results = requests.get(f"{CONFIG['api']['url']}/task", params={"username": username})
    tasks = json.loads(results.text)
    for task in tasks:
        if 'id' in task:
            task['student_id'] = task.pop('id')
    return tasks

def recently_done_tasks(username):
    results = requests.get(f"{CONFIG['api']['url']}/taskscompleted", params={"username": username, "task_id": "completed"})
    tasks = json.loads(results.text)
    for task in tasks:
        if 'id' in task:
            task['student_id'] = task.pop('id')
    return tasks

def get_task(task_id):
    result = requests.get(f"{CONFIG['api']['url']}/task/{task_id}")
    task = json.loads(result.text)
    if 'id' in task:
        task['student_id'] = task.pop('id')
    return task

def update_task(task):
    updated_task = {
        "id": task["student_id"],
        "Status": "completed"
    }
    response = requests.put(f"{CONFIG['api']['url']}/task/{task['student_id']}", json=updated_task)
    return response.json()

def delete_task(task_id):
    requests.delete(f"{CONFIG['api']['url']}/task/{task_id}")

def list_of_users():
    results = requests.get(f"{CONFIG['api']['url']}/User")
    return json.loads(results.text)

def add_user(Username, password):
    new_user = {
        "Username": Username,
        "Password": password
    }
    requests.post(f"{CONFIG['api']['url']}/User", json=new_user)


#user crud
def add_user(Email, name, password, username):
    new_user = {
        "Email": Email,
        "Name": name,
        "Password": password,
        "Username": username
    }
    requests.post(f"{CONFIG['api']['url']}/User", json=new_user)

def delete_user(Email):
    requests.delete(f"{CONFIG['api']['url']}/User/{Email}")

def update_user(email, password):
    updated_user = {
        "E-mail": email,
        "Password": password
    }
    response = requests.put(f"{CONFIG['api']['url']}/User/{email}", json=updated_user)
    return response.json()

def list_of_users():
    results = requests.get(f"{CONFIG['api']['url']}/User")
    return json.loads(results.text) 

def get_user(email):
    response = requests.get(f"{CONFIG['api']['url']}/User/{email}")
    user = json.loads(response.text)
    return user

#quizes
def add_quiz(UserEmail, name):
    new_quiz = {
        "UserEmail": UserEmail,
        "Name": name
    }
    requests.post(f"{CONFIG['api']['url']}/Quizes", json=new_quiz)

def delete_quiz(quiz_id):
    requests.delete(f"{CONFIG['api']['url']}/Quize/{quiz_id}")

def update_quiz(quiz_id, UserEmail, Name):
    updated_quiz = {
        "UserEmail": UserEmail,
        "Name": Name
    }
    response = requests.put(f"{CONFIG['api']['url']}/Quize/{quiz_id}", json=updated_quiz)
    return response.json()

def list_of_quizes_of_users(userMail):
    results = requests.get(f"{CONFIG['api']['url']}/Quiz{userMail}")
    return json.loads(results.text) 

def delete_quiz(quiz_id):
    requests.delete(f"{CONFIG['api']['url']}/Quize/{quiz_id}")

def get_question(quiz_id):
    response = requests.get(f"{CONFIG['api']['url']}/Quize/{quiz_id}")
    user = json.loads(response.text)
    return user

#questions
def add_question(Quiz_ID, TeacherEmail, Question, PossibleAnswers, RightAnswers, WrongAnswer, Description, AmountAnswers):
    new_question = {
        "Quiz_ID": Quiz_ID,
        "TeacherEmail": TeacherEmail,
        "Question": Question,
        "PossibleAnswers": PossibleAnswers,
        "RightAnswers": RightAnswers,
        "WrongAnswer": WrongAnswer,
        "Description": Description,
        "AmountAnswers": AmountAnswers
    }
    requests.post(f"{CONFIG['api']['url']}/Questions", json=new_question)


def delete_question(Questions_id):
    requests.delete(f"{CONFIG['api']['url']}/Questions/{Questions_id}")


def update_question(Questions_id, Quiz_ID, TeacherEmail, Question, PossibleAnswers, RightAnswers, WrongAnswer, Description, AmountAnswers):
    updated_question = {
        "Questions_id": Questions_id,
        "Quiz_ID": Quiz_ID,
        "TeacherEmail": TeacherEmail,
        "Question": Question,
        "PossibleAnswers": PossibleAnswers,
        "RightAnswers": RightAnswers,
        "WrongAnswer": WrongAnswer,
        "Description": Description,
        "AmountAnswers": AmountAnswers
    }
    response = requests.put(f"{CONFIG['api']['url']}/Questions/{Questions_id}", json=updated_question)
    return response.json()


def get_question(Questions_id):
    response = requests.get(f"{CONFIG['api']['url']}/Questions/{Questions_id}")
    question = json.loads(response.text)
    return question
