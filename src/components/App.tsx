import { Suspense } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "../context/Auth";

import Courses from "../pages/Courses";
import Curriculum from "../pages/Curriculum";
import Entrance from "../pages/Entrance";
import Home from "../pages/Home";
import NewCourse from "../pages/NewCource";
import NewStudent from "../pages/NewStudent";
import NewTeacher from "../pages/NewTeacher";
import StudentProfile from "../pages/StudentProfile";
import Students from "../pages/Students";
import TeacherProfile from "../pages/TeacherProfile";
import Teachers from "../pages/Teachers";
import useProtect from "../utils/protect";

function App() {
  const { user, signOut } = useAuth();

  return (
    <div className="App">
      <Routes>
        <Route
          {...useProtect({
            path: "/",
            element: <Home />,
          })}
        />
        <Route
          {...useProtect({
            path: "courses",
            element: <Courses />,
          })}
        >
          <Route path=":id" element={<Curriculum />} />
          <Route path="new" element={<NewCourse />} />
        </Route>
        <Route
          {...useProtect({
            path: "students",
            element: <Students />,
          })}
        >
          <Route path=":id" element={<StudentProfile />} />
          <Route path="new" element={<NewStudent />} />
        </Route>
        <Route
          {...useProtect({
            path: "teachers",
            element: <Teachers />,
          })}
        >
          <Route path=":id" element={<TeacherProfile />} />
          <Route path="new" element={<NewTeacher />} />
        </Route>
        <Route
          path="enter"
          element={user ? <Navigate replace to="/" /> : <Entrance />}
        />
      </Routes>
      {user && <button onClick={signOut}>Sign Out</button>}
    </div>
  );
}

// import { useTranslation, Trans } from "react-i18next";
// import { useAuth } from "../context/Auth";
// import Footer from "./Footer";

// const lngs: { [id: string]: { nativeName: string } } = {
//   ar: { nativeName: "Arabic" },
//   en: { nativeName: "English" },
// };

// function App() {
//   const { t, i18n } = useTranslation();
//   const [count, setCounter] = useState(0);
//   const { user, signIn, signOut } = useAuth();

//   return (
//     <div className="App">
//       <header className="App-header">
//         <div>
//           {Object.keys(lngs).map((lng) => (
//             <button
//               key={lng}
//               style={{
//                 fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal",
//               }}
//               type="submit"
//               onClick={() => {
//                 i18n.changeLanguage(lng);
//                 setCounter(count + 1);
//               }}
//             >
//               {lngs[lng].nativeName}
//             </button>
//           ))}
//         </div>
//         <p>{t("counter", { count })}</p>
//         <p>
//           <Trans i18nKey="description.part1">
//             Edit <code>src/App.js</code> and save to reload.
//           </Trans>
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           {t("description.part2")}
//         </a>
//       </header>
//       {!user && <button onClick={signIn}>Sign In With Google</button>}
//       {user && <button onClick={signOut}>Sign Out</button>}
//       <Footer t={t} />
//     </div>
//   );
// }

export default function WrappedApp() {
  return (
    <Suspense fallback="...is loading">
      <App />
    </Suspense>
  );
}
