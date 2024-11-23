import util from 'util'
import { createLogger, format, transports } from 'winston'
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports'
import { red, blue, yellow, green, magenta } from 'colorette'
import { config } from '../config/config'

import path from 'path'
import * as sourceMapSupport from 'source-map-support'
import { EAplicationEnvironment } from '../constant/application'
// Linking Trace Support

sourceMapSupport.install()
const colorizeLevel = (level: string) => {
    switch (level) {
        case 'ERROR':
            return red(level)
        case 'INFO':
            return blue(level)
        case 'WARN':
            return yellow(level)
        default:
            return level
    }
}
const consoleLogFormat = format.printf((info) => {
    const { level, message, timestamp, meta = {} as Record<string, unknown> } = info
    const customLevel = colorizeLevel(level.toUpperCase())

    const customTimestamp = green(timestamp as string)

    const customMessage = message
    const customMeta = util.inspect(meta, {
        showHidden: false,
        depth: null,
        colors: true
    })
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const customLog = `${customLevel} [${customTimestamp}] ${customMessage}\n${magenta('META')} ${customMeta}\n`
    return customLog
})
const consoleTransport = (): Array<ConsoleTransportInstance> => {
    if (config.NODE_ENV === EAplicationEnvironment.DEVELOPMENT) {
        return [
            new transports.Console({
                level: 'info',
                format: format.combine(format.timestamp(), consoleLogFormat),
                silent: (config.NODE_ENV as string) === (EAplicationEnvironment.TEST as string)
            })
        ]
    }
    return []
}
const fileLogFormat = format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info
    const logMeta: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(meta as Record<string, unknown>)) {
        if (value instanceof Error) {
            logMeta[key] = {
                name: value.name,
                message: value.message,
                trace: value.stack || ''
            }
        } else {
            logMeta[key] = value
        }
    }
    const logData = {
        level: level.toUpperCase(),

        message,

        timestamp,
        meta: logMeta
    }
    return JSON.stringify(logData, null, 4)
})
const FileTransport = (): Array<FileTransportInstance> => {
    return [
        new transports.File({
            filename: path.join(__dirname, '../', '../', 'logs', `${config.NODE_ENV}.log`),
            level: 'info',
            format: format.combine(format.timestamp(), fileLogFormat),
            silent: config.NODE_ENV === EAplicationEnvironment.TEST
        })
    ]
}
export default createLogger({
    defaultMeta: {
        meta: {}
    },
    transports: [...FileTransport(), ...consoleTransport()]
})
