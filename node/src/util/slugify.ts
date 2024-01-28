import lodash from "lodash";
import ShortUniqueId from "short-unique-id";

export function slugify(value: string) {
  return encodeURI(lodash.kebabCase(lodash.escape(value)) + "-" + new ShortUniqueId.default({ length: 5 }).rnd());
}
