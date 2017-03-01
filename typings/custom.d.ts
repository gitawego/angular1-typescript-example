declare var ENV: string;
declare namespace LogEx {
  interface ILogService {
    getInstance(id: string, override?: boolean, useTemplate?: boolean, colorCss?: string): ILogService;
    debug(...msg: any[]): void;
    info(...msg: any[]): void;
    log(...msg: any[]): void;
    warn(...msg: any[]): void;
    error(...msg: any[]): void;
  }
}