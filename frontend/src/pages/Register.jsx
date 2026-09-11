import { Link } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#edf5f1] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white p-8 shadow-xl shadow-slate-200/60">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="text-3xl font-bold text-teal-600"
          >
            CivicRouteX
          </Link>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Start reporting and tracking public issues.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="Enter your name"
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Create a password"
            required
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
          />

          <Button type="submit" className="mt-2 w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-teal-600 hover:text-teal-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;