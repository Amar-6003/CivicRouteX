import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

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
import VerifyEmail from "./pages/VerifyEmail";

import { apiRequest } from "./services/api";

const ProtectedLayout = () => {
  const location = useLocation();
  const [authStatus, setAuthStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("user");
        localStorage.removeItem("justLoggedIn");

        if (!cancelled) setAuthStatus("unauthenticated");
        return;
      }

      try {
        const data = await apiRequest("/auth/me");

        if (!data?.success || !data?.user) {
          throw new Error("Your session could not be verified.");
        }

        if (cancelled) return;

        localStorage.setItem("user", JSON.stringify(data.user));
        setAuthStatus("authenticated");
      } catch (error) {
        if (cancelled) return;

        // Do not keep a stale session after an authentication failure.
        if (
          error.status === 401 ||
          error.status === 403 ||
          error.message === "Your session could not be verified."
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("justLoggedIn");
          setAuthStatus("unauthenticated");
          return;
        }

        // A network/server error is not proof that the token is invalid.
        setAuthStatus("error");
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  if (authStatus === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#edf5f1]">
        <p className="text-sm font-medium text-teal-700">
          Checking your session...
        </p>
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (authStatus === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#edf5f1] p-5">
        <div className="max-w-md rounded-2xl bg-white p-7 text-center shadow">
          <h1 className="text-xl font-bold text-slate-900">
            Unable to verify your session
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The server could not be reached. Check your backend connection and
            try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <div className="hidden w-64 shrink-0 lg:block" aria-hidden="true" />
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complaints/create" element={<CreateComplaint />} />
        <Route path="/complaints" element={<MyComplaints />} />
        <Route path="/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/authorities" element={<Authorities />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
