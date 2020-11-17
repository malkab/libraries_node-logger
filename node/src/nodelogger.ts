import * as winston from "winston";

import * as path from "path";

import lodash from "lodash";

require("winston-daily-rotate-file");

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
   * The Winston logger.
   *
   */
  private _log: winston.Logger;

  /**
   *
   * This class will produce a standard log file and an additional, non-rotating
   * file with errors called "errors".
   *
   * @param __namedParameters       ApiRouter options.
   * @param logFilePath             **Optional**, defaults to **\/logs**, sets
   *                                the path to store log files.
   * @param minLogLevel             **Optional**, defaults to
   *                                **ELOGLEVELS.INFO**, suitable for production
   *                                environments. Sets the minimum level to log.
   * @param consoleOut              **Optional**, defaults to **false**. Enables
   *                                console output.
   * @param appName                 **Optional**, defaults to **node**. The
   *                                prefix of the log files.
   * @param maxSize                 **Optional**, defaults to **500m**. The max
   *                                size to rotate the log file if it become too
   *                                large before rotation by time.
   * @param datePattern             **Optional**, defaults to **YYYY_MM_DD_HH**.
   *                                This determines the time pattern to rotate
   *                                the log file. For example,
   *                                'YYYY_MM_DD_HH_mm' will rotate it every
   *                                minute. This date is also added to the file
   *                                name.
   * @param maxFiles                **Optional**, defaults to null. This
   *                                determines the max number of files to keep.
   *
   */
  constructor({
    logFilePath = "/logs",
    minLogLevel = ELOGLEVELS.INFO,
    consoleOut = false,
    appName = "node",
    maxSize = "500m",
    datePattern = "YYYY_MM_DD_HH",
    maxFiles
  }: {
    logFilePath?: string;
    minLogLevel?: ELOGLEVELS;
    consoleOut?: boolean;
    appName?: string;
    maxSize?: string;
    datePattern?: string;
    maxFiles?: number;
  }) {

    // This is a hack to access the items of ELOGLEVELS with a
    // string as an index
    const ELOGLEVELSI: { [idx: string]: ELOGLEVELS; } = <any>ELOGLEVELS;

    // Set formats
    const { combine, timestamp, printf, metadata } = winston.format;

    // CSV format
    const winstonCsvFormatDef = printf(
      ({ level, timestamp, message, metadata }) => {
        return `'${timestamp}','${level}','${metadata.moduleRouter}','${metadata.methodRouter}','${message}','${JSON.stringify(metadata.payload)}'`;
      }
    );

    const winstonCsvFormat: any = combine(
      timestamp(),
      winstonCsvFormatDef
    );

    // For console, in case it is asked for
    let winstonConsoleFormatDef: any;
    let winstonConsoleFormat: any;

    if (consoleOut) {

      winstonConsoleFormatDef = printf(
        ({ level, timestamp, message, metadata }) => {
          return `${timestamp} ${lodash.padEnd(level, 5)} > ${metadata.moduleRouter} ${metadata.methodRouter} ${message} ${metadata.consolePayload ? JSON.stringify(metadata.consolePayload) : ""}`;
        }
      );

      winstonConsoleFormat = combine(
        timestamp(),
        winstonConsoleFormatDef
      );

    }

    // Set transports
    const winstonTransports: any[] = [];

    // Errors
    winstonTransports.push(
      new winston.transports.File({
        filename: path.join(logFilePath, "error.csv"),
        level: ELOGLEVELS.ERROR
      })
    );

    // Add console transport, if activated
    if (consoleOut) {

      // Add an additional console log
      winstonTransports.push(
        new winston.transports.Console({
          format: winstonConsoleFormat,
          level: minLogLevel
        })
      );

    }

    // The rotator
    winstonTransports.push(
      new (<any>winston.transports).DailyRotateFile({
        filename: `${appName}_%DATE%.csv`,
        dirname: logFilePath,
        maxFiles: maxFiles,
        datePattern: datePattern,
        maxSize: maxSize,
        level: minLogLevel
      })
    )

    /**
     *
     * Configure Winston here. Additional settings at
     * apiservicesdefaults.ts
     *
     */
    this._log = winston.createLogger({

      format: winstonCsvFormat,
      transports: winstonTransports

    });

  }

  /**
   *
   * A handy method for debug messages.
   *
   * @param __namedParameters
   * Logging options.
   *
   * @param moduleName
   * Module name the error was thrown in.
   *
   * @param methodName
   * Method name the error was thrown in.
   *
   * @param payload
   * **Optional**. An optional payload. Don't be too verbose!!!
   *
   * @param consolePayload
   * **Optional**. An optional payload for the console output. Equals payload if
   * not present.
   *
   * @param message
   * A message describing the error.
   *
   */
  public logDebug({
      moduleName,
      methodName,
      payload = undefined,
      consolePayload = undefined,
      message
    }: {
      moduleName: string;
      methodName: string;
      payload?: any;
      consolePayload?: any;
      message: string;
  }): void {

    // If payload and not consolePayload, make them the same
    if (payload) consolePayload = consolePayload ? consolePayload : payload;

    this._log.debug(message, { metadata: {
      moduleRouter: moduleName,
      methodRouter: methodName,
      message: message,
      payload: payload,
      consolePayload: consolePayload
    }})

  }

  /**
   *
   * A handy method for warn messages.
   *
   * @param __namedParameters
   * Logging options.
   *
   * @param moduleName
   * Module name the error was thrown in.
   *
   * @param methodName
   * Method name the error was thrown in.
   *
   * @param payload
   * **Optional**. An optional payload. Don't be too verbose!!!
   *
   * @param consolePayload
   * **Optional**. An optional payload for the console output. Equals payload if
   * not present.
   *
   * @param message
   * A message describing the error.
   *
   */
  public logWarn({
      moduleName,
      methodName,
      payload = undefined,
      consolePayload = undefined,
      message
    }: {
      moduleName: string;
      methodName: string;
      payload?: any;
      consolePayload?: any;
      message: string;
  }): void {

    // If payload and not consolePayload, make them the same
    if (payload) consolePayload = consolePayload ? consolePayload : payload;

    this._log.warn(message, { metadata: {
      moduleRouter: moduleName,
      methodRouter: methodName,
      message: message,
      payload: payload,
      consolePayload: consolePayload
    }})

  }

  /**
   *
   * A handy method for warn messages.
   *
   * @param __namedParameters
   * Logging options.
   *
   * @param moduleName
   * Module name the error was thrown in.
   *
   * @param methodName
   * Method name the error was thrown in.
   *
   * @param payload
   * **Optional**. An optional payload. Don't be too verbose!!!
   *
   * @param consolePayload
   * **Optional**. An optional payload for the console output. Equals payload if
   * not present.
   *
   * @param message
   * A message describing the error.
   *
   */
  public logInfo({
      moduleName,
      methodName,
      payload = undefined,
      consolePayload = undefined,
      message
    }: {
      moduleName: string;
      methodName: string;
      payload?: any;
      consolePayload?: any;
      message: string;
  }): void {

    // If payload and not consolePayload, make them the same
    if (payload) consolePayload = consolePayload ? consolePayload : payload;

    this._log.info(message, { metadata: {
      moduleRouter: moduleName,
      methodRouter: methodName,
      message: message,
      payload: payload,
      consolePayload: consolePayload
    }})

  }

  /**
   *
   * A handy method for error messages.
   *
   * @param __namedParameters
   * Logging options.
   *
   * @param moduleName
   * Module name the error was thrown in.
   *
   * @param methodName
   * Method name the error was thrown in.
   *
   * @param payload
   * **Optional**. An optional payload. Don't be too verbose!!!
   *
   * @param consolePayload
   * **Optional**. An optional payload for the console output. Equals payload if
   * not present.
   *
   * @param message
   * A message describing the error.
   *
   */
  public logError({
      moduleName,
      methodName,
      payload = undefined,
      consolePayload = undefined,
      message
    }: {
      moduleName: string;
      methodName: string;
      payload?: any;
      consolePayload?: any;
      message: string;
  }): void {

    // If payload and not consolePayload, make them the same
    if (payload) consolePayload = consolePayload ? consolePayload : payload;

    this._log.error(message, { metadata: {
      moduleRouter: moduleName,
      methodRouter: methodName,
      message: message,
      payload: payload,
      consolePayload: consolePayload
    }})

  }

}
