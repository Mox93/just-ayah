from datetime import datetime
from json import load
from pprint import pprint

import firebase_admin
from firebase_admin import credentials, firestore


cred = credentials.Certificate(
    # "data/just-ayah-prod-firebase-adminsdk-x3k7g-d36c4a7926.json"
    "data/just-ayah-dev-firebase-adminsdk-dx8ut-fa933d1eab.json"
)
firebase_admin.initialize_app(cred)
db = firestore.client()
BATCH_LIMIT = 500


def push_student_data(limit: int = None):
    col_ref = db.collection("students")

    with open("data/student_data.json", "r") as json_file:
        data = load(json_file)
        pushed_data = data[:limit] if limit is not None else data

    for i in range(len(pushed_data) // BATCH_LIMIT + 1):
        batch = db.batch()
        start = i * BATCH_LIMIT
        end = start + BATCH_LIMIT

        for student in pushed_data[start: end]:
            dob = student.get("dateOfBirth")

            if dob:
                student["dateOfBirth"] = datetime.strptime(dob, "%d/%m/%Y")

            dc = student["meta"].get("dateCreated")

            if dc:
                student["meta"]["dateCreated"] = datetime.strptime(
                    dc, "%m/%d/%Y %H:%M:%S"
                )

            du = student["meta"].get("dateUpdated")

            if du:
                student["meta"]["dateUpdated"] = datetime.strptime(
                    du, "%m/%d/%Y %H:%M:%S"
                )

            # use update instead of set if data exists
            batch.set(col_ref.document(), student)

        batch.commit()


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
    push_student_data(100)
    # push_teachers_data()
    # push_student_index_data()
