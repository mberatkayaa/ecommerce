export class List<T> {
  protected _items: Array<T> = [];

  get items(): Array<T> {
    return [...this._items];
  }

  add(...items: Array<T>) {
    if (items && items.length > 0) this._items.push(...items);
  }

  remove(predicate: (value: T, index: number, obj: T[]) => unknown);
  remove(item: T);
  remove(arg: T | ((value: T, index: number, obj: T[]) => unknown)) {
    let index =
      typeof arg === "function"
        ? this._items.findIndex(arg as (value: T, index: number, obj: T[]) => unknown)
        : this._items.findIndex((x) => x === arg);
    if (index >= 0) this._items.splice(index, 1);
  }

  clear() {
    this._items.splice(0, this._items.length);
  }
}
