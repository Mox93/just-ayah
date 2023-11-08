from firebase_admin import firestore
from .config import BATCH_LIMIT


def apply_to_all_documents(col_ref, action):
    docs = col_ref.list_documents()

    for i, doc in enumerate(docs):
        print(i, end=" ")
        action(doc)


def delete_all_fields_instances(col_ref, fields: list[str]):
    apply_to_all_documents(col_ref, lambda doc: doc.update({field: firestore.DELETE_FIELD for field in fields}))
