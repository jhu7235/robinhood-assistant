export class Logger {
  constructor(private name: string) { }

  public log(...parameter) {
    console.log(`${this.name}:`, ...arguments);
  }

  public warn(...parameter) {
    console.log(`${this.name}:`, ...parameter);
  }

  public info(...parameter) {
    console.log(`${this.name}:`, ...parameter);
  }
}
