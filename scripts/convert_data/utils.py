from datetime import datetime


def convert_timestamp(ts):
    if isinstance(ts, datetime):
        return ts

    return datetime.strptime(ts, "%m/%d/%Y %H:%M:%S")


def same_number(pn1, pn2):
    return (
        len(pn1) > 0 and len(pn2) > 0
    ) and (
        3 / 4 < len(pn1) / len(pn2) < 4 / 3
    ) and (
        pn1 in pn2 or pn2 in pn1
    )


def stringify_timestamp(ts, format="%m/%d/%Y %H:%M:%S"):
    if isinstance(ts, str):
        return ts

    return ts.strftime(format)


def convert_notes(*notes):
    return {
        round(datetime.now().timestamp() - 100 / i): {
            "body": note,
            "createBy": "system"
        } for i, note in enumerate(notes)
    }


def might_fail(function, error: Exception):
    try:
        function()
    except error as e:
        return e
