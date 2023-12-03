import { WriteStream } from "tty";
import { LogLevel, LogObject, LoggerTransport } from "./Logger";
import { black, blue, bold, dim, green, redBright, yellow } from "colorette";

export default class ConsoleTransport implements LoggerTransport {

  private getTypeString(type: LogLevel) : string {
    const maxLength = 7;
    switch (type) {
      case LogLevel.info:
        return bold(dim("INFO".padStart(maxLength)));

      case LogLevel.debug:
        return bold(blue("DEBUG".padStart(maxLength)));

      default:
        return bold(dim(black("UNKNOWN".padStart(maxLength))));
    }
  }

  private getStatusText(status: number) {
    let transform = (input: string) => input;
    if (status >= 500 ) transform = redBright;
    else if (status >= 400) transform = yellow;
    else if (status >= 300) transform = blue;
    else if (status >= 200) transform = green;

    return transform(status.toString());
  }

  log(obj: LogObject): void {
    let output : WriteStream = process.stdout;
    if (obj.error != undefined) output = process.stderr;
    const level = this.getTypeString(obj.level);
    output.write(level);
    if (obj.status != undefined) output.write(" " + this.getStatusText(obj.status));
    output.write(" " + obj.message);
    output.write("\n");
  }

}
