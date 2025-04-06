import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import GeneralInfo from './pages/Generalinfo';
import StudentHome from './pages/StudentHome';
import CompanyDetails from './pages/CompanyDetails';
import AppliedCompanies from './pages/AppliedCompanies';
import StudentProfile from './pages/ StudentProfile';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/general-info" element={<GeneralInfo />} />
        <Route path="/home" element={<StudentHome />} />
        <Route path="/company/:id" element={<CompanyDetails />} />
        <Route path="/applied" element={<AppliedCompanies/>} />
        <Route path="/profile" element={<StudentProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
