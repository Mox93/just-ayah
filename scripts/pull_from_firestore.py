from datetime import datetime
from json import dump
from pprint import pprint

import firebase_admin
from firebase_admin import credentials, firestore


cred = credentials.Certificate(
    "data/just-ayah-prod-firebase-adminsdk-x3k7g-d36c4a7926.json"
    # "data/just-ayah-dev-firebase-adminsdk-dx8ut-fa933d1eab.json"
)
firebase_admin.initialize_app(cred)
db = firestore.client()


def handle_object(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, list):
        return [handle_object(x) for x in obj]
    elif isinstance(obj, dict):
        return {k: handle_object(v) for k, v in obj.items()}
    return obj


def pull_student_data():
    col_ref = db.collection("students")

    docs = col_ref.limit(5).stream()
    data = {}

    for doc in docs:
        data[doc.id] = handle_object(doc.to_dict())

    pprint(data)

    with open("data/student_in_db.json", "w") as json_file:
        dump(data, json_file, ensure_ascii=False)


if __name__ == "__main__":
    pull_student_data()
