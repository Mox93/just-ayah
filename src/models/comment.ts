import { Timestamp } from "firebase/firestore";

export interface Comment {
  dateCreated: Date;
  dateUpdated?: Date;
  body: string;
  createdBy?: {
    email: string;
    username?: string;
    avatar?: string;
  };
}

export interface CommentMap {
  [timestamp: string]: Omit<Comment, "dateCreated">;
}

export interface CommentInDB
  extends Omit<Comment, "dateCreated" | "dateUpdated"> {
  dateUpdated?: Timestamp;
}

export interface CommentMapInDB {
  [timestamp: string]: CommentInDB;
}

export const commentFromDB = (
  timestamp: string,
  comment: CommentInDB
): Comment => {
  const dateCreated = new Date(Number(timestamp));

  const dateUpdated = comment.dateUpdated && comment.dateUpdated.toDate();
  const result: Comment = { ...comment, dateCreated, dateUpdated };

  if (result.dateUpdated === undefined) {
    delete result.dateUpdated;
  }

  return result;
};

export const commentListFromDB = (comment: CommentMapInDB): Comment[] => {
  const timestamps = Object.keys(comment);
  timestamps.sort((a, b) => (a < b ? 1 : a === b ? 0 : -1));

  return timestamps.map((ts) => commentFromDB(ts, comment[ts]));
};

export const toCommentMap = (comment: Comment[]): CommentMap => {
  const commentMap: CommentMap = {};

  comment.forEach((comment) => {
    const { dateCreated, ...rest } = comment;
    commentMap[`${dateCreated.getTime()}`] = rest;
  });

  return commentMap;
};
