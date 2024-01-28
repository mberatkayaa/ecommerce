export function createLayoutInfos(infos: Array<ILayoutInfo>): Array<LayoutInfo> {
  const result: Array<LayoutInfo> = [];
  for (let i = 0; i < infos.length; i++) {
    const element = infos[i];
    const info = new LayoutInfo();
    info.path = element.path;
    info.visibility = element.visibility;
    if (element.children && element.children.length > 0) {
      info.addChildren(...createLayoutInfos(element.children));
    }

    result.push(info);
  }
  return result;
}

export interface ILayoutInfo {
  path: string;
  visibility: { [key: string]: boolean };
  children?: Array<ILayoutInfo>;
}

export class LayoutInfo implements ILayoutInfo {
  path: string = null;
  visibility: { [key: string]: boolean } = {};
  children: Array<LayoutInfo> = [];

  get segments() {
    return this.path === "/" ? [this.path] : this.path.split("/").map((x) => (x === "" ? "/" : x));
  }

  addChildren = (...infos: Array<LayoutInfo>) => {
    this.children.push(...infos);
  };
}
