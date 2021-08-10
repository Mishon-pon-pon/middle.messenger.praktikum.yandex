import { HYPO } from "../HYPO/HYPO";

class Route {
  private _pathname: string = "";
  private _block?: (result?: any) => HYPO;
  private _props: Record<string, unknown>;
  asyncFN?: () => Promise<any>;

  constructor(
    pathname: string,
    view: () => HYPO,
    props: Record<string, unknown>,
    asyncFN?: () => Promise<any>
  ) {
    this._pathname = pathname.split("?")[0];
    this._props = props;
    this._block = view;
    this.asyncFN = asyncFN;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave(): void {
    if (this._block) {
      this._block().hide();
    }
  }

  match(pathname: string): boolean {
    return isEqual(pathname, this._pathname);
  }

  render() {
    if (!this._block) {
      return;
    }
    if (this.asyncFN) {
      this.asyncFN().then((result) => {
        this._block?.(result).render();
      });
    } else {
      this._block().render();
    }
  }
}

export class Router {
  private __instance: Router = this;
  routes: Route[] = [];
  private history: History = window.history;
  private _currentRoute: Route | null = null;
  private _rootQuery: string = "";

  constructor(rootQuery: string) {
    if (this.__instance) {
      return this.__instance;
    }
    this._rootQuery = rootQuery.split("?")[0];
  }

  use(
    pathname: string,
    block: (result?: any) => HYPO,
    asyncFN?: () => Promise<any>
  ): Router {
    const route = new Route(
      pathname,
      block,
      { rootQuery: this._rootQuery },
      asyncFN
    );
    this.routes.push(route);
    return this;
  }

  start(): Router {
    window.onpopstate = (_: PopStateEvent) => {
      let mask = new RegExp("#", "g");
      const url = window.location.hash.replace(mask, "");
      this._onRoute(url);
    };
    let mask = new RegExp("#", "g");
    const url = window.location.hash.replace(mask, "") || "/";
    this._onRoute(url);
    return this;
  }

  _onRoute(pathname: string): void {
    const route = this.getRoute(pathname);
    if (!route) {
      return;
    }
    if (this._currentRoute) {
      this._currentRoute.leave();
    }
    this._currentRoute = route;
    this._currentRoute.render();
  }

  go(pathname: string): void {
    this.history.pushState({}, "", `#${pathname}`);
    this._onRoute(pathname);
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  getRoute(pathname: string): Route | undefined {
    pathname = pathname.split("?")[0];
    return this.routes.find((route) => route.match(pathname));
  }
}

function isEqual(lhs: unknown, rhs: unknown) {
  return lhs === rhs;
}
