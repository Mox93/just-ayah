from datetime import datetime
from json import load
from pprint import pprint

import firebase_admin
from firebase_admin import credentials, firestore


cred = credentials.Certificate(
    "data/just-ayah-prod-firebase-adminsdk-x3k7g-d36c4a7926.json"
    # "data/just-ayah-dev-firebase-adminsdk-dx8ut-fa933d1eab.json"
)
firebase_admin.initialize_app(cred)
db = firestore.client()


def push_student_data(limit: int = None):
    col_ref = db.collection("students")

    with open("data/student_data.json", "r") as json_file:
        data = load(json_file)
        pushed_data = data[:limit] if limit is not None else data

        for student in pushed_data:
            student["dateOfBirth"] = datetime.strptime(
                student["dateOfBirth"], "%d/%m/%Y"
            )
            student["meta"]["dateCreated"] = datetime.strptime(
                student["meta"]["dateCreated"], "%m/%d/%Y %H:%M:%S"
            )
            student["meta"]["dateUpdated"] = datetime.strptime(
                student["meta"]["dateUpdated"], "%m/%d/%Y %H:%M:%S"
            )

            # use update instead of set if data exists
            col_ref.document().set(student)


def push_teachers_data():
    col_ref = db.collection("meta")

    with open("data/teacher.json") as json_file:
        data = load(json_file)

        pprint(data)
        col_ref.document("shortList").update({"teachers": data})


def push_student_index_data():
    col_ref = db.collection("meta")

    with open("data/student_index_data.json") as json_file:
        data = load(json_file)

        # pprint(data)
        col_ref.document("studentIndex").set(data)


if __name__ == "__main__":
    # push_student_data(3)
    # push_teachers_data()
    push_student_index_data()
