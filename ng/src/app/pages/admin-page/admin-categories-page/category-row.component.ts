import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { IconsService } from "../../../shared/services/icons.service";
import { CategoryService } from "../../../shared/services/category.service";
import { Subject, Subscription } from "rxjs";
import { HttpStatus } from "../../../shared/misc/HttpStatus";
import { getGroupValue } from "../../../shared/misc/helpers";

@Component({
  selector: "[app-category-row]",
  template: `
    <th>{{ rowNumber }}</th>
    <td>
      <span *ngIf="!editMode">{{ group }}</span>
      <select *ngIf="editMode" [(ngModel)]="enteredGroup" class="select select-bordered select-sm w-full">
        <option value="mousePad" selected>Mouse Pad</option>
        <option value="bardak">Kupa Bardak</option>
        <option value="patch">Patch & Yama</option>
        <option value="yastık">Gamer Yastık</option>
        <option value="stand">Kulaklık Standı</option>
        <option value="poster">Ahşap Poster</option>
      </select>
    </td>
    <td>
      <span *ngIf="!editMode">{{ title }}</span>
      <input type="text" *ngIf="editMode" [(ngModel)]="enteredTitle" class="input input-bordered input-sm w-full" />
    </td>
    <td class="flex gap-3">
      <button
        (click)="editSaveHandler()"
        [title]="!editMode ? 'Düzenle' : 'Kaydet'"
        class="bg-warning text-warning-content hover:bg-warning/80 rounded-full h-7 w-7 text-base flex items-center justify-center">
        <fa-icon [icon]="!editMode ? iconsService.edit : iconsService.check" />
      </button>
      <button
        (click)="deleteCancelHandler()"
        [title]="!editMode ? 'Sil' : 'İptal'"
        class="bg-error text-error-content hover:bg-error/80 rounded-full h-7 w-7 text-base flex items-center justify-center">
        <fa-icon [icon]="!editMode ? iconsService.delete : iconsService.xMark" />
      </button>
    </td>
  `,
})
export class CategoryRowComponent implements OnInit, OnDestroy {
  private status: Subject<HttpStatus>;
  private subscription: Subscription;

  @Input() rowNumber: number = 0;
  @Input() group: string = "";
  @Input() title: string = "";
  @Input() _id: string = "";

  editMode: boolean = false;
  enteredGroup: string = "mousePad";
  enteredTitle: string = "";

  constructor(protected iconsService: IconsService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.status = new Subject<HttpStatus>();
  }
  ngOnDestroy(): void {
    this.clearSubscription();
  }

  editSaveHandler() {
    if (!this.editMode) {
      this.enteredGroup = getGroupValue(this.group);
      this.enteredTitle = this.title;
      this.editMode = true;
      return;
    }
    this.subscription = this.status.subscribe({
      next: (value) => {
        if (value.done) {
          this.editMode = false;
          console.log("Değişiklikler kaydedildi.");
        } else if (value.error) {
          console.log("Hata");
        }

        if (value.completed) this.clearSubscription();
      },
    });
    this.categoryService.editCategory(this._id, this.enteredGroup, this.enteredTitle, this.status).subscribe();
  }

  deleteCancelHandler() {
    if (this.editMode) {
      this.editMode = false;
      return;
    }
    this.subscription = this.status.subscribe({
      next: (value) => {
        if (value.done) {
          this.editMode = false;
          console.log("Değişiklikler kaydedildi.");
        } else if (value.error) {
          console.log("Hata");
        }

        if (value.completed) this.clearSubscription();
      },
    });
    this.categoryService.deleteCategory(this._id, this.status).subscribe();
  }

  clearSubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
