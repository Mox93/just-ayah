import firebase_admin
from firebase_admin import credentials, firestore

from .rename_collection import rename_collection
from .update_document import delete_all_fields_instances
from .config import ENV


def db_init(env):
    firebase_admin.initialize_app(credentials.Certificate(ENV[env]))

    return firestore.client()


if __name__ == "__main__":
    db = db_init("dev")

    # rename_collection(db, "customers", "leads")
    delete_all_fields_instances(db.collection("students"), ["meta.teacher"])
