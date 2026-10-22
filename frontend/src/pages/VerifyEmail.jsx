
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { apiRequest } from "../services/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) return;

    verificationStarted.current = true;

    const verify = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage(
          "Verification link is invalid or incomplete."
        );
        return;
      }

      try {
        const data = await apiRequest(
          `/auth/verify-email?token=${encodeURIComponent(token)}`
        );

        if (data.alreadyVerified) {
          setStatus("alreadyVerified");
          setMessage(
            "Your email has already been verified. You can log in to your account."
          );
          return;
        }

        setStatus("success");
        setMessage(
          "Your email has been verified successfully! You can now log in to your account."
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error.message ||
            "Unable to verify your email. Please try again."
        );
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#edf5f1] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl shadow-slate-200/60">
        {status === "loading" && (
          <>
            <Loader2
              size={48}
              className="mx-auto animate-spin text-teal-600"
            />

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Verifying your email
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we verify your account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2
              size={52}
              className="mx-auto text-emerald-600"
            />

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Email Verified!
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {message}
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "alreadyVerified" && (
          <>
            <CheckCircle2
              size={52}
              className="mx-auto text-emerald-600"
            />

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Email Already Verified
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {message}
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle
              size={52}
              className="mx-auto text-rose-500"
            />

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Verification Failed
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {message}
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/login"
                className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Go to Login
              </Link>

              <Link
                to="/register"
                className="inline-flex rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Register Again
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
