import {
  Change,
  DocumentSnapshot,
  EventContext,
  QueryDocumentSnapshot,
  Timestamp,
} from "@lib";

export type DBEventHandler = (
  change: Change<DocumentSnapshot>,
  context: EventContext
) => any;

export type DBUpdateHandler = (
  change: Change<QueryDocumentSnapshot>,
  context: EventContext
) => any;

export type DBCreateHandler = (
  snapshot: QueryDocumentSnapshot,
  context: EventContext
) => any;

export type EventType = "create" | "delete" | "update";

export interface UserName {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName?: string;
}

export interface PhoneNumber {
  code: string;
  number: string;
  tags?: string[];
}

export interface ChapterData {
  verses: number;
  chapter: string;
}

interface SessionStatus {
  value: string;
  needsReport: boolean;
}

export interface MetaData {
  staff: string[];
  teachers: Record<string, string[]>;
  courses: Record<string, ChapterData[]>;
  sessionStatus: SessionStatus[];
  subscriptions: string[];
  monthlySessions: string[];
  recitationRules: string[];
  unassignedStudents: string[];
  noMatchTeachers: Record<string, string[]>;
}

export interface CachedMetaData {
  data: MetaData;
  ttl: number;
  updatedAt: Timestamp;
}
