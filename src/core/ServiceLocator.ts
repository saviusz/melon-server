import { Service } from "../interfaces/Service";

export class ServiceLocator {
  private static singleton: ServiceLocator;
  private services = new Map<string, Service>();

  constructor() {
    if (ServiceLocator.singleton) return ServiceLocator.singleton;
    ServiceLocator.singleton = this;
  }

  registerService(name: string, service: Service) {
    this.services.set(name, service);
  }

  import(name: string) {
    const service = this.services.get(name);
    if (service == undefined) throw new Error(`Can't find service ${name}`);
    return service;
  }
}
