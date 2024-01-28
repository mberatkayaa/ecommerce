import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "fileName",
})
export class FileNamePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    let result = value;
    if (value.includes("/")) {
      result = value.split("/").pop().trim();
    }
    return result;
  }
}
