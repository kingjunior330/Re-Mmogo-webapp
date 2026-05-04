import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Groups    from "./pages/Groups";
import Loans     from "./pages/Loans";
import Reports   from "./pages/Reports";
import ContributionsPage from "./pages/contributions";
import Home      from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Dashboard />} />
        <Route path="/groups"  element={<Groups />}    />
        <Route path="/loans"   element={<Loans />}     />
        <Route path="/contributions" element={<ContributionsPage />} />
        <Route path="/reports" element={<Reports />}   />
        <Route path="/home"    element={<Home />}      />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
