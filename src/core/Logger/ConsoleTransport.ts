import { WriteStream } from "tty";
import { LogLevel, LogObject, LoggerTransport } from "./Logger";
import { black, blue, bold, dim, gray, green, red, redBright, yellow } from "colorette";
import dayjs from "dayjs";

export default class ConsoleTransport implements LoggerTransport {

  private getTypeString(type: LogLevel) : string {
    const maxLength = 7;
    switch (type) {
      case LogLevel.debug:
        return bold(blue("DEBUG".padStart(maxLength)));

      case LogLevel.info:
        return bold(dim("INFO".padStart(maxLength)));

      case LogLevel.warn:
        return bold(yellow("WARN".padStart(maxLength)));

      case LogLevel.error:
        return bold(red("ERROR".padStart(maxLength)));

      case LogLevel.fatal:
        return bold(redBright("FATAL".padStart(maxLength)));

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
    const lines = this.getLines(obj);

    let output : WriteStream = process.stdout;
    if (obj.error != undefined) output = process.stderr;

    const level = this.getTypeString(obj.level);

    for (const [ index, line ] of lines.entries()) {
      let date = "";

      const opt = "none";
      switch(opt as string) {
        case "long":
          date = dayjs(obj.timestamp).format("YYYY-MM-DD HH:mm:ss.SSS");
          break;
        case "short":
          date = dayjs(obj.timestamp).format("HH:mm:ss.SSS");
          break;
      }

      output.write(
        gray(
          dim(`${date}`)
        )
      );

      output.write(index == 0
        ? level
        : " ".repeat(7));

      if (obj.method != undefined) output.write(index == 0 ? " " + obj.method : "   ");

      if (obj.status != undefined) output.write(" " + (
        index == 0
          ? this.getStatusText(obj.status)
          : "   "));

      output.write(" " + line);

      if(index == lines.length - 1) {

        if (obj.duration != undefined ) output.write(
          gray(
            dim(` - ${obj.duration.toFixed(3)}ms`)
          )
        );
      }
      output.write("\n");
    }
  }

  private getLines(obj: LogObject): string[] {
    const lines: string[] = [];
    if(obj.message != undefined) lines.push(...obj.message.split("\n"));
    if (obj.error != undefined && obj.error.stack) {
      lines.push(...obj.error.stack.split("\n"));
    }
    return lines;
  }

}
