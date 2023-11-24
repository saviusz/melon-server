import { ServiceContainer } from "./ServiceContainer";

export abstract class Service {

  protected container;

  constructor(container: ServiceContainer) {
    this.container = container;
  }

}
