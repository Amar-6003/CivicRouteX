import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit3,
  Lock,
} from "lucide-react";

const Profile = () => {
  return (
    <div className="page-bg min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">
            Account
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Profile
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage your CivicRouteX account information.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile card */}
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 p-6 text-white shadow-xl shadow-teal-100">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-3xl font-bold backdrop-blur">
              A
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Citizen
            </h3>

            <p className="mt-1 text-sm text-teal-50">
              Verified CivicRouteX User
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-white/10 p-3 text-xs">
              <ShieldCheck size={16} />
              Account verified
            </div>

            <div className="mt-5 border-t border-white/15 pt-5">
              <p className="text-xs text-teal-100">
                Member since
              </p>

              <p className="mt-1 text-sm font-semibold">
                2026
              </p>
            </div>
          </div>

          {/* Information */}
          <div className="dashboard-card p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h3 className="font-bold text-slate-900">
                  Personal Information
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Your basic account details
                </p>
              </div>

              <button className="flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-100">
                <Edit3 size={14} />
                Edit
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <InfoItem
                icon={User}
                label="Full Name"
                value="Citizen"
              />

              <InfoItem
                icon={Mail}
                label="Email Address"
                value="citizen@example.com"
              />

              <InfoItem
                icon={Phone}
                label="Phone Number"
                value="+91 XXXXX XXXXX"
              />

              <InfoItem
                icon={MapPin}
                label="Location"
                value="India"
              />
            </div>

            <div className="mt-7 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                  <Lock size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Security
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Keep your account credentials secure.
                  </p>
                </div>

                <button className="ml-auto text-xs font-semibold text-teal-600">
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-teal-600 shadow-sm">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default Profile;