import csv
from itertools import count
import json
from datetime import datetime
from pprint import pprint
import re

GOV = {
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

PROGRESS = {
    "بدأ": "active",
    "توقف": "canceled",
    "انتظار": "pending",
    "مؤجل": "postponed"
}

SUB = {
    "تكلفة كاملة": "fullPay",
    "اشتراك كامل": "fullPay",
    "بدون تكلفة": "noPay",
    "نصف اشتراك": "partialPay",
    "نصف تكلفة": "partialPay",
    "عرض بيت الخياطة": "partialPay"
}

GOV = {
    v: k for k, v in GOV.items()
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


def parse_timestamp(ts):
    if isinstance(ts, datetime):
        return ts

    return datetime.strptime(ts, "%m/%d/%Y %H:%M:%S")


def stringify_timestamp(ts, format="%m/%d/%Y %H:%M:%S"):
    if isinstance(ts, str):
        return ts

    return ts.strftime(format)


def parse_date_of_birth(data):
    try:
        ts = parse_timestamp(data["timestamp"])
        age = data["age"]
        age = int(age if age != "-" else data["age *"])
        return {
            "dateOfBirth": datetime(
                day=ts.day, month=ts.month, year=ts.year - age
            ).strftime("%d/%m/%Y")
        }
    except ValueError:
        return {}


def parse_residency(data):
    gov = data["governorate"]
    eg_gov = GOV.get(gov)

    return {
        "country": data["country"].strip(),
        **({"governorate": f"EG.{eg_gov}" if eg_gov else gov})
    }


def same_number(pn1, pn2):
    return (
        len(pn1) > 0 and len(pn2) > 0
    ) and (
        3 / 4 < len(pn1) / len(pn2) < 4 / 3
    ) and (
        pn1 in pn2 or pn2 in pn1
    )


def parse_phone_numbers(data):
    fields = ["phone number", "phone number *",
              "phone number **", "whatsapp", "telegram"]
    result = []

    for field in fields:
        number = re.sub('[^0-9]', '', data[field])

        if not number:
            continue

        tags = {field}

        if field in ["phone number", "phone number *"]:
            tags.remove(field)
            tags.update({"call", "whatsapp"})
        elif field == "phone number **":
            tags.remove(field)
            tags.add("call")

        pnx = {"number": number, "tags": tags}

        for pn in result:
            if same_number(pnx["number"], pn["number"]):
                pn["number"] = max(
                    pnx["number"], pn["number"], key=len)
                pn["tags"].update(pnx["tags"])
                break
        else:
            result.append(pnx)

    for pni in result:
        number = pni["number"]
        code = ""

        if number.startswith("+218"):
            number, code = number[4:], "LY"
        elif number.startswith("00218"):
            number, code = number[5:], "LY"
        elif number.startswith("+966"):
            number, code = number[4:], "SA"
        elif number.startswith("00966"):
            number, code = number[5:], "SA"
        elif number.startswith("+967"):
            number, code = number[4:], "YE"
        elif number.startswith("00967"):
            number, code = number[5:], "YE"
        elif number.startswith("971"):
            number, code = number[3:], "AE"
        elif number.startswith("+971"):
            number, code = number[4:], "AE"
        elif number.startswith("0971"):
            number, code = number[4:], "AE"
        elif number.startswith("00971"):
            number, code = number[5:], "AE"
        elif number.startswith("965"):
            number, code = number[3:], "KW"
        elif number.startswith("00965"):
            number, code = number[5:], "KW"
        elif number.startswith("00974"):
            number, code = number[5:], "QA"
        elif number.startswith("1"):
            code = "EG"
        elif number.startswith("01"):
            number, code = number[1:], "EG"
        elif number.startswith("+20"):
            number, code = number[3:], "EG"
        elif number.startswith("20"):
            number, code = number[2:], "EG"
        elif number.startswith("02"):
            number, code = number[2:], "EG"
        elif number.startswith("0020"):
            number, code = number[4:], "EG"
        elif number.startswith("+020"):
            number, code = number[4:], "EG"
        else:
            print(f"{data['name']}: {number = } [code]")

        if code == "EG" and len(number) != 10:
            print(f"{data['name']}: {number = } [len]")

        pni["code"] = code
        pni["number"] = number
        pni["tags"] = list(pni["tags"])

    return {"phoneNumber": result}


def parse_email(data):
    email = data.get("email").replace(" ", "")
    email = email if email != "-" else ""

    # if email and "@" not in email and "www.facebook.com" not in email:
    #     print(f"email = {data.get('email')}")
    valid_email = email and "@" in email
    valid_facebook = "www.facebook.com" in email

    return {
        "facebook": email
    } if valid_facebook else {
        "email": email
    } if valid_email else {}


def parse_work_status(data):
    occupation = data["occupation"].strip()
    reason = data["no work label"]
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
    } if reason != "unknown" else {}


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


def parse_meta(data):
    meta = {}
    ts = data["timestamp"]

    if ts and ts != "-":
        meta["dateCreated"] = stringify_timestamp(ts)
        meta["dateUpdated"] = stringify_timestamp(ts)

    prog = data["progress"].strip()

    if prog:
        progress = PROGRESS.get(prog)

        if progress:
            meta["progress"] = {"type": progress}
        else:
            print(f"{prog = }")

    sub = data["subscription"]

    if sub:
        subscription = SUB.get(sub)

        if subscription:
            meta["subscription"] = {
                "type": subscription, **({"value": 150} if sub == "عرض بيت الخياطة" else {"value": 90} if subscription == "partialPay" else {})}
        elif sub == "نصف تكلفة / بقيمة 50 جنيه":
            meta["subscription"] = {"type": "partialPay", "value": 50}
        elif sub == "بتكلفة 130ج":
            meta["subscription"] = {"type": "partialPay", "value": 130}
        else:
            print(f"{sub = }")

    teacher = data["teacher"]

    if teacher:
        meta["teacher"] = teacher

    program = data["program"]

    if program:
        meta["course"] = program

    schedule = data["schedule"]

    if schedule:
        meta["schedule"] = {"notes": schedule}

    return {"meta": meta}


m = 0
f = 0


def parse_gender(data):
    global m, f

    gender = data.get("gender", "").strip()

    if gender == "ذكر":
        m += 1
    elif gender == "أنثي":
        f += 1

    return {"gender": "male"} if gender == "ذكر" else {"gender": "female"} if gender == "أنثي" else {}


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
            if same_number(pn["number"], pni["number"]):
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


def fill_missing_timestamps(table: list[dict]):
    idx = []

    for i, data in enumerate(table):
        ts = data["timestamp"]

        if not ts or ts == "-":
            idx.append(i)
        elif len(idx):
            l = len(idx) + 1
            before = parse_timestamp(table[idx[0] - 1]["timestamp"])
            after = parse_timestamp(table[idx[-1] + 1]["timestamp"])

            for j, x in enumerate(idx, 1):
                table[x]["timestamp"] = before + (after - before) * j / l

            idx = []


def save_json(path: str, data: dict | list):
    with open(path, "w", encoding="utf8") as json_file:
        json.dump(data, json_file, ensure_ascii=False)


def convert_student_data():
    students = []

    with open("data/Students Data - Final Data.csv") as csv_file:
        table = [{k: v for k, v in data.items()}
                 for data in csv.DictReader(csv_file)]

        fill_missing_timestamps(table)

        for i, data in enumerate(table):
            student = {}

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

            # PHONE NUMBERS
            student.update(parse_phone_numbers(data))

            # EMAIL
            student.update(parse_email(data))

            # EDUCATION
            education = data["education"].strip()
            if education and education != "-":
                student["education"] = education

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

    print(f"size = {len(students)}, {m = }, {f = }")

    save_json("data/student_data.json", students)


def convert_student_data_old():
    global remaining_active_students, remaining_active

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
            education = data["education"].strip()
            if education and education != "-":
                student["education"] = education

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

    save_json("data/student_data.json", students)
    save_json("data/remaining_student_data.json", remaining_students)
    save_json("data/remaining_active_student_data.json", remaining_active)

    with open("data/remaining_active_student_data.csv", "w", encoding="utf8") as csv_file:
        writer = csv.DictWriter(csv_file, remaining_active_students[0].keys())
        writer.writeheader()
        writer.writerows(remaining_active_students)


def convert_teacher_data():
    with open("data/Students Data - Teachers.csv", "r") as csv_file:
        table = csv.reader(csv_file)
        data = [row[0].strip() for row in table]

    pprint(data)

    save_json("data/teacher.json", data)


if __name__ == "__main__":
    convert_student_data()
    # convert_teacher_data()
