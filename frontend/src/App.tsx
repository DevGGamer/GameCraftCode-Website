import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StartPage from './Pages/StartPage/StartPage';
import Login from './Pages/LoginPage/Login';
import Account from './Pages/AccountPage/Account';
import Profile from './Pages/ProfileMode/Profile';
import AdminPanel from './Pages/AdminUserPanel/AdminUserPanel';
import Shedule from './Pages/Shedule/Shedule';
import CoursesPage from './Pages/CoursesPage/CoursesPage';
import EducationPage from './Pages/EducationPage/EducationPage';
import Unauthorized from './Pages/Unauthorized/Unauthorized';
import StudentsPage from './Pages/StudentsPage/StudentsPage';
import './App.css'

function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/account/:id" element={<Account />}>
            <Route path="profile" element={<Profile />} />
            <Route path="shedule" element={<Shedule />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="students" element={<StudentsPage />} />
        </Route>

        <Route path="/admin/:id" element={<Account />}>
            <Route path="profile" element={<Profile />} />
            <Route path="shedule" element={<Shedule />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="adminPanel" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
