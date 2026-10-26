
import {
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  Globe,
} from "lucide-react";

const Footer = () => {
  return (
    <div className="bg-[#edf5f1] pt-6">
      <footer className="flex flex-col items-center px-4 pb-5 text-center">
        {/* Social / Developer Links */}
        <nav aria-label="Developer social links">
          <div className="flex items-center gap-3">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/amar6003"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-100 bg-white text-slate-500 shadow-sm transition-colors duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
            >
              <BriefcaseBusiness size={18} />
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/Amar-6003"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-100 bg-white text-slate-500 shadow-sm transition-colors duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
            >
              <Code2 size={18} />
            </a>

            {/* Portfolio */}
            <a
              href="https://amarfolio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio"
              title="Portfolio"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-100 bg-white text-slate-500 shadow-sm transition-colors duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
            >
              <Globe size={18} />
            </a>
          </div>
        </nav>

        {/* Copyright */}
        <p className="mt-4 text-sm text-slate-500">
          © {new Date().getFullYear()} CivicRouteX · Built with ❤️ by{" "}
          <a
            href="https://amarfolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-teal-700 transition-colors duration-200 hover:text-teal-900"
          >
            CodeWithAmar
            <ExternalLink size={11} />
          </a>
        </p>

        {/* Project Note */}
        <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
          Connecting citizens with the right direction for civic grievances.
        </p>

        {/* Project Purpose */}
        <p className="mt-2 text-sm leading-5 text-slate-400">
          Built to support transparent reporting, informed citizens and
          better public grievance management.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
