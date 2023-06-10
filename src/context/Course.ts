import { collection } from "firebase/firestore";
import { create } from "zustand";

import { AddDataFunc, FetchDataFunc, UpdateDataFunc } from "models";
import { DataMap } from "models/abstract";
import { changeDateUpdated } from "models/blocks";
import { Course, courseConverter, CourseDB, CourseDBData } from "models/course";
import { db } from "services/firebase";

import { addDocFactory, getDocsFactory, updateDocFactory } from "./_internal";

const collectionRef = collection(db, "courses");
const courseRef = collectionRef.withConverter(courseConverter);

interface CourseStore {
  data: DataMap<Course>;
  add: AddDataFunc<CourseDB>;
  fetch: FetchDataFunc<CourseDBData>;
  update: UpdateDataFunc<CourseDBData>;
}

export const useCourseStore = create<CourseStore>()((set) => ({
  data: new DataMap(),
  add: addDocFactory({
    collectionRef: courseRef,
    setData: (course) => set(({ data }) => ({ data: data.prepend(course) })),
    DataClass: Course,
  }),
  fetch: getDocsFactory({
    collectionRef: courseRef,
    setData: (courses) =>
      set(({ data }) => ({ data: data.append(...courses) })),
    fetchDefaults: { sort: { by: "meta.dateCreated", direction: "desc" } },
  }),
  update: updateDocFactory({
    collectionRef,
    setData: (id, updates) =>
      set(({ data }) => ({ data: data.update(id, updates) })),
    processUpdates: changeDateUpdated("meta"),
  }),
}));
