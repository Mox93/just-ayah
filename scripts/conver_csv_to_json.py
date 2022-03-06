import csv
from importlib import invalidate_caches
from itertools import count
import json
from datetime import datetime
from pprint import pprint

governorate = {
    "Alexandria": "الاسكندرية",
    "Aswan": "أسوان",
    "Asyut": "أسيوط",
    "Beheira": "البحيرة",
    "BeniSuef": "بني سويف",
    "Cairo": "القاهرة",
    "Dakahlia": "الدقهلية",
    "Damietta": "دمياط",
    "Faiyum": "الفيوم",
    "Gharbia": "الغربية",
    "Giza": "الجيزة",
    "Ismailia": "الإسماعلية",
    "KafrElSheikh": "كفر الشيخ",
    "Luxor": "الأقصر",
    "Matruh": "مطروح",
    "Minya": "المنيا",
    "Monufia": "المنوفية",
    "NewValley": "الوادي الجديد",
    "NorthSinai": "شمال سيناء",
    "PortSaid": "بورسعيد",
    "Qalyubia": "القليوبية",
    "Qena": "قنا",
    "RedSea": "البحر الأحمر",
    "Sharqia": "الشرقية",
    "Sohag": "سوهاج",
    "SouthSinai": "جنوب سيناء",
    "Suez": "السويس"
}

governorate = {
    v: k for k, v in governorate.items()
}


def parse_name(data):
    parts_ = filter(bool, data["name"].split())
    parts = []
    prefix = ""

    for part in parts_:
        if part == "عبد":
            prefix = part
            continue

        parts.append(f"{prefix} {part}".strip())
        prefix = ""

    return {
        **({"firstName": parts[0].strip()} if len(parts) > 0 else {}),
        **({"middleName": " ".join(parts[1: -1]).strip()} if len(parts) > 2 else {}),
        **({"lastName": parts[-1].strip()} if len(parts) > 1 else {})
    }


def parse_date_of_birth(data):
    try:
        ts = datetime.strptime(
            data["Timestamp"], "%m/%d/%Y %H:%M:%S"
        )
        age = int(data["age"])
        return {
            "dateOfBirth": datetime(
                day=ts.day, month=ts.month, year=ts.year - age
            ).strftime("%d/%m/%Y")
        }
    except ValueError:
        return {}


def parse_residency(data):
    gov = governorate.get(data["governorate"])

    return {
        "country": data["country"].strip(),
        **({"governorate": f"EG.{gov}"} if gov else {})
    }


def same_number(pn1, pn2):
    idx = min(len(pn1), len(pn2))

    return pn1[-idx:] == pn2[-idx:]


def parse_phone_numbers(data):
    pn = data["phone number"].replace(" ", "")
    pns = list(filter(bool, data.get("phone_numbers", [])))

    for pni in pns:
        if same_number(pn, pni):
            break
    else:
        pns = (*pns, pn)

    phone_numbers = []

    for i, pn in enumerate(pns):
        code = ""

        if pn.startswith("+218"):
            pn, code = pn[4:], "LY"
        elif pn.startswith("00218"):
            pn, code = pn[5:], "LY"
        elif pn.startswith("+966"):
            pn, code = pn[4:], "SA"
        elif pn.startswith("00966"):
            pn, code = pn[5:], "SA"
        elif pn.startswith("+967"):
            pn, code = pn[4:], "YE"
        elif pn.startswith("00967"):
            pn, code = pn[5:], "YE"
        elif pn.startswith("971"):
            pn, code = pn[3:], "AE"
        elif pn.startswith("+971"):
            pn, code = pn[4:], "AE"
        elif pn.startswith("0971"):
            pn, code = pn[4:], "AE"
        elif pn.startswith("00971"):
            pn, code = pn[5:], "AE"
        elif pn.startswith("965"):
            pn, code = pn[3:], "KW"
        elif pn.startswith("00965"):
            pn, code = pn[5:], "KW"
        elif pn.startswith("00974"):
            pn, code = pn[5:], "QA"
        elif pn.startswith("1"):
            code = "EG"
        elif pn.startswith("01"):
            pn, code = pn[1:], "EG"
        elif pn.startswith("+20"):
            pn, code = pn[3:], "EG"
        elif pn.startswith("20"):
            pn, code = pn[2:], "EG"
        elif pn.startswith("02"):
            pn, code = pn[2:], "EG"
        elif pn.startswith("0020"):
            pn, code = pn[4:], "EG"
        elif pn.startswith("+020"):
            pn, code = pn[4:], "EG"
        else:
            print(f"{pn = } [code]")

        if code == "EG" and len(pn) != 10:
            print(f"{pn = } [len]")

        phone_numbers.append({
            "code": code,
            "number": pn,
            **({"tags": ["whatsapp"]} if i == 0 else {})
        })

    return {
        "phoneNumbers": {k: v for k, v in enumerate(phone_numbers)}
    }


