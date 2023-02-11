import re
from datetime import datetime
from pprint import pprint

from .utils import convert_notes, convert_timestamp, same_number, stringify_timestamp, might_fail
from .values import GOV, PROGRESS, SUB, TOS


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
        ts = parse_timestamp(data)
        age = parse_age(data)
        return {
            "dateOfBirth": datetime(
                day=ts.day, month=ts.month, year=ts.year - age
            ).strftime("%d/%m/%Y")
        }
    except ValueError:
        return {}


def parse_timestamp(data):
    ts = data["Timestamp"].strip()
    return convert_timestamp(ts) if ts else ts


def parse_age(data):
    age = data["age"].strip()
    return int(age) if age else age


def parse_residency(data):
    gov = data["governorate"]
    eg_gov = GOV.get(gov)

    country = data["country"].strip()

    return {
        **({"country": country} if len(country) == 2 else {}),
        **({"governorate": f"EG.{eg_gov}" if eg_gov else gov})
    }


def parse_nationality(data):
    nationality = data["nationality"].strip()
    return {"nationality": nationality} if nationality else {}


def parse_phone_numbers(data):
    fields = ["phone number", "WhatsApp", "Telegram"]
    result = []

    for field in fields:
        number = re.sub('[^0-9]', '', data[field])

        if not number:
            continue

        tags = {field.lower()}

        if field == "phone number":
            tags.remove(field)
            tags.update({"call", "whatsapp"})

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
        elif number.startswith("966"):
            number, code = number[3:], "SA"
        elif number.startswith("+966"):
            number, code = number[4:], "SA"
        elif number.startswith("0966"):
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
        elif number.startswith("973"):
            number, code = number[3:], "BH"
        elif number.startswith("0973"):
            number, code = number[4:], "BH"
        elif number.startswith("00974"):
            number, code = number[5:], "QA"
        elif number.startswith("974"):
            number, code = number[3:], "QA"
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
        elif number.startswith("49"):
            number, code = number[2:], "DE"
        else:
            print(f"{data['name']}: {number = } [code]")

        if code == "EG" and len(number) != 10:
            print(f"{data['name']}: {number = } [len]")

        pni["code"] = code
        pni["number"] = number
        pni["tags"] = list(pni["tags"])

    return {"phoneNumber": result}


def parse_email(data):
    email = data["email"]

    valid_email = email and "@" in email
    valid_facebook = "www.facebook.com" in email

    return {
        "facebook": email.strip()
    } if valid_facebook else {
        "email": email.replace(" ", "").lower()
    } if valid_email else {}


def parse_education(data):
    education = data["education"].strip()
    return {"education": education} if education and education != "-" else {}


def parse_work_status(data):
    occupation = data["occupation"].strip()
    status = data["no work label"].strip().lower()
    does_work = not status

    return {
        "workStatus": {
            "doesWork": does_work,
            **(
                {"job": occupation}
                if does_work else {
                    "status": {
                        "value": status,
                        **(
                            {"other": occupation}
                            if status == "other" else {}
                        )
                    }
                }
            )
        } if status != "unknown" else {"doesWork": False, "status": {"value": "other", "other": status}}
    }


def parse_quran(data):
    quran = data["Quran"].strip()

    return {} if quran == "" else {
        "quran": quran == "نعم"
    }


def parse_zoom(data):
    use_zoom = data["use Zoom"].strip()
    zoom_ed = data["Zoom ed"].strip()

    return {} if use_zoom == "" and zoom_ed == "" else {
        "zoom": {
            **({"canUse": use_zoom == "نعم"} if use_zoom != "" else {}),
            **({"needTutorial": zoom_ed == "نعم"} if zoom_ed != "" else {})
        }
    }


def parse_gender(data):
    gender = data["gender"].strip()
    return {"gender": "male"} if gender == "ذكر" else {"gender": "female"} if gender == "أنثي" else {}


def parse_meta(data):
    meta = {}
    errors = []

    errors.append(might_fail(lambda: meta.update(
        parse_date_created(data)), KeyError))
    errors.append(might_fail(lambda: meta.update(
        parse_progress(data)), KeyError))
    errors.append(might_fail(lambda: meta.update(
        parse_sessions(data)), KeyError))
    errors.append(might_fail(lambda: meta.update(
        parse_subscription(data)), KeyError))
    errors.append(might_fail(lambda: meta.update(
        parse_field(data, "teacher")), KeyError))
    errors.append(might_fail(lambda: meta.update(
        parse_field(data, "course")), KeyError))
    # errors.append(might_fail(lambda: meta.update(
    #     parse_schedule(data)), KeyError))
    errors.append(might_fail(lambda: meta.update(
        parse_telegram(data)), KeyError))
    errors.append(might_fail(lambda: meta.update(parse_leads(data)), KeyError))
    errors.append(might_fail(lambda: meta.update(
        parse_terms_of_service(data)), KeyError))
    errors.append(might_fail(lambda: meta.update(parse_quran(data)), KeyError))
    errors.append(might_fail(lambda: meta.update(parse_zoom(data)), KeyError))

    errors = list(filter(bool, errors))

    # if len(errors):
    #     print(f"{errors = }")

    return {"meta": meta}


def parse_date_created(data):
    ts = data["Timestamp"].strip()
    return {"dateCreated": stringify_timestamp(ts)} if ts and ts != "-" else {}


def parse_progress(data):
    prog = data["progress"].strip()

    if prog:
        progress = PROGRESS.get(prog)

        if not progress:
            print(f"{prog = }")
            return {}

        return {"progress": {"type": progress}}

    return {}


def parse_subscription(data):
    sub = data["subscription"].strip()
    cost = parse_cost(data)

    if sub:
        subscription = SUB.get(sub)

        if subscription:
            return {
                "subscription": {
                    "type": subscription, **({"value": cost} if cost else {})
                }
            }
        else:
            print(f"{sub = }")
            return {}


def parse_cost(data):
    cost = data["cost"].strip()
    return int(cost) if cost else cost


def parse_sessions(data):
    sessions = data["sessions"].strip()

    if sessions:
        return {"sessions": int(sessions)}

    print(f"{sessions = }")
    return {}


def parse_notes(data):
    notes = data["notes"].strip()
    quit_notes = data["quit notes"].strip()
    return {"notes": convert_notes([notes, quit_notes])}


def parse_field(data, field):
    value = data.get(field)
    return {field: value} if value else {}


def parse_schedule(data):
    schedule = data["schedule"].strip()
    return {"schedule": {"notes": schedule}} if schedule else {}


def parse_telegram(data):
    use_telegram = data["use Telegram"].strip()
    return {} if use_telegram == "" else {"useTelegram": use_telegram == "نعم"}


def parse_leads(data):
    leads = data["lead resource"].strip()
    return {} if leads == "" else {"leads": leads}


def parse_terms_of_service(data):
    rtos = data["read terms of service"].strip()
    tos = data["terms of service"].strip()
    return {"termsOfService": TOS} if tos == "نعم" or rtos == "نعم" else {}


FIELD_MAP = {
    "name": parse_name,
    "date_of_birth": parse_date_of_birth,
    "gender": parse_gender,
    "nationality": parse_nationality,
    "residency": parse_residency,
    "phone_numbers": parse_phone_numbers,
    "email": parse_email,
    "education": parse_education,
    "work_status": parse_work_status,
    "meta": parse_meta,
}


def parse_fields(data, *fields):
    result = {}

    for field in fields:
        result.update(FIELD_MAP[field](data))

    return result
