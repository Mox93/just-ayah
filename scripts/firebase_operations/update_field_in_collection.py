
OTHER = "أخرى"

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


def fix_rules(doc):
  data: dict = doc.get().to_dict()
  rules = data.get("rules")

  if isinstance(rules, str):
    rulesList = rules.split(",")
    doc.update({"rules": rulesList})
    print(">>>", data.get("timestamp"), doc.id, "[SPLIT]", rulesList)

  elif isinstance(rules, list):
    was_updated = False

    for i, rule in enumerate(rules):
      if isinstance(rule, str) and rule.startswith(OTHER):
        rules[i] = OTHER
        was_updated = True

    if was_updated:
      doc.update({"rules": rules})
      print(">>>", data.get("timestamp"), doc.id, "[FIXED]", rules)
    else:
      print(">>>", data.get("timestamp"), doc.id, "[ALL GOOD]")

  else:
    print(">>>", data.get("timestamp"), doc.id, "[NO RULES]")
