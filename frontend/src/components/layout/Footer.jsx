import {
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  Globe,
} from "lucide-react";

const Footer = () => {
  return (
    <div className="pt-6">
      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      <footer className="flex flex-col items-center py-6 text-center">
        {/* Social / Developer Links */}
        <nav>
          <div className="flex items-center gap-3">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/amar6003"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
            >
              <BriefcaseBusiness size={18} />
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/Amar-6003"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
            >
              <Code2 size={18} />
            </a>

            {/* Portfolio */}
            <a
              href="https://amarfolio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
            >
              <Globe size={18} />
            </a>
          </div>
        </nav>

        {/* Credit */}
        <p className="mt-4 text-sm text-slate-400">
          © {new Date().getFullYear()} CivicRouteX · Built with ❤️ by{" "}
          <a
            href="https://amarfolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-teal-600 transition hover:text-teal-500"
          >
            CodeWithAmar
            <ExternalLink size={11} />
          </a>
        </p>

        {/* Group Project Note */}
        <p className="mt-1 text-sm text-slate-400">
          A collaborative project for smarter public grievance management.
        </p>
      </footer>
    </div>
  );
};

export default Footer;