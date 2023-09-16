import firebase_admin
from firebase_admin import credentials, firestore

from .rename_collection import rename_collection
from .mass_document_update import delete_all_fields_instances, apply_to_all_documents
from .update_field_in_collection import split_path_field
from .config import ENV


def db_init(env):
    firebase_admin.initialize_app(credentials.Certificate(ENV[env]))

    return firestore.client()


if __name__ == "__main__":
    db = db_init("prod")

    # rename_collection(db, "customers", "leads")
    # delete_all_fields_instances(db.collection("students"), ["meta.teacher"])
    apply_to_all_documents(db.collection("meta/temp/deleted"), split_path_field)
