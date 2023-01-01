import { ParseError } from './errors'

export type ParseResponse = {
    records: GlucoseReading[]
    error: ParseError | null
}

export type GlucoseReading = {
    Timestamp: Date
    Value: number
}
