import { ReactElement, useEffect, useMemo, useRef } from "react";

import { ReactComponent as CoursesIcon } from "assets/icons/book-svgrepo-com.svg";
import { ReactComponent as HomeIcon } from "assets/icons/home-svgrepo-com.svg";
import { ReactComponent as UsersIcon } from "assets/icons/users-svgrepo-com.svg";
import { Merge } from "models";
import { useLocation } from "react-router-dom";

interface NavItem {
  icon: ReactElement;
  name: string;
  label: string;
  url: string;
  subitems?: never;
}

interface NavSubitem extends Omit<NavItem, "icon"> {}
export type NavSubitems = [NavSubitem, NavSubitem, ...NavSubitem[]];

type NavTree = (
  | NavItem
  | Merge<NavItem, { subitems: NavSubitems; url?: never }>
)[];

export function useNavTree() {
  return navTree;
}

const icons = {
  home: <HomeIcon className="icon" />,
  users: <UsersIcon className="icon" />,
  courses: <CoursesIcon className="icon" />,
};

const navTree: NavTree = [
  {
    icon: icons.home,
    name: "home",
    label: "home",
    url: "/admin",
  },
  {
    icon: icons.users,
    name: "users",
    label: "users",
    subitems: [
      {
        name: "students",
        label: "students",
        url: "/admin/students",
      },
      {
        name: "teachers",
        label: "teachers",
        url: "/admin/teachers",
      },
      {
        name: "leads",
        label: "leads",
        url: "/admin/leads",
      },
      {
        name: "staff",
        label: "staff",
        url: "/admin/staff",
      },
    ],
  },
  {
    icon: icons.courses,
    name: "courses",
    label: "courses",
    url: "/admin/courses",
  },
];

export function useHasActivePath(
  paths: () => string[],
  setActive: (isActive: boolean) => void
) {
  const pathname = useLocation().pathname.toLowerCase().replace(/\/$/g, "");

  const setActiveRef = useRef(setActive);
  setActiveRef.current = setActive;

  const pathsRef = useRef(paths);
  pathsRef.current = paths;

  const hasActivePath = useMemo(
    () =>
      pathsRef
        .current()
        .some((path) =>
          pathname.startsWith(path.toLowerCase().replace(/\/$/g, ""))
        ),
    [pathname]
  );

  useEffect(() => {
    if (hasActivePath) {
      setActiveRef.current(true);
    } else {
      setActiveRef.current(false);
    }
  }, [hasActivePath]);

  return hasActivePath;
}
