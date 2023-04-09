from .config import BATCH_LIMIT


def rename_collection(db, old_name: str, new_name: str):
    data = pull_documents(db.collection(old_name))
    set_documents(db.collection(new_name), db.batch, data)
    delete_collection(db.collection(old_name), data)


def pull_documents(col_ref) -> dict[str, dict]:
    docs = col_ref.stream()
    data = {}

    for doc in docs:
        data[doc.id] = doc.to_dict()

    return data


def set_documents(col_ref, create_batch, data: dict[str, dict]):

    data_list = list(data.items())

    for i in range(len(data_list) // BATCH_LIMIT + 1):
        batch = create_batch()
        start = i * BATCH_LIMIT
        end = start + BATCH_LIMIT

        for id, doc in data_list[start: end]:
            batch.set(col_ref.document(id), doc)

        batch.commit()


def delete_collection(coll_ref, data: dict[str, dict]):
    for id in data:
        coll_ref.document(id).delete()
