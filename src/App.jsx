import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;