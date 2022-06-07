from json import load, dump
import regex


name_parts = ['firstName', 'middleName', 'lastName']

def convert_to_search_index():
  with open("data/student_in_db.json", "r") as json_file:
    data = load(json_file)

  index_data = {}

  for k, v in data.items():
    name_list = [v.get(np) for np in name_parts if np in v]
    name = regex.sub(r"[^\p{L}\p{N}\ ]+", "", " ".join(name_list))

    phone_number = v.get("phoneNumbers")

    if phone_number:
      phone_number = [pn["number"] for pn in phone_number.values()]
    else:
      phone_number = [pn["number"] for pn in v.get("phoneNumber")]

    index_data[k] = {
      "name": name,
      "phoneNumber": phone_number
    }

  with open("data/student_index_data.json", "w") as json_file:
    dump(index_data, json_file, ensure_ascii=False)

if __name__ == "__main__":
  convert_to_search_index()
