import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MainLayout from "./layout/MainLayout";
import Reports from "./pages/Reports";
import Loans from "./pages/Loans";
import LoanApplication from "./pages/LoanApplication";
import { AppProvider } from "./context/AppContext";
import App from "./App";
import Contributions from "./pages/Contributions";
import Groups from "./pages/Groups";


function App() {
  return (
    ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <AppProvider>
      <App />
    </AppProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />3
          <Route path="/login" element={<Login />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/loans/apply" element={<LoanApplication />} />
          <Route path="/contributions" element={<Contributions />} />
          <Route path="/groups" element={<Groups />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
