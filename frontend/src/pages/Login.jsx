
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { apiRequest } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const registrationMessage = location.state?.registrationMessage || "";

  useEffect(() => {
    // Clear navigation-only messages after leaving this route.
    // Do not auto-redirect based only on a token in localStorage.
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      if (!data?.token || !data?.user) {
        throw new Error("The server did not return a valid login session.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("justLoggedIn", "true");

      const requestedPath = location.state?.from;
      const destination =
        typeof requestedPath === "string" &&
        requestedPath.startsWith("/") &&
        !requestedPath.startsWith("//") &&
        !["/login", "/register", "/verify-email"].includes(requestedPath)
          ? requestedPath
          : "/dashboard";

      navigate(destination, { replace: true, state: null });
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#edf5f1] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-8">
        <div className="mb-7 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-slate-900">
            <ShieldCheck className="text-teal-600" size={29} />
            Civic<span className="text-teal-600">RouteX</span>
          </Link>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to submit and track your complaints.
          </p>
        </div>

        {registrationMessage && (
          <div className="mb-5 rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
            <p className="font-semibold">Check your email to activate your account</p>
            <p className="mt-1">{registrationMessage}</p>
          </div>
        )}

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-teal-700 hover:text-teal-800">
            Create one
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-slate-400">
          <Link to="/" className="hover:text-teal-700">Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
