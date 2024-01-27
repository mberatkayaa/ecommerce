const groupNames = [
  { value: "mousePad", name: "Mouse Pad" },
  { value: "bardak", name: "Kupa Bardak" },
  { value: "patch", name: "Patch & Yama" },
  { value: "yastık", name: "Gamer Yastık" },
  { value: "stand", name: "Kulaklık Standı" },
  { value: "poster", name: "Ahşap Poster" },
];

export function getGroupName(value: string): string {
  let result = value;
  result = groupNames.find((x) => x.value === value)?.name;
  return result;
}

export function getGroupValue(name: string): string {
  let result = name;
  result = groupNames.find((x) => x.name === name)?.value;
  return result;
}
