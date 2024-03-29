import ServiceContainer from "./ServiceContainer";

export abstract class Service {

  private _container? : ServiceContainer;
  injectServices(container: ServiceContainer) {
    this._container = container;
  }

  protected get services() {
    if (this._container == undefined) throw new Error("Container not injected");
    return this._container.services;
  }

}
