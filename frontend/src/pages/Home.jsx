
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  MapPin,
  Search,
  ShieldCheck,
  ExternalLink,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Describe the issue",
    text: "Explain the public problem clearly, including when and where it occurred.",
  },
  {
    icon: MapPin,
    number: "02",
    title: "Provide location and evidence",
    text: "Add the affected location and supporting photos or files when available.",
  },
  {
    icon: Search,
    number: "03",
    title: "Review your next steps",
    text: "Check complaint details, follow status updates and look for relevant official filing guidance.",
  },
];

const principles = [
  {
    icon: MapPin,
    title: "Location matters",
    text: "The responsible department can depend on the issue and the local jurisdiction where it occurred.",
  },
  {
    icon: ShieldCheck,
    title: "Check official sources",
    text: "Before submitting personal information on an external website, verify that the destination belongs to the relevant authority.",
  },
  {
    icon: ClipboardList,
    title: "Keep a reference",
    text: "Use your complaint reference number to identify the complaint and find its details in CivicRouteX.",
  },
];

const Home = () => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <div className="min-h-screen overflow-hidden bg-[#edf5f1]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#edf9f5] lg:min-h-screen">
        <img
          src="/images/civicroute-banner.png"
          alt="CivicRouteX civic grievance platform"
          className="absolute inset-0 hidden h-full w-full object-cover object-center lg:block lg:object-fill"
        />

        <div className="absolute inset-y-0 left-0 hidden w-[58%] bg-gradient-to-r from-[#edf9f5]/95 via-[#edf9f5]/80 to-transparent lg:block" />

        <Navbar transparent />

        <div className="relative z-10 mx-6 flex min-h-[540px] items-center px-2 pt-10 sm:px-6 lg:mx-12 lg:min-h-screen lg:px-0 lg:pt-16">
          <div className="max-w-[560px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/90 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm backdrop-blur-sm">
              <ShieldCheck size={17} />
              A clearer path for civic grievances
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Report Problems.
              <span className="block bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text pb-2 text-transparent">
                Reach the Right Authority.
              </span>
            </h1>

            <p className="mt-6 max-w-[540px] text-base leading-7 text-slate-600 sm:text-lg">
              CivicRouteX helps citizens document public issues, organise
              supporting evidence, review complaint progress and find relevant
              official filing guidance.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={isLoggedIn ? "/complaints/create" : "/register"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-teal-200 transition hover:-translate-y-1 hover:shadow-xl"
              >
                Report an Issue
                <ArrowRight size={18} />
              </Link>

              <Link
                to={isLoggedIn ? "/complaints" : "/login"}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
              >
                My Complaints
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              {[
                "Organised complaint details",
                "Evidence attachments",
                "Status history",
              ].map((feature) => (
                <span key={feature} className="flex items-center gap-2">
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-emerald-500"
                  />
                  {feature}
                </span>
              ))}
            </div>

            <p className="mt-7 text-sm font-semibold text-teal-700/80">
              Cleaner Cities. Stronger Communities.
            </p>
          </div>
        </div>

        {/* MOBILE BANNER */}
        <div className="relative mt-2 h-[250px] overflow-hidden lg:hidden">
          <img
            src="/images/civicroute-banner.png"
            alt="CivicRouteX civic platform"
            className="absolute inset-0 h-full w-full object-cover object-right"
          />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#edf9f5] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#edf5f1] to-transparent" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#f7faf8] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From problem to next steps
            </h2>
            <p className="mt-3 leading-6 text-slate-600">
              Keep the information about a civic issue organised and accessible
              in one place.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(({ icon: Icon, number, title, text }) => (
              <div
                key={number}
                className="group rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="rounded-xl bg-teal-50 p-3 transition group-hover:bg-teal-100">
                    <Icon size={23} className="text-teal-600" />
                  </div>
                  <span className="text-3xl font-bold text-slate-300">
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

      {/* PLATFORM PURPOSE */}
      <section className="bg-[#e4f0eb] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">
              Why CivicRouteX?
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Make civic issues easier to understand and follow.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Public issues can involve different departments and levels of
              government. CivicRouteX is designed to help citizens organise
              the problem, record its location and understand possible next
              steps without confusing a platform record with an official
              government submission.
            </p>

            <Link
              to={isLoggedIn ? "/complaints" : "/register"}
              className="mt-6 inline-flex items-center gap-2 font-semibold text-teal-700 transition hover:text-teal-900"
            >
              {isLoggedIn ? "View My Complaints" : "Create an Account"}
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg sm:col-span-2">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    One place for complaint details
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Review the description, location, attached evidence and
                    recorded status history of your complaint.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
              <MapPin size={22} className="text-teal-700" />
              <h3 className="mt-3 font-bold text-slate-900">
                Location-aware context
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Location details can help identify which jurisdiction may be
                relevant.
              </p>
            </div>

            <div className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
              <ShieldCheck size={22} className="text-teal-700" />
              <h3 className="mt-3 font-bold text-slate-900">
                Official-source awareness
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Check the destination before using an external government
                filing service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPORTANT INFORMATION */}
      <section className="bg-[#f7faf8] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">
              Know before you submit
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Clear information. Better follow-up.
            </h2>
            <p className="mt-3 leading-6 text-slate-600">
              A few practical things to keep in mind when reporting a public
              issue.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-xl bg-teal-50 p-3 text-teal-700">
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 transition-shadow duration-300 hover:shadow-md sm:p-6">
            <div className="flex items-start gap-3">
              <ExternalLink
                size={20}
                className="mt-0.5 shrink-0 text-amber-700"
              />
              <div>
                <h3 className="font-bold text-amber-950">
                  CivicRouteX is not a government department
                </h3>
                <p className="mt-2 text-sm leading-6 text-amber-900">
                  Submitting a complaint on CivicRouteX does not, by itself,
                  mean it has been submitted to a government authority. Use
                  the relevant official portal when required, and retain any
                  acknowledgement issued by that portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Home;
