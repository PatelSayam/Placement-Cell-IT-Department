import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import GeneralInfo from './pages/Generalinfo';
import StudentHome from './pages/StudentHome';
import CompanyDetails from './pages/CompanyDetails';
import AppliedCompanies from './pages/AppliedCompanies';
import StudentProfile from './pages/StudentProfile';
import Login from './pages/Login';
import AdminDashboard from './pages/Dashboard';
import StudentsManagement from './pages/StudentsManagement';
import CompaniesManagement from './pages/CompaniesManagement';
import ApplicationsManagement from './pages/ApplicationsManagement';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Home from './pages/Home'
import MainLayout from './pages/MainLayout';

function App() {
  return (
    <BrowserRouter>      
      <Routes>        
        <Route path="/" element={<Home />}/>
        
        <Route element={<MainLayout />}>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/general-info" element={<GeneralInfo />} />
          <Route path="/home" element={<StudentHome />} />
          <Route path="/company/:id" element={<CompanyDetails />} />
          <Route path="/applied" element={<AppliedCompanies/>} />
          <Route path="/profile" element={<StudentProfile />} />
          {/* Admin Routes  */}
          <Route path="/admin/dashboard" element={<AdminDashboard/>} />
          <Route path="/admin/students" element={<StudentsManagement/>} />
          <Route path="/admin/companies" element={<CompaniesManagement/>} />
          <Route path="/admin/applications" element={<ApplicationsManagement/>} />
          <Route path="/admin/analytics" element={<Analytics/>}/>
          <Route path="/admin/settings" element={<Settings/>} />          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
