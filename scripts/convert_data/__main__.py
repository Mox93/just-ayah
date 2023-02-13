import csv
import json
from .fields import parse_fields


def get_form_data():
    with open("data/Students Data - form.csv") as csv_file:
        table = [{k: v.strip() for k, v in data.items()}
                 for data in csv.DictReader(csv_file)]
        data = {row["name"]: {k: v for k, v in row.items()} for row in table}
        names = []

        for row in table:
            name = row["name"]

            if name in names:
                print(">>>", row)
            else:
                names.append(name)

    print("get_form_data:", len(table), len(data))
    return data


def get_operation_data():
    with open("data/Students Data - operation.csv") as csv_file:
        table = [{k: v.strip() for k, v in data.items()}
                 for data in csv.DictReader(csv_file)]

        data = {row["name"]: {k: v for k, v in row.items()} for row in table}

    print("get_operation_data:", len(table), len(data))
    return data


def merge_data(base, *updates):
    leftovers = {}

    for update in updates:
        for uk, uv in update.items():
            bv = base.get(uk)

            if bv:
                bv.update(uv)
            else:
                leftovers[uk] = uv

    # print([v for v in leftovers.values()])
    print("leftovers", len(leftovers))
    return base


def convert_data(data):
    return [
        parse_fields(
            row, "name", "date_of_birth", "gender", "nationality", "residency",
            "phone_numbers", "email", "education", "work_status", "meta"
        ) for row in data.values()
    ]


def save_json(path: str, data: dict | list):
    with open(path, "w", encoding="utf8") as json_file:
        json.dump(data, json_file, ensure_ascii=False)


def main():
    form_data = get_form_data()
    operation_data = get_operation_data()
    full_data = merge_data(form_data, operation_data)
    save_json("data/student_raw_data.json", full_data)
    final_data = convert_data(full_data)
    save_json("data/student_data.json", final_data)


if __name__ == "__main__":
    main()
