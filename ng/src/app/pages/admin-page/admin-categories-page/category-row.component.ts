import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { IconsService } from "../../../shared/services/icons.service";
import { CategoryService } from "../../../shared/services/category.service";
import { Subject, Subscription } from "rxjs";
import { HttpStatus } from "../../../shared/misc/HttpStatus";
import { getGroupValue } from "../../../shared/misc/helpers";
import { NotificationHandlerService } from "../../../shared/services/notification-handler.service";

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
  private subscription: Subscription;

  @Input() rowNumber: number = 0;
  @Input() group: string = "";
  @Input() title: string = "";
  @Input() _id: string = "";

  editMode: boolean = false;
  enteredGroup: string = "mousePad";
  enteredTitle: string = "";

  constructor(
    protected iconsService: IconsService,
    private categoryService: CategoryService,
    private notificationHandler: NotificationHandlerService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  editSaveHandler() {
    if (!this.editMode) {
      this.enteredGroup = getGroupValue(this.group);
      this.enteredTitle = this.title;
      this.editMode = true;
      return;
    }
    this.categoryService.editCategory(this._id, this.enteredGroup, this.enteredTitle).subscribe({
      next: (value) => {
        const { status, result, bag } = value;
        if (status.loading) {
          value.setBag(
            this.notificationHandler.addNotification({
              type: "notification",
              title: "Düzenleniyor",
              description: "Kategori düzenleniyor.",
            })
          );
        } else if (status.completed) {
          this.enteredTitle = "";
          if (bag) {
            this.notificationHandler.resolveNotification(bag);
          }
          if (status.error) {
            this.notificationHandler.addNotification({
              type: "error",
              title: "Hata!",
              description: result.message,
            });
          }
          if (status.done) {
            this.editMode = false;
            this.notificationHandler.addNotification({
              type: "notification",
              title: "Başarılı!",
              description: "Kategori başarıyla düzenlendi!",
            });
          }
        }
      },
    });
  }

  deleteCancelHandler() {
    if (this.editMode) {
      this.editMode = false;
      return;
    }
    this.categoryService.deleteCategory(this._id).subscribe({
      next: (value) => {
        const { status, result, bag } = value;
        if (status.loading) {
          value.setBag(
            this.notificationHandler.addNotification({
              type: "notification",
              title: "Kaldırılıyor",
              description: "Kategori kaldırılıyor.",
            })
          );
        } else if (status.completed) {
          this.enteredTitle = "";
          if (bag) {
            this.notificationHandler.resolveNotification(bag);
          }
          if (status.error) {
            this.notificationHandler.addNotification({
              type: "error",
              title: "Hata!",
              description: result.message,
            });
          }
          if (status.done) {
            this.editMode = false;
            this.notificationHandler.addNotification({
              type: "notification",
              title: "Başarılı!",
              description: "Kategori başarıyla kaldırıldı!",
            });
          }
        }
      },
    });
  }
}
