import { ReactElement } from "react";

import { ReactComponent as CoursesIcon } from "assets/icons/book-svgrepo-com.svg";
import { ReactComponent as HomeIcon } from "assets/icons/home-svgrepo-com.svg";
import { ReactComponent as UsersIcon } from "assets/icons/users-svgrepo-com.svg";
import { Merge } from "models";

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
  return NAV_TREE;
}

const ICONS = {
  home: <HomeIcon className="icon" />,
  users: <UsersIcon className="icon" />,
  courses: <CoursesIcon className="icon" />,
};

const NAV_TREE: NavTree = [
  {
    icon: ICONS.home,
    name: "home",
    label: "home",
    url: "/admin",
  },
  {
    icon: ICONS.users,
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
    icon: ICONS.courses,
    name: "courses",
    label: "courses",
    url: "/admin/courses",
  },
];
