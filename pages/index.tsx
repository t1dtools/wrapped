import Head from 'next/head'
import React, { useState } from 'react'
import { DayGraph } from '../components/dayGraph'
import { RangeDoughnuts } from '../components/rangeDoughnuts'
import { RangeByDays } from '../components/rangeByDays'
import { Headline } from '../components/headline'
import { mapGlucoseRecordsToDailyRecords, DailyRecord } from '../datahandling/dailyRecords'
import { parseLibreViewData } from '../parsing/libreview'
import { parseDexcomClarityData } from '../parsing/dexcomclarity'
import classnames from 'classnames'
import { ParseResponse } from '../parsing/glucose'

export default function Home() {
    const [cgmProvider, setCGMProvider] = useState<'dexcom' | 'libreview' | 'nightscout' | undefined>(undefined)
    const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([])
    const [CGMDataLoading, setCGMDataLoading] = useState<boolean | string>(false)
    const [CGMDataError, setCGMDataError] = useState<string | null>(null)

    const [dragActive, setDragActive] = useState<boolean>(false)

    const reset = () => {
        setCGMProvider(undefined)
        setCGMDataError(null)
        setDailyRecords([])
        setCGMDataLoading(false)
    }

    const handleDroppedFile = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()

        event.dataTransfer.files &&
            parseData({ target: { files: event.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>)
    }

    const parseData = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setCGMDataLoading(true)
        setDragActive(false)

        if (!event.target.files) {
            return
        }

        const file = event.target.files[0]

        let response: ParseResponse
        switch (cgmProvider) {
            case 'libreview':
                response = await parseLibreViewData(file, 2022)
                break
            case 'dexcom':
                response = await parseDexcomClarityData(file, 2022)
                break
            default:
                response = {
                    records: [],
                    error: { message: 'No cgm provider selected.' },
                }
        }

        if (response.error) {
            setCGMDataError(response.error.message)
            setCGMDataLoading(false)
            return
        }

        const records = response.records

        const mappedDailyRecords = mapGlucoseRecordsToDailyRecords(records)

        setDailyRecords(mappedDailyRecords)
        setCGMDataLoading(false)
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setDragActive(true)
    }

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setDragActive(false)
    }

    const openFileDialog = () => {
        const input = document.getElementById('file-selector')
        input && input.click()
    }

    const showDemo = () => {
        const demoData: DailyRecord[] = []
        for (let i = 1; i < 366; i++) {
            if (i % 100 === 0) {
                console.log(new Date(2022, 0, i))
            }
            demoData.push({
                date: new Date(2022, 0, i),
                rangePercentage: Math.round(Math.random() * 100),
            })
        }

        setDailyRecords(demoData)
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
                    <div className="z-10 w-full rounded-xl bg-gray-800 p-10 sm:max-w-lg">
                        <div className="text-center">
                            <h2 className="mt-5 text-3xl font-bold text-gray-200">Visualize your CGM data!</h2>
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
                            <p className="mt-2 text-sm text-gray-400">
                                Curious what this is?{' '}
                                <button onClick={e => showDemo()} className="text-blue-500 hover:text-blue-700">
                                    Have a look at this demo
                                </button>
                                .
                            </p>
                        </div>
                        {!CGMDataLoading && (
                            <form className="mt-8 space-y-3">
                                <div className="grid grid-cols-1 space-y-2">
                                    <label
                                        htmlFor="cgmproviders"
                                        className="text-sm font-bold tracking-wide text-gray-500">
                                        Select CGM Provider
                                    </label>
                                    <select
                                        value={cgmProvider}
                                        onChange={e => setCGMProvider(e.target.value as any)}
                                        id="cgmproviders"
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                                        <option value="choose">Choose a CGM data provider</option>
                                        <option value="dexcom">Dexcom Clarity</option>
                                        <option value="libreview">Libreview (Freestyle Libre)</option>
                                        <option disabled={true} value="nightscout">
                                            Nightscout (Coming soon)
                                        </option>
                                    </select>
                                </div>
                                {(cgmProvider === 'libreview' || cgmProvider === 'dexcom') && (
                                    <div className="grid grid-cols-1 space-y-2">
                                        <label className="text-sm font-bold tracking-wide text-gray-500">
                                            Select your CSV file
                                        </label>
                                        <div className="flex w-full items-center justify-center">
                                            <div
                                                className={classnames(
                                                    dragActive ? 'border-green-600' : 'border-gray-500',
                                                    'group flex h-60 w-full cursor-pointer flex-col rounded-lg border-4 border-dashed p-10 text-center'
                                                )}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onClick={openFileDialog}
                                                onDrop={handleDroppedFile}>
                                                <div className="flex h-full w-full flex-col items-center justify-center text-center">
                                                    {dragActive && (
                                                        <p className="pointer-none text-gray-500 ">Drop it!</p>
                                                    )}
                                                    {!dragActive && (
                                                        <p className="pointer-none text-gray-500 ">
                                                            <span className="text-sm">
                                                                Drag and drop your CGM export here <br />
                                                                or{' '}
                                                                <span className="text-blue-500 hover:text-blue-700">
                                                                    click to select
                                                                </span>{' '}
                                                                a file from your computer.
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    id="file-selector"
                                                    accept="text/csv"
                                                    onChange={event => parseData(event)}
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {cgmProvider === 'nightscout' && (
                                    <div className="grid grid-cols-1 space-y-2">Coming soon</div>
                                )}
                            </form>
                        )}

                        {CGMDataLoading && (
                            <div className="pt-8 text-center">
                                Generating your wrapped report...
                                <svg
                                    className="m-auto mt-2"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <style
                                        dangerouslySetInnerHTML={{
                                            __html: '.spinner_P7sC{transform-origin:center;animation:spinner_svv2 .75s infinite linear}@keyframes spinner_svv2{100%{transform:rotate(360deg)}}',
                                        }}
                                    />
                                    <path
                                        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                                        fill="#fff"
                                        className="spinner_P7sC"
                                    />
                                </svg>
                            </div>
                        )}
                        {!CGMDataLoading && CGMDataError && (
                            <div className="pt-8 text-center text-red-500">
                                There was an error parsing your CGM data: {CGMDataError}
                            </div>
                        )}
                    </div>
                )}
                {dailyRecords.length > 0 && !CGMDataLoading && (
                    <div className="pointer-cursor absolute top-5 right-5 rounded-md bg-gray-800 p-2 hover:text-gray-400">
                        <a href="#" onClick={reset} className="pointer-cursor text-sm">
                            Start over?
                        </a>
                    </div>
                )}

                {!CGMDataLoading && dailyRecords.length > 0 && (
                    <>
                        {
                            <div className="mb-8 w-[1600px] rounded-xl bg-gray-800 p-10 pt-0">
                                <DayGraph dailyRecords={dailyRecords} />
                            </div>
                        }
                    </>
                )}
                {!CGMDataLoading && dailyRecords.length > 0 && (
                    <>
                        {
                            <div className="mb-8 w-[1600px] rounded-xl bg-gray-800 p-10 pt-0">
                                <RangeByDays dailyRecords={dailyRecords} />
                            </div>
                        }
                    </>
                )}
                {!CGMDataLoading && dailyRecords.length > 0 && (
                    <>
                        {
                            <div className="w-[1600px] rounded-xl bg-gray-800 p-10 pt-0">
                                <RangeDoughnuts dailyRecords={dailyRecords} />
                            </div>
                        }
                    </>
                )}
            </div>
            <div className="mt-8 mb-8 text-center text-sm text-gray-600">
                t1d.tools is a collection of Type 1 Diabetes related tools. They're all open source and can be found on{' '}
                <a href="https://github.com/t1dtools" className="underline hover:no-underline">
                    GitHub
                </a>
                .
            </div>
        </>
    )
}
