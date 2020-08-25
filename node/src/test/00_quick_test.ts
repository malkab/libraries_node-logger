// Proper testing must be done with Mocha

console.log(`

---------------------------

Quick Test

---------------------------

`);

import { NodeLogger, ELOGLEVELS } from "../lib/index";

const nl: NodeLogger = new NodeLogger({
  logFilePath: "/ext_src/",
  appName: "the_app",
  consoleOut: true,
  datePattern: "YYYY_MM_DD_HH_mm",
  maxFiles: 3,
  maxSize: "10k",
  minLogLevel: ELOGLEVELS.INFO
});

const i: any = setInterval(() => {

    nl.logDebug({
      message: "debug",
      methodName: "methodName",
      moduleName: "moduleName",
      payload: { a: 0, b: 1 }
    })

    nl.logError({
      message: "error",
      methodName: "methodName",
      moduleName: "moduleName",
      payload: { a: 0, b: 1 }
    })

    nl.logWarn({
      message: "warn",
      methodName: "methodName",
      moduleName: "moduleName",
      payload: { a: 0, b: 1 }
    })

    nl.logInfo({
      message: "info",
      methodName: "methodName",
      moduleName: "moduleName",
      payload: { a: 0, b: 1 }
    })

  }, 500

);
