from datetime import datetime
from json import load
from pprint import pprint

import firebase_admin
from firebase_admin import credentials, firestore

BATCH_LIMIT = 500

ENV = {
    "prod": "data/just-ayah-prod-firebase-adminsdk-x3k7g-37d67cf01d.json",
    "dev": "data/just-ayah-dev-firebase-adminsdk-dx8ut-c16b9c1977.json"
}


def db_init(env):
    firebase_admin.initialize_app(credentials.Certificate(ENV[env]))

    return firestore.client()


def push_student_data(env: str, limit: int = None):
    db = db_init(env)
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


def push_teachers_data(env):
    db = db_init(env)
    col_ref = db.collection("meta")

    with open("data/teacher.json") as json_file:
        data = load(json_file)

        pprint(data)
        col_ref.document("shortList").update({"teachers": data})


def push_student_index_data(env):
    db = db_init(env)
    col_ref = db.collection("meta")

    with open("data/student_index_data.json") as json_file:
        data = load(json_file)

        # pprint(data)
        col_ref.document("studentIndex").set(data)


def delete_students(env):
    db = db_init(env)
    col_ref = db.collection("students")

    docs = col_ref.where("meta.quran", "!=", "").stream()

    for doc in docs:
        col_ref.document(doc.id).delete()


if __name__ == "__main__":
    push_student_data("dev", 100)
    # delete_students("dev")
    # push_teachers_data()
    # push_student_index_data()
    pass