def parse_email(data):
    email = data.get("email")

    if email and "@" not in email:
        print(f"{email = }")
        email = ""

    return {
        "facebook": email
    } if "www.facebook.com" in email else {
        "email": email.replace(" ", "")
    } if email else {}


def parse_work_status(data):
    occupation = data["occupation"].strip()
    reason = data["work status"]
    does_work = not reason

    return {
        "workStatus": {
            "doesWork": does_work,
            **(
                {"job": occupation}
                if does_work else {
                    "reason": reason,
                    **(
                        {"explanation": occupation}
                        if reason == "other" else {}
                    )
                }
            )
        }
    }


def parse_quran(data):
    quran = data["Quran"].strip()

    return {} if quran == "" else {
        "Quran": quran == "نعم"
    }


def parse_zoom(data):
    zoom = data["Zoom"].strip()

    return {} if zoom == "" else {
        "Zoom": zoom == "نعم"
    }


def parse_meta(date):
    ts = data["Timestamp"]
    return {
        "meta": {
            "dateCreated": ts,
            "dateUpdated": ts
        }
    }


def parse_gender(data):
    gender = data.get("gender", "").strip()

    return {
        "gender": "male" if gender == "m" else "female"
    } if gender else {}


def is_active_student(data):
    n = " ".join(filter(bool, data.get("name").split()))

    if not n:
        return data, False

    global remaining_active, remaining_active_students

    found_match = False

    for i, (name, pns) in enumerate(remaining_active):
        if n == name:
            found_match = True
            break

        pn = data.get("phone number")

        for pni in pns:
            if same_number(pn, pni):
                found_match = True
                break

        if found_match:
            break

    if found_match:
        remaining_active = [
            *remaining_active[:i], *remaining_active[i + 1:]
        ]
        remaining_active_students = [
            *remaining_active_students[:i], *remaining_active_students[i + 1:]]

        data["phone_numbers"] = pns

    return data, found_match


students = []
remaining_students = []
remaining_active_students = []
active = []
remaining_active = []

with open("data/Students Data - general.csv", "r") as csv_file:
    table = csv.DictReader(csv_file)

    for data in table:
        n = " ".join(filter(bool, data.get("name").split()))
        pn1 = data.get("phone number", "").replace(" ", "")
        pn2 = data.get("second phone number", "").replace(" ", "")
        pns = []

        if len(pn1) > 1:
            pns.append(pn1)
        if len(pn2) > 1:
            pns.append(pn2)

        remaining_active_students.append(data)
        active.append((n, pns))
        remaining_active.append((n, pns))

    # pprint(active_students)

with open("data/Students Data - form.csv", "r") as csv_file:
    table = csv.DictReader(csv_file)

    for i, data in enumerate(table):
        student = {}

        # FILTER
        data, is_active = is_active_student(data)

        if not is_active:
            remaining_students.append(data)
            continue

        # NAME
        student.update(parse_name(data))

        # DATE OF BIRTH
        student.update(parse_date_of_birth(data))

        # GENDER
        student.update(parse_gender(data))

        # NATIONALITY
        student["nationality"] = data["nationality"].strip()

        # RESIDENCY
        student.update(parse_residency(data))

        # PHOENE NUMBERS
        student.update(parse_phone_numbers(data))

        # EMAIL
        student.update(parse_email(data))

        # EDUCATION
        student["education"] = data["education"].strip()

        # WORK STATUS
        student.update(parse_work_status(data))

        # QURAN
        student.update(parse_quran(data))

        # ZOOM
        student.update(parse_zoom(data))

        # META
        student.update(parse_meta(data))

        # ADD TO STUDENTS
        students.append(student)

print(f"found {len(students)} out of {len(active)}")
print(f"remaining {len(remaining_students)} out of {i}")


with open("data/student_data.json", "w", encoding="utf8") as json_file:
    json.dump(students, json_file, ensure_ascii=False)

with open("data/remaining_student_data.json", "w", encoding="utf8") as json_file:
    json.dump(remaining_students, json_file, ensure_ascii=False)

with open("data/remaining_active_student_data.json", "w", encoding="utf8") as json_file:
    json.dump(remaining_active, json_file, ensure_ascii=False)

with open("data/remaining_active_student_data.csv", "w", encoding="utf8") as csv_file:
    writer = csv.DictWriter(csv_file, remaining_active_students[0].keys())
    writer.writeheader()
    writer.writerows(remaining_active_students)
