import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateComplaint from "./pages/CreateComplaint";
import ComplaintDetails from "./pages/ComplaintDetails";
import MyComplaints from "./pages/MyComplaints";
import Authorities from "./pages/Authorities";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Layout */}
        <Route
          path="*"
          element={
            <div className="min-h-screen">
              <Navbar />

              <div className="flex">
                <Sidebar />

                <main className="min-w-0 flex-1">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route
                      path="/complaints/create"
                      element={<CreateComplaint />}
                    />

                    <Route path="/complaints" element={<MyComplaints />} />

                    <Route
                      path="/complaints/:id"
                      element={<ComplaintDetails />}
                    />

                    <Route
                      path="/authorities"
                      element={<Authorities />}
                    />

                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;