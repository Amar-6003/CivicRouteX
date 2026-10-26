const normalize = (value) =>
  String(value ?? "")
    .normalize("NFKC")
    .trim();

const normalizeName = (value) =>
  normalize(value)
    .toLowerCase()
    .replace(/[.,()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/*
 * A jurisdiction record and an official submission portal
 * are two different things. Do not claim portal verification
 * just because the LGD record exists.
 */
const officialPortals = [
  {
    names: ["navi mumbai", "navi mumbai municipal corporation", "nmmc"],
    state: "maharashtra",
    url: "https://services.india.gov.in/service/detail/grievances-for-navi-mumbai-municipal-corporation-maharashtra",
    label: "View NMMC Grievance Service",
    source: "National Government Services Portal",
  },
  {
    names: [
      "brihanmumbai municipal corporation",
      "municipal corporation of greater mumbai",
      "mumbai municipal corporation",
      "bmc",
      "mcgm",
    ],
    state: "maharashtra",
    url: "https://portal.mcgm.gov.in/",
    label: "Open BMC Official Website",
    source: "BMC Official Website",
  },
  {
    names: ["thane", "thane municipal corporation"],
    state: "maharashtra",
    url: "https://thanecity.gov.in/",
    label: "Open Thane Municipal Corporation",
    source: "Thane Municipal Corporation Official Website",
  },
  {
    names: [
      "ahmedabad",
      "ahmedabad municipal corporation",
      "amdavad municipal corporation",
    ],
    state: "gujarat",
    url: "https://ahmedabadcity.gov.in/",
    label: "Open Ahmedabad Municipal Corporation",
    source: "Ahmedabad Municipal Corporation Official Website",
  },
];

const getOfficialPortal = (localBody) => {
  const name = normalizeName(localBody.name);
  const entityName = normalizeName(localBody.entityName);
  const state = normalizeName(localBody.state);

  if (!state || (!name && !entityName)) return null;

  return (
    officialPortals.find(
      (item) =>
        normalizeName(item.state) === state &&
        item.names.some((alias) => {
          const normalizedAlias = normalizeName(alias);
          return normalizedAlias === name || normalizedAlias === entityName;
        }),
    ) ?? null
  );
};

export const buildLocalAuthority = (localBody) => {
  if (!localBody?.lgdCode || !localBody?.name || !localBody?.type) {
    return null;
  }

  const name = normalize(localBody.name);
  const type = normalize(localBody.type);
  const state = normalize(localBody.state);

  if (!name || !type || !state) return null;

  const portal = getOfficialPortal(localBody);

  return {
    id: `LGD-${localBody.lgdCode}`,
    name,
    level: "LOCAL",

    // LGD record verifies the directory match, not portal ownership.
    jurisdictionVerified: true,
    verified: true,
    source: "Local Government Directory (LGD)",

    lgdCode: localBody.lgdCode,
    localBodyName: name,
    localBodyType: type,
    state,
    stateCode: localBody.stateCode ?? null,

    officialPortal: portal?.url ?? null,
    officialPortalLabel: portal?.label ?? null,
    officialPortalSource: portal?.source ?? null,
    officialPortalVerified: Boolean(portal),
    submissionMethod: portal ? "OFFICIAL_SERVICE_LINK" : null,
  };
};
