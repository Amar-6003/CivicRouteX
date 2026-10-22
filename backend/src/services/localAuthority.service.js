const normalize = (value) =>
  value?.toString().trim() || "";

export const buildLocalAuthority = (
  localBody
) => {
  if (!localBody) {
    return null;
  }

  const name =
    normalize(localBody.name);

  const type =
    normalize(localBody.type);

  if (!name || !type) {
    return null;
  }

  let authorityName = name;

  const normalizedType =
    type.toLowerCase();

  /*
   * Municipal Corporation
   */

  if (
    normalizedType.includes(
      "municipal corporation"
    )
  ) {
    authorityName =
      `${name} Municipal Corporation`;
  }

  /*
   * Municipality
   */

  else if (
    normalizedType ===
    "municipality"
  ) {
    authorityName =
      `${name} Municipality`;
  }

  /*
   * Nagar Panchayat
   */

  else if (
    normalizedType.includes(
      "nagar panchayat"
    )
  ) {
    authorityName =
      `${name} Nagar Panchayat`;
  }

  /*
   * Town Panchayat
   */

  else if (
    normalizedType.includes(
      "town panchayat"
    )
  ) {
    authorityName =
      `${name} Town Panchayat`;
  }

  /*
   * Village / Gram Panchayat
   */

  else if (
    normalizedType.includes(
      "village panchayat"
    ) ||
    normalizedType.includes(
      "gram panchayat"
    )
  ) {
    authorityName =
      `${name} Gram Panchayat`;
  }

  return {
    id: `LGD-${localBody.lgdCode}`,

    name: authorityName,

    level: "LOCAL",

    verified: true,

    source: "Local Government Directory (LGD)",

    lgdCode:
      localBody.lgdCode,

    localBodyName:
      localBody.name,

    localBodyType:
      localBody.type,

    state:
      localBody.state,

    stateCode:
      localBody.stateCode,
  };
};