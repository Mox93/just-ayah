import {
  META_DATA_RANGES,
  DATA_SHEET_ID,
  TEMP_PATH,
  CUSTOM_META_DATA_RANGES,
} from "@config";
import { Schema$ValueRange, authClient, db, sheets } from "@lib";
import { MetaData } from "@types";

export async function updateMetaData(data: MetaData) {
  return await db
    .doc(TEMP_PATH)
    .update({ "metaData.data": data, "metaData.updatedAt": new Date() });
}

export async function getFreshMetaData(): Promise<MetaData> {
  const ranges =
    (
      await sheets.spreadsheets.values.batchGet(
        {
          auth: await authClient,
          spreadsheetId: DATA_SHEET_ID.value(),
          ranges: [...META_DATA_RANGES, ...CUSTOM_META_DATA_RANGES],
        },
        {}
      )
    ).data.valueRanges || [];

  const [
    teachers,
    students,
    assignedTeachers,
    courses,
    chapters,
    sessionStatus,
  ] = ranges.slice(META_DATA_RANGES.length);

  return {
    ...parsePlainData(ranges),
    ...parseStudentsData(teachers, students, assignedTeachers),
    courses: parseCoursesData(courses, chapters),
    sessionStatus:
      sessionStatus.values?.map(([value, needsReport]) => ({
        value,
        needsReport: needsReport === "TRUE",
      })) || [],
  };
}

function parsePlainData(ranges: Schema$ValueRange[]) {
  return META_DATA_RANGES.reduce((obj, key, index) => {
    return {
      ...obj,
      [key]: ranges[index].values?.map(([value]) =>
        key === "monthlySessions" ? parseInt(value?.trim()) : value?.trim()
      ),
    };
  }, {} as Pick<MetaData, typeof META_DATA_RANGES[number]>);
}

function parseCoursesData(
  courses: Schema$ValueRange,
  chapters: Schema$ValueRange
) {
  if (!courses.values) return {};

  const result = courses.values.reduce(
    (obj, [value]) => ({ ...obj, [value?.trim()]: [] }),
    {} as MetaData["courses"]
  );

  chapters.values?.forEach(([course, chapter, verses, index]) => {
    result[course?.trim()].push({
      index: parseInt(index?.trim()),
      chapter: chapter?.trim(),
      verses: parseInt(verses?.trim()),
    });
  });

  return result;
}

function parseStudentsData(
  _teachers: Schema$ValueRange,
  students: Schema$ValueRange,
  assignedTeachers: Schema$ValueRange
) {
  const teachers = (_teachers.values || []).reduce(
    (obj, [value]) => ({ ...obj, [value?.trim()]: [] }),
    {} as MetaData["teachers"]
  );
  const noMatchTeachers: MetaData["noMatchTeachers"] = {};
  const unassignedStudents: MetaData["unassignedStudents"] = [];

  students.values?.forEach(([value], index) => {
    if (index === 0) return;

    value = value?.trim();

    const teacher = assignedTeachers.values?.[index]?.[0]?.trim();

    if (teacher) {
      if (teacher in teachers) teachers[teacher].push(value);
      else {
        const students = noMatchTeachers[teacher];

        if (Array.isArray(students)) students.push(value);
        else noMatchTeachers[teacher] = [value];
      }
    } else {
      unassignedStudents.push(value);
    }
  });

  return { teachers, noMatchTeachers, unassignedStudents };
}
