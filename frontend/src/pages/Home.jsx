import {
  ArrowRight,
  CheckCircle2,
  FileText,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Report",
    text: "Describe your problem and upload supporting evidence.",
  },
  {
    icon: MapPin,
    number: "02",
    title: "Route",
    text: "Identify the appropriate authority based on issue and location.",
  },
  {
    icon: Search,
    number: "03",
    title: "Track",
    text: "Follow your complaint and know what happens next.",
  },
];

const categories = [
  "Infrastructure",
  "Sanitation",
  "Education",
  "Healthcare",
  "Transport",
  "Electricity",
  "Water",
  "Public Services",
];

const Home = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#edf5f1]">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#edf9f5] lg:min-h-screen">
        {/* ================= DESKTOP IMAGE ================= */}
        <img
          src="/images/civicroute-banner.png"
          alt="CivicRouteX civic grievance platform"
          className="absolute inset-0 hidden h-full w-full object-cover lg:object-fill object-center lg:block"
        />

        {/* Desktop left readability layer */}
        <div className="absolute inset-y-0 left-0 hidden w-[58%] bg-gradient-to-r from-[#edf9f5]/95 via-[#edf9f5]/80 to-transparent lg:block" />

        {/* ================= NAVBAR ================= */}
        <Navbar transparent />

        {/* ================= HERO CONTENT ================= */}
        <div className="relative z-10 mx-6 flex min-h-[620px] items-center px-2 pt-28 sm:px-6 lg:mx-12 lg:min-h-screen lg:px-0 lg:pt-16">
          <div className="max-w-[560px]">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/90 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm backdrop-blur-sm">
              <ShieldCheck size={17} />
              Smarter grievance reporting
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Report Problems.
              <span className="block bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text pb-2 text-transparent">
                Reach the Right Authority.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-[540px] text-base leading-7 text-slate-600 sm:text-lg">
              CivicRouteX helps citizens report public issues, provide evidence,
              find the appropriate authority and track their complaints from
              submission to resolution.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-teal-200 transition hover:-translate-y-1 hover:shadow-xl"
              >
                Report an Issue
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/complaints"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
              >
                Track Complaint
              </Link>
            </div>

            {/* Features */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-500" />
                Easy Reporting
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-500" />
                Smart Routing
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-500" />
                Complaint Tracking
              </span>
            </div>

            {/* Tagline */}
            <p className="mt-7 text-sm font-semibold text-teal-700/80">
              Cleaner Cities. Stronger Communities.
            </p>
          </div>
        </div>

        {/* ================= MOBILE IMAGE ================= */}
        <div className="relative mt-2 h-[280px] overflow-hidden lg:hidden">
          <img
            src="/images/civicroute-banner.png"
            alt="CivicRouteX civic platform"
            className="absolute inset-0 h-full w-full object-cover object-right"
          />

          {/* Fade image into page */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#edf9f5] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#edf5f1] to-transparent" />
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-[#f7faf8] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">
              How it works
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From problem to resolution
            </h2>

            <p className="mt-3 text-slate-600">
              A simple process designed around the citizen.
            </p>
          </div>

          {/* Steps */}
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(({ icon: Icon, number, title, text }) => (
              <div
                key={number}
                className="group rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="rounded-xl bg-teal-50 p-3 transition group-hover:bg-teal-100">
                    <Icon size={23} className="text-teal-600" />
                  </div>

                  <span className="text-3xl font-bold text-slate-100">
                    {number}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  {title}
                </h3>

                <p className="mt-2 leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CIVIC ISSUES ================= */}
      <section className="bg-[#e4f0eb] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">
              Civic Issues
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What can you report?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Report everyday public issues and help make your community better.
            </p>
          </div>

          {/* Categories */}
          <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <div
                key={category}
                className="rounded-xl border border-white bg-white/80 p-5 text-center font-medium text-slate-700 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:bg-white hover:text-teal-700 hover:shadow-md"
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative overflow-hidden bg-[#f7faf8] py-16">
        {/* Decorative blobs */}
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-teal-100/50 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
            <CheckCircle2 size={30} className="text-emerald-600" />
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Have a problem that needs attention?
          </h2>

          <p className="mt-3 text-slate-600">
            Let CivicRouteX help you find the right path.
          </p>

          <Link
            to="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-teal-200 transition hover:-translate-y-1 hover:shadow-xl"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default Home;
