/// <reference types="angular" />

declare var ENV: string;
// allow tsc to not throw errors for tests when referencing window.module
interface Window {
  module?: any
}

declare namespace LogEx {
  export interface ILogService extends angular.ILogService {
    getInstance(namespace: string, override?: boolean, useTemplate?: boolean, colorCss?: string): ILogService;
  }
}
