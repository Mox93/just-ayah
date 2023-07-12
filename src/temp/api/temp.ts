import { doc } from "firebase/firestore";

import { db } from "services/firebase";

export const tempRef = doc(db, "meta/temp");
