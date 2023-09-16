def split_path_field(doc):
  data = doc.get().to_dict()
  path = [p for p in data.get("path").split("/") if p != ""]

  if len(path) == 4:
    print(path, end=" -> ")
    _id = path[-1]
    path = path[:3]
    print(path, end=" + ")
    print(_id)

    doc.update({"path": f"/{'/'.join(path)}/", "id": _id})
