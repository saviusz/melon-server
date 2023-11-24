import { Service } from "./Service";

export class ServiceContainer {

  private services = new Map<string, Service>();

  register(type: typeof Service, builder: (services: ServiceContainer) => Service) {
    this.services.set(type.name, builder(this));
  }

  Get<T extends Service>(service: typeof Service) : T {
    if (!this.services.has(service.name)) {
      throw Error(`Service ${service.name} missing or not loaded`);
    }
    return this.services.get(service.name) as T;
  }

}
