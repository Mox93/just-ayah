from datetime import datetime
from json import load

import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate(
    "data/just-ayah-dev-firebase-adminsdk-dx8ut-fa933d1eab.json"
)
firebase_admin.initialize_app(cred)

db = firestore.client()
col_ref = doc_ref = db.collection("students")

with open("data/student_data.json", "r") as json_file:
    data = load(json_file)

    for student in data[:3]:
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
