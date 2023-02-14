from firebase_admin import firestore

from .config import BATCH_LIMIT


def update_document(doc_ref, updates: dict):
    doc_ref.update(updates)


def delete_all_fields_instances(col_ref, fields: list[str]):
    docs = col_ref.list_documents(page_size=BATCH_LIMIT)
    updated = 0

    for doc in docs:
        doc.update({field: firestore.DELETE_FIELD for field in fields})
        updated = updated + 1

    if updated >= BATCH_LIMIT:
        return delete_all_fields_instances(col_ref, fields)
