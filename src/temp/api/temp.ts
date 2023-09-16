import { doc } from "firebase/firestore";

import { db } from "services/firebase";

export const TEMP_REF = doc(db, "meta/temp");
