import * as winston from "winston";

import * as path from "path";

import * as lodash from "lodash";

/**
 *
 * Levels for logging.
 *
 */
export enum ELOGLEVELS {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug"
}

/**
 *
 * Encapsulates a Winston log.
 *
 */
export class NodeLogger {

  /**
   *
   * NODE_ENV
   *
   */
  private _nodeEnv: string;

  /**
   *
   * The Winston logger.
   *
   */
  private _log: winston.Logger;

  /**
    *
    * Defaults for Winston.
    *
    */
  private _winstonCsvFormat: any;
  private _winstonTxtFormat: any;
  private _winstonConsoleFormat: any;

  /**
   *
   * Transports.
   *
   */
  private _winstonTransports: any[];

  /**
   *
   * Constructor.
   *
   * @param __namedParameters     ApiRouter options.
   * @param logFilePath           **Optional**. A Log object for automatically
   *                              log HTTP responses via the
   *                              @HttpServer.processResponse handler.
   * @param logLevelDevelopment   The minimum level to log at development level.
   *                              Defaults to ELOGLEVELS.DEBUG.
   * @param logLevelProduction    The minimum level to log at production level.
   *                              Defaults to ELOGLEVELS.INFO.
   * @param nodeEnvironment       The NODE environment, either "production" or
   *                              "development". Defaults to "production".
   *
   */
  constructor({
    logFilePath = "/logs",
    logLevelDevelopment = ELOGLEVELS.DEBUG,
    logLevelProduction = ELOGLEVELS.INFO,
    nodeEnvironment = "production"
  }: {
    logFilePath?: string;
    logLevelDevelopment?: ELOGLEVELS;
    logLevelProduction?: ELOGLEVELS;
    nodeEnvironment?: string;
  }) {

    // This is a hack to access the items of ELOGLEVELS with a
    // string as an index
    const ELOGLEVELSI: { [idx: string]: ELOGLEVELS; } = <any>ELOGLEVELS;

    // Set NODE_ENV
    this._nodeEnv = nodeEnvironment !== "development" ?
      "production" : "development";

    // Set formats
    const { combine, timestamp, printf, metadata } = winston.format;

    // CSV, for production
    const winstonCsvFormatDef = printf(
      ({ level, timestamp, message, metadata }) => {
        return `'${timestamp}','${level}','${metadata.moduleRouter}','${metadata.methodRouter}','${message}','${JSON.stringify(metadata.payload)}'`;
      }
    );

    this._winstonCsvFormat = combine(
      timestamp(),
      winstonCsvFormatDef
    );

    // Console, for development
    const winstonConsoleFormatDef = printf(
      ({ level, timestamp, message, metadata }) => {
        return `${timestamp} ${lodash.padEnd(level, 5)} > ${metadata.moduleRouter} ${metadata.methodRouter} ${message} ${metadata.payload ? JSON.stringify(metadata.payload) : ""}`;
      }
    );

    this._winstonConsoleFormat = combine(
      timestamp(),
      winstonConsoleFormatDef
    );

    // Set transports, depends on NODE_ENV
    this._winstonTransports = [];

    if (this._nodeEnv === "production") {

      // Production mode

      // Default complete log
      this._winstonTransports.push(
        new winston.transports.File({
          filename: path.join(logFilePath, "log.csv"),
          level: logLevelProduction
        })
      );

      // Errors
      this._winstonTransports.push(
        new winston.transports.File({
          filename: path.join(logFilePath, "error.csv"),
          level: ELOGLEVELS.ERROR
        })
      );

    } else {

      // Development mode

      // Default complete log
      this._winstonTransports.push(
        new winston.transports.File({
          filename: path.join(logFilePath, "log.csv"),
          level: logLevelDevelopment
        })
      );

      // Errors
      this._winstonTransports.push(
        new winston.transports.File({
          filename: path.join(logFilePath, "error.csv"),
          level: ELOGLEVELS.ERROR
        })
      );

      // Add an additional console log
      this._winstonTransports.push(
        new winston.transports.Console({
          format: this._winstonConsoleFormat,
          level: (<any>ELOGLEVELS)[logLevelDevelopment]
        })
      );

    }

    /**
     *
     * Configure Winston here. Additional settings at
     * apiservicesdefaults.ts
     *
     */
    this._log = winston.createLogger({

      format: this._winstonCsvFormat,
      transports: this._winstonTransports

    });

  }

  /**
   *
   * A handy method for debug messages.
   *
   * @param __namedParameters     Logging options.
   * @param moduleName            Module name the error was thrown in.
   * @param methodName            Method name the error was thrown in.
   * @param payload               **Optional**. An optional payload. Don't be
   *                              too verbose!!!
   * @param message               A message describing the error.
   *
   */
  public logDebug({
    moduleName,
    methodName,
    payload = null,
    message
  }: {
    moduleName: string;
    methodName: string;
    payload?: any;
    message: string;
}): void {

  this._log.debug(message, { metadata: {
    moduleRouter: moduleName,
    methodRouter: methodName,
    message: message,
    payload: payload
  }})

}

  /**
   *
   * A handy method for warn messages.
   *
   * @param __namedParameters     Logging options.
   * @param moduleName            Module name the error was thrown in.
   * @param methodName            Method name the error was thrown in.
   * @param payload               **Optional**. An optional payload. Don't be
   *                              too verbose!!!
   * @param message               A message describing the error.
   *
   */
  public logWarn({
    moduleName,
    methodName,
    payload = null,
    message
  }: {
    moduleName: string;
    methodName: string;
    payload?: any;
    message: string;
}): void {

  this._log.warn(message, { metadata: {
    moduleRouter: moduleName,
    methodRouter: methodName,
    message: message,
    payload: payload
  }})

}

  /**
   *
   * A handy method for info messages.
   *
   * @param __namedParameters     Logging options.
   * @param moduleName            Module name the error was thrown in.
   * @param methodName            Method name the error was thrown in.
   * @param payload               **Optional**. An optional payload. Don't be
   *                              too verbose!!!
   * @param message               A message describing the error.
   *
   */
  public logInfo({
      moduleName,
      methodName,
      payload = null,
      message
    }: {
      moduleName: string;
      methodName: string;
      payload?: any;
      message: string;
  }): void {

    this._log.info(message, { metadata: {
      moduleRouter: moduleName,
      methodRouter: methodName,
      message: message,
      payload: payload
    }})

  }

  /**
   *
   * A handy method for error messages.
   *
   * @param __namedParameters     Logging options.
   * @param moduleName            Module name the error was thrown in.
   * @param methodName            Method name the error was thrown in.
   * @param payload               **Optional**. An optional payload. Don't be
   *                              too verbose!!!
   * @param message               A message describing the error.
   *
   */
  public logError({
    moduleName,
    methodName,
    payload = null,
    message
  }: {
    moduleName: string;
    methodName: string;
    payload?: any;
    message: string;
}): void {

  this._log.error(message, { metadata: {
    moduleRouter: moduleName,
    methodRouter: methodName,
    message: message,
    payload: payload
  }})

}

}
