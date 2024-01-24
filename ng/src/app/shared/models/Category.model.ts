import { List } from "../misc/List";

export class Category extends List<Category> {
  constructor();
  constructor(public id?: string, public title?: string, public description?: string, ...categories: Array<Category>) {
    super();
    this.add(...categories);
  }
}
