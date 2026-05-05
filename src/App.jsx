import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import Home from "./pages/Home";
import Login from "./pages/Login";
import MainLayout from "./layout/MainLayout";
import Reports from "./pages/Reports";
import Loans from "./pages/Loans";
import LoanApplication from "./pages/LoanApplication";
import { AppProvider } from "./context/AppContext";
import Contributions from "./pages/Contributions";
import Groups from "./pages/Groups";
import MembersPage from "./pages/members";
import Settings from "./pages/Settings";
=======
import Dashboard from "./pages/Dashboard";
import Groups    from "./pages/Groups";
import Loans     from "./pages/Loans";
import Reports   from "./pages/Reports";
import ContributionsPage from "./pages/contributions";
import Home      from "./pages/Home";
>>>>>>> 0f4c486d5ef9116b6607bc75475090d7e1249489

function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <AppProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/loans/apply" element={<LoanApplication />} />
            <Route path="/contributions" element={<Contributions />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </AppProvider>
=======
      <Routes>
        <Route path="/"        element={<Dashboard />} />
        <Route path="/groups"  element={<Groups />}    />
        <Route path="/loans"   element={<Loans />}     />
        <Route path="/contributions" element={<ContributionsPage />} />
        <Route path="/reports" element={<Reports />}   />
        <Route path="/home"    element={<Home />}      />
      </Routes>
>>>>>>> 0f4c486d5ef9116b6607bc75475090d7e1249489
    </BrowserRouter>
  );
}

export default App;
