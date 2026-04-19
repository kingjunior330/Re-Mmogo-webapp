import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MainLayout from "./layout/MainLayout";
import Reports from "./pages/Reports";
import Loans from "./pages/Loans";
import LoanApplication from "./pages/LoanApplication";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/loans/apply" element={<LoanApplication />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
