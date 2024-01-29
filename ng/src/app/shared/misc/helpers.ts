export const groups = [
  { value: "mousePad", name: "Mouse Pad" },
  { value: "bardak", name: "Kupa Bardak" },
  { value: "patch", name: "Patch & Yama" },
  { value: "yastık", name: "Gamer Yastık" },
  { value: "stand", name: "Kulaklık Standı" },
  { value: "poster", name: "Ahşap Poster" },
];

export function getGroupName(value: string): string {
  let result = value;
  result = groups.find((x) => x.value === value)?.name;
  return result;
}

export function getGroupValue(name: string): string {
  let result = name;
  result = groups.find((x) => x.name === name)?.value;
  return result;
}

export function splitUrl(val) {
  let url = "/";
  let queryParams = null;
  const splitted = val.split("?");
  url = splitted[0];
  if (splitted[1] && splitted[1].includes("&")) {
    const queryParamsArr = splitted[1].split("&");
    queryParamsArr.forEach((x) => {
      if (!x || !x.includes("=")) return;
      const s = x.split("=");
      const obj = {};
      obj[s[0]] = s[1];
      queryParams = { ...queryParams, ...obj };
    });
  }
  return { url, queryParams };
}
