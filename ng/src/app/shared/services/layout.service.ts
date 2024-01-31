import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { LayoutInfo, createLayoutInfos } from "../misc/LayoutInfo";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class LayoutService {
  private infos = createLayoutInfos([
    {
      path: "/",
      visibility: { header: true, navbar: true },
      children: [
        {
          path: "signin",
          // visibility: { navbar: false },
          visibility: {},
        },
        {
          path: "signup",
          // visibility: { header: false },
          visibility: {},
        },
      ],
    },
    {
      path: "/admin",
      visibility: {},
    },
  ]);

  visibility = new BehaviorSubject<{ [key: string]: boolean }>(null);

  constructor(private router: Router) {
    this.router.events.subscribe({
      next: (value) => {
        if (value instanceof NavigationEnd) {
          const visibility = this.findVisibility(this.infos, value.url);
          this.visibility.next(visibility);
        }
      },
    });
  }

  display(key: string): boolean {
    let result = false;
    if (this.visibility.value && typeof this.visibility.value[key] === "boolean") result = this.visibility.value[key];
    return result;
  }

  private findVisibility(infos: Array<LayoutInfo>, url: string): { [key: string]: boolean } | null {
    let result = null;
    if (!infos || infos.length <= 0) {
      return result;
    }

    for (let i = 0; i < infos.length; i++) {
      const info = infos[i];
      if (info.path === url) {
        result = { ...info.visibility };
        return result;
      }
    }

    const urlInfo = new LayoutInfo();
    urlInfo.path = url;
    const urlSegments = urlInfo.segments;

    for (let i = 0; i < infos.length; i++) {
      const info = infos[i];
      const infoSegments = info.segments;

      const searchSegmentStartSliced = urlSegments.slice(0, infoSegments.length);
      const searchSegmentStartPart = searchSegmentStartSliced.join("/").replace("//", "/");
      if (urlSegments.length >= infoSegments.length && searchSegmentStartPart === info.path) {
        const searchSegmentEndSliced = urlSegments.slice(infoSegments.length);
        const searchSegmentEndPart = searchSegmentEndSliced.join("/").replace("//", "/");
        const visibility = info.visibility;
        const visibilityChildren = this.findVisibility(info.children, searchSegmentEndPart);
        result = JSON.parse(JSON.stringify(visibility));
        if (visibilityChildren) {
          result = { ...result, ...visibilityChildren };
        }
      }
    }
    return result;
  }
}
