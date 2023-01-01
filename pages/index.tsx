import Head from 'next/head'
import React, { useState } from 'react'
import { DayGraph } from '../components/dayGraph'
import { RangeDoughnuts } from '../components/rangeDoughnuts'
import { RangeByDays } from '../components/rangeByDays'
import { Headline } from '../components/headline'
import { mapGlucoseRecordsToDailyRecords, DailyRecord } from '../datahandling/dailyRecords'
import { parseLibreViewData } from '../parsing/libreview'

export default function Home() {
    const [cgmProvider, setCGMProvider] = useState<'dexcom' | 'libreview' | 'nightscout' | null>(null)
    const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([])
    const [CGMDataLoading, setCGMDataLoading] = useState<boolean | string>(false)
    const [CGMDataError, setCGMDataError] = useState<string | null>(null)

    const reset = () => {
        setCGMProvider(null)
        setCGMDataError(null)
        setDailyRecords([])
        setCGMDataLoading(false)
    }

    const parseData = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setCGMDataLoading(true)

        if (!event.target.files) {
            return
        }

        const file = event.target.files[0]
        const { records, error } = await parseLibreViewData(file, 2022)

        if (error) {
            setCGMDataError(error.message)
            setCGMDataLoading(false)
            return
        }

        const mappedDailyRecords = mapGlucoseRecordsToDailyRecords(records)

        setDailyRecords(mappedDailyRecords)
        setCGMDataLoading(false)
    }

    return (
        <>
            <Head>
                <title>Diabetes Wrapped</title>
                <meta
                    name="description"
                    content="A Spotify Wrapped style view of your year with diabetes, based on your CGM data"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Headline size={1} text="t1d.tools/wrapped" />
            <div className="flex flex-col items-center justify-center self-center">
                {dailyRecords.length === 0 && (
                    <div className="z-10 w-full rounded-xl bg-white p-10 sm:max-w-lg">
                        <div className="text-center">
                            <h2 className="mt-5 text-3xl font-bold text-gray-900">Analyze your CGM data!</h2>
                            <p className="mt-2 text-sm text-gray-400">
                                t1d.tools wrapped runs entirely in your browser, sending no data to any servers. Find
                                the project on{' '}
                                <a
                                    href="https://github.com/t1dtools/wrapped"
                                    className="text-blue-500 hover:text-blue-700"
                                    target="_blank">
                                    GitHub
                                </a>
                                .
                            </p>
                        </div>
                        <form className="mt-8 space-y-3">
                            <div className="grid grid-cols-1 space-y-2">
                                <label htmlFor="cgmproviders" className="text-sm font-bold tracking-wide text-gray-500">
                                    Select CGM Provider
                                </label>
                                <select
                                    onChange={e => setCGMProvider(e.target.value as any)}
                                    id="cgmproviders"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                                    <option selected={true}>Choose a CGM data provider</option>
                                    <option disabled={false} value="dexcom">
                                        Dexcom Clarity
                                    </option>
                                    <option value="libreview">Libreview (Freestyle Libre)</option>
                                    <option disabled={false} value="nightscout">
                                        Nightscout
                                    </option>
                                </select>
                            </div>
                            {(cgmProvider === 'libreview' || cgmProvider === 'dexcom') && (
                                <div className="grid grid-cols-1 space-y-2">
                                    <label className="text-sm font-bold tracking-wide text-gray-500">
                                        Select your CSV file
                                    </label>
                                    <div className="flex w-full items-center justify-center">
                                        <label className="h-30 group flex w-full cursor-pointer flex-col rounded-lg border-4 border-dashed p-10 text-center">
                                            <div className="flex h-full w-full flex-col items-center justify-center text-center  ">
                                                <p className="pointer-none text-gray-500 ">
                                                    <span className="text-sm">Drag and drop</span> your CGM export here{' '}
                                                    <br /> or click to select a file from your computer.
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="text/csv"
                                                onChange={event => parseData(event)}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            )}
                            {cgmProvider === 'nightscout' && (
                                <div className="grid grid-cols-1 space-y-2">Coming soon</div>
                            )}
                        </form>
                    </div>
                )}
                {dailyRecords.length > 0 && !CGMDataLoading && (
                    <div className="pointer-cursor absolute top-5 right-5 rounded-xl bg-gray-800 p-4">
                        <a onClick={reset} className="pointer-cursor text-sm">
                            Start over?
                        </a>
                    </div>
                )}

                {CGMDataLoading && <div>Loading CGM data...</div>}
                {!CGMDataLoading && CGMDataError && <div>There was an error parsing your CGM data: {CGMDataError}</div>}
                {!CGMDataLoading && dailyRecords.length > 0 && <>{<DayGraph dailyRecords={dailyRecords} />}</>}
                {!CGMDataLoading && dailyRecords.length > 0 && (
                    <>
                        {
                            <div className="w-fit">
                                <RangeByDays dailyRecords={dailyRecords} />
                            </div>
                        }
                    </>
                )}
                {!CGMDataLoading && dailyRecords.length > 0 && <>{<RangeDoughnuts dailyRecords={dailyRecords} />}</>}
            </div>
        </>
    )
}
