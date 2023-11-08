from json import load, dump


def get_existing_ids():
  ids = []

  with open("data/report_ids.txt", "r") as ids_file:
    for _id in ids_file:
      ids.append(_id.strip())

  return ids


def cache_reports(_id, data):
  with open("data/replaced_reports.json", "r") as json_file:
    reports = load(json_file)
    reports[_id] = data.copy()

    timestamp = data.get("timestamp")
    if timestamp:
      reports[_id]["timestamp"] = str(timestamp)

    date = data.get("date")
    if timestamp:
      reports[_id]["date"] = str(date)

  with open("data/replaced_reports.json", "w") as json_file:
    dump(reports, json_file, ensure_ascii=False)


def reset_document(coll_ref, _id, data):
  coll_ref.document(_id).delete()
  coll_ref.document(_id).set(data)


def reset_missing_reports(coll_ref):
  ids = get_existing_ids()
  count = 0

  def action(doc):
    nonlocal count

    if doc.id not in ids:
      data: dict = doc.get().to_dict()
      count += 1
      print(doc.id, "[NOT FOUND]", count)
      cache_reports(doc.id, data)
      reset_document(coll_ref, doc.id, data)
    else:
      print(doc.id, "[EXISTS]")

  return action


def delete_duplicates(coll_ref):
  ids = get_existing_ids()

  for _id in ids:
    coll_ref.document(_id).delete()
