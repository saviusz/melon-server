import ConsoleTransport from "./ConsoleTransport";

export interface LoggerTransport {
  log(obj: LogObject): void;
}

export interface LogObject {
  level     : LogLevel;
  timestamp : Date;
  message?  : string;
  duration? : number;
  error?    : Error;
  route?    : string;
  method?   : string;
  status?   : number;
}

interface Settings {
  transports: LoggerTransport[];
}

class Logger {

  private settings: Settings;

  constructor(settings?: Partial<Settings>) {
    this.settings = {
      ...{ transports: [ new ConsoleTransport() ] },
      ...settings
    };
  }

  private log(level: LogLevel, message: string | Error, logObj?: Partial<LogObject>) {
    const object: LogObject = {
      level,
      timestamp : new Date(),
      message   : message instanceof Error ? undefined : message,
      error     : message instanceof Error ? message : undefined,
      ...logObj
    };

    for (const transport of this.settings.transports) transport.log(object);
  }

  debug = (message: string | Error, logObj?: Partial<Omit<LogObject, "level" | "message">>) =>
    this.log(LogLevel.debug, message, logObj);

  info = (message: string | Error, logObj?: Partial<Omit<LogObject, "level" | "message">>) =>
    this.log(LogLevel.info, message, logObj);

  warn = (message: string | Error, logObj?: Partial<Omit<LogObject, "level" | "message">>) =>
    this.log(LogLevel.warn, message, logObj);

  error = (message: string | Error, logObj?: Partial<Omit<LogObject, "level" | "message">>) =>
    this.log(LogLevel.error, message, logObj);


}

export enum LogLevel {
  debug,
  info,
  warn,
  error,
  fatal,
}

export const logger = new Logger();
