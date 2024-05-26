import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import ContactList from './ContactList';
import ClassroomList from './ClassroomList';
import ContactCurrent from './ContactCurrent';
import ModulsList from './ModulsList';
import CourseList from './CourseList';
import CourseCurrent from './CourseCurrent';
import CurrentModul from './CurrentModul';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/contacts"
          element={<ContactList />}
        />
        <Route
          path="/classrooms"
          element={<ClassroomList />}
        />
        <Route
          path="/contacts/:id/attendance"
          element={<ContactCurrent />}
        />
        <Route
          path="/moduls"
          element={<ModulsList />}
        />
        <Route
          path="/courses"
          element={<CourseList />}
        />
        <Route
          path="/courses/:id/attendance"
          element={<CourseCurrent />}
        />
        <Route
          path="/modul/:id/attendance"
          element={<CurrentModul />}
        />
      </Routes>
    </Router>
  );
}

export default App;
