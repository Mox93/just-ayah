from firebase_admin import firestore

from .config import BATCH_LIMIT


def apply_to_all_documents(col_ref, action):
    docs = col_ref.list_documents(page_size=BATCH_LIMIT)
    updated = 0

    for doc in docs:
        action(doc)
        updated = updated + 1

    if updated >= BATCH_LIMIT:
        return apply_to_all_documents(col_ref, action)


def delete_all_fields_instances(col_ref, fields: list[str]):
    apply_to_all_documents(col_ref, lambda doc: doc.update({field: firestore.DELETE_FIELD for field in fields}))
