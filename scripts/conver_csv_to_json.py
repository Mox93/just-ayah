import csv
import json
from datetime import datetime

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
    parts = data["name"].split()

    try:
        return {
            "name": {
                "first": parts[0].strip(),
                "middle": " ".join(parts[1: -1]).strip(),
                "last": parts[-1].strip()
            }
        }
    except IndexError:
        return {}


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
        "residency": {
            "country": data["country"].strip(),
            **({"governorate": f"EG.{gov}"} if gov else {})
        }
    }


def parse_phone_numbers(data):
    pn = data["phone number"].strip()
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
        print(pn)

    if code == "EG" and len(pn) != 10:
        print(pn)

    return {
        "phoneNumbers": [{
            "code": code,
            "number": pn
        }]
    }


def parse_email(data):
    email = data.get("email")

    return {
        "email": email.replace(" ", "")
    } if email else {}


def parse_work_status(data):
    occupation = data["occupation"].strip()
    does_work = occupation not in ["student", "housewife", "retired"]

    return {
        "workStatus": {
            "doesWork": does_work,
            **(
                {"job": occupation}
                if does_work else {"reason": occupation}
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


students = []

with open("data/Students Data - form.csv", "r") as csv_file:
    table = csv.DictReader(csv_file)

    for i, data in enumerate(table):
        student = {}

        # NAME
        student.update(parse_name(data))

        # DATE OF BIRTH
        student.update(parse_date_of_birth(data))

        # GENDER
        student["gender"] = data["gender"].strip()

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

        # ADD TO STUDENTS
        if student.get("name"):
            students.append(student)
        else:
            print(i, student)
        # print(i, student)


with open("data/student_data.json", "w", encoding="utf8") as json_file:
    json.dump(students, json_file, ensure_ascii=False)
