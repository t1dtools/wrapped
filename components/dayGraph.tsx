import React from 'react'
import { format } from 'date-fns'
import { DailyRecord } from '../datahandling/dailyRecords'
import { Headline } from './headline'

type Day = {
    date: Date
    percentage: number
    hasReading: boolean
}

type Props = {
    dailyRecords: DailyRecord[]
}

export const DayGraph = (props: Props) => {
    const year = props.dailyRecords[0].date.getFullYear()
    const preYearDays: Day[] = []
    const firstDayOfYear = new Date(year, 0, 1)

    for (let i = 1; i < firstDayOfYear.getDay(); i++) {
        preYearDays.push({
            date: new Date(year - 1, 11, 31 - i),
            percentage: 0,
            hasReading: false,
        })
    }

    const isLeapYear = (year: number) => {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
    }

    const daysInYear = (year: number) => {
        return isLeapYear(year) ? 366 : 365
    }

    const days = []
    for (let i = 0; i < daysInYear(year); i++) {
        const date = new Date(year, 0, i + 1)
        const entry = props.dailyRecords.find(day => {
            return day.date.toDateString() === date.toDateString()
        })

        const day = {
            date: date,
            percentage: entry ? entry.rangePercentage : 0,
            hasReading: entry ? true : false,
        }
        days.push(day)
    }

    days.sort((a, b) => {
        return a.date.getTime() - b.date.getTime()
    })

    return (
        <>
            <Headline
                size={2}
                text="Every Day this Year"
                subheadline="This graph shows the entire year, with each day color coded by the the time in range for that day."
            />
            <div style={{ textAlign: 'center' }}>
                <div className="graph">
                    <ul className="months pl-3 text-left">
                        <li>Jan</li>
                        <li>Feb</li>
                        <li>Mar</li>
                        <li>Apr</li>
                        <li>May</li>
                        <li>Jun</li>
                        <li>Jul</li>
                        <li>Aug</li>
                        <li>Sep</li>
                        <li>Oct</li>
                        <li>Nov</li>
                        <li>Dec</li>
                    </ul>
                    <ul className="days pl-[40px]">
                        <li>Mon</li>
                        <li>Tue</li>
                        <li>Wed</li>
                        <li>Thu</li>
                        <li>Fri</li>
                        <li>Sat</li>
                        <li>Sun</li>
                    </ul>
                    <ul className="points mt-2 mb-2 pl-[40px]">
                        {preYearDays.map(day => (
                            <li key={day.date.toString()} className="not-day-filler" />
                        ))}

                        {days.map(day => {
                            if (day.hasReading) {
                                const dateString = format(day.date, 'yyyy-MM-dd')
                                return (
                                    <li data-percentage={Math.round(day.percentage)} key={day.date.toDateString()}>
                                        <span className="tooltiptext">
                                            <>
                                                {dateString}: {Math.round(day.percentage)}%
                                            </>
                                        </span>
                                    </li>
                                )
                            } else {
                                return <li className="no-data" key={day.date.toString()} data-percentage={0} />
                            }
                        })}
                    </ul>
                </div>
            </div>
            <style jsx>{`
                li {
                    list-style: none;
                }

                .months {
                    grid-area: months;
                    margin-left: calc(var(--week-width) * 1.15);
                    margin-bottom: -12px;
                }

                .days {
                    grid-area: days;
                    margin-right: -40px;
                }

                .points {
                    grid-area: squares;
                }

                .graph {
                    display: inline-grid;
                    grid-template-areas: 'empty months' 'days squares';
                    grid-template-columns: auto 1fr;
                    grid-gap: 10px;
                    margin: 0 auto;
                    width: 100%;
                }

                .months {
                    display: grid;
                    grid-template-columns:
                        calc(var(--week-width) * 4) /* Jan */
                        calc(var(--week-width) * 4) /* Feb */
                        calc(var(--week-width) * 4) /* Mar */
                        calc(var(--week-width) * 5) /* Apr */
                        calc(var(--week-width) * 4) /* May */
                        calc(var(--week-width) * 4) /* Jun */
                        calc(var(--week-width) * 5) /* Jul */
                        calc(var(--week-width) * 4) /* Aug */
                        calc(var(--week-width) * 4) /* Sep */
                        calc(var(--week-width) * 5) /* Oct */
                        calc(var(--week-width) * 4) /* Nov */
                        calc(var(--week-width) * 5) /* Dec */;
                }

                .days,
                .points {
                    display: grid;
                    grid-gap: var(--square-gap);
                    grid-template-rows: repeat(7, var(--square-size));
                }

                .points {
                    grid-auto-flow: column;
                    grid-auto-columns: var(--square-size);
                }

                .points li {
                    border-radius: calc(var(--square-size));
                    list-style: none;
                }

                /* Other styling */

                .graph {
                    color: rgba(255, 255, 255, 0.3);
                }

                .days li:nth-child(even) {
                    visibility: hidden;
                }

                .points li {
                    background-color: #ebedf0;
                    color: rgba(0, 0, 0, 1);
                }

                .points li.not-day-filler {
                    background-color: transparent;
                }

                /* Tooltip styles */

                /* Tooltip container */

                .points li {
                    position: relative;
                    display: inline-block;
                }

                /* Tooltip text */

                .points li .tooltiptext {
                    visibility: hidden;
                    width: 150px;
                    background-color: black;
                    color: #fff;
                    text-align: center;
                    padding: 5px 0;
                    border-radius: 6px;
                    position: absolute;
                    z-index: 1;
                    top: -5px;
                    left: 105%;
                }

                .points li .tooltiptext::after {
                    content: ' ';
                    position: absolute;
                    top: 50%;
                    right: 100%;
                    margin-top: -5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: transparent black transparent transparent;
                }

                /* Show the tooltip text when you mouse over the tooltip container */

                .points li:hover .tooltiptext {
                    visibility: visible;
                }

                /* Colorway */
                .points li[data-percentage='0'] {
                    background-color: rgba(21, 21, 21, 1);
                }

                .points li[data-percentage='1'] {
                    background-color: hsl(27, 45%, 30%);
                }

                .points li[data-percentage='2'] {
                    background-color: hsl(27, 45%, 30%);
                }

                .points li[data-percentage='3'] {
                    background-color: hsl(27, 45%, 30%);
                }

                .points li[data-percentage='4'] {
                    background-color: hsl(27, 45%, 30%);
                }

                .points li[data-percentage='5'] {
                    background-color: hsl(27, 45%, 30%);
                }

                .points li[data-percentage='6'] {
                    background-color: hsl(27, 45%, 30%);
                }

                .points li[data-percentage='7'] {
                    background-color: hsl(27, 45%, 30%);
                }

                .points li[data-percentage='8'] {
                    background-color: hsl(27, 45%, 30%);
                }

                .points li[data-percentage='9'] {
                    background-color: hsl(27, 45%, 30%);
                }

                .points li[data-percentage='10'] {
                    background-color: hsl(0, 100%, 39%);
                }

                .points li[data-percentage='11'] {
                    background-color: hsl(0, 100%, 39%);
                }

                .points li[data-percentage='12'] {
                    background-color: hsl(0, 100%, 39%);
                }

                .points li[data-percentage='13'] {
                    background-color: hsl(0, 100%, 39%);
                }

                .points li[data-percentage='14'] {
                    background-color: hsl(0, 100%, 39%);
                }

                .points li[data-percentage='15'] {
                    background-color: hsl(0, 100%, 39%);
                }

                .points li[data-percentage='16'] {
                    background-color: hsl(0, 100%, 39%);
                }

                .points li[data-percentage='17'] {
                    background-color: hsl(0, 100%, 39%);
                }

                .points li[data-percentage='18'] {
                    background-color: hsl(0, 100%, 39%);
                }

                .points li[data-percentage='19'] {
                    background-color: hsl(0, 100%, 39%);
                }

                .points li[data-percentage='20'] {
                    background-color: hsl(16, 100%, 36%);
                }

                .points li[data-percentage='21'] {
                    background-color: hsl(16, 100%, 36%);
                }

                .points li[data-percentage='22'] {
                    background-color: hsl(16, 100%, 36%);
                }

                .points li[data-percentage='23'] {
                    background-color: hsl(16, 100%, 36%);
                }

                .points li[data-percentage='24'] {
                    background-color: hsl(16, 100%, 36%);
                }

                .points li[data-percentage='25'] {
                    background-color: hsl(16, 100%, 36%);
                }

                .points li[data-percentage='26'] {
                    background-color: hsl(16, 100%, 36%);
                }

                .points li[data-percentage='27'] {
                    background-color: hsl(16, 100%, 36%);
                }

                .points li[data-percentage='28'] {
                    background-color: hsl(16, 100%, 36%);
                }

                .points li[data-percentage='29'] {
                    background-color: hsl(16, 100%, 36%);
                }

                .points li[data-percentage='30'] {
                    background-color: hsl(27, 100%, 36%);
                }

                .points li[data-percentage='31'] {
                    background-color: hsl(27, 100%, 36%);
                }

                .points li[data-percentage='32'] {
                    background-color: hsl(27, 100%, 36%);
                }

                .points li[data-percentage='33'] {
                    background-color: hsl(27, 100%, 36%);
                }

                .points li[data-percentage='34'] {
                    background-color: hsl(27, 100%, 36%);
                }

                .points li[data-percentage='35'] {
                    background-color: hsl(27, 100%, 36%);
                }

                .points li[data-percentage='36'] {
                    background-color: hsl(27, 100%, 36%);
                }

                .points li[data-percentage='37'] {
                    background-color: hsl(27, 100%, 36%);
                }

                .points li[data-percentage='38'] {
                    background-color: hsl(27, 100%, 36%);
                }

                .points li[data-percentage='39'] {
                    background-color: hsl(27, 100%, 36%);
                }

                .points li[data-percentage='40'] {
                    background-color: hsl(53, 100%, 36%);
                }

                .points li[data-percentage='41'] {
                    background-color: hsl(53, 100%, 36%);
                }

                .points li[data-percentage='42'] {
                    background-color: hsl(53, 100%, 36%);
                }

                .points li[data-percentage='43'] {
                    background-color: hsl(53, 100%, 36%);
                }

                .points li[data-percentage='44'] {
                    background-color: hsl(53, 100%, 36%);
                }

                .points li[data-percentage='45'] {
                    background-color: hsl(53, 100%, 36%);
                }

                .points li[data-percentage='46'] {
                    background-color: hsl(53, 100%, 36%);
                }

                .points li[data-percentage='47'] {
                    background-color: hsl(53, 100%, 36%);
                }

                .points li[data-percentage='48'] {
                    background-color: hsl(53, 100%, 36%);
                }

                .points li[data-percentage='49'] {
                    background-color: hsl(53, 100%, 36%);
                }

                .points li[data-percentage='50'] {
                    background-color: hsl(61, 100%, 36%);
                }

                .points li[data-percentage='51'] {
                    background-color: hsl(61, 100%, 36%);
                }

                .points li[data-percentage='52'] {
                    background-color: hsl(61, 100%, 36%);
                }

                .points li[data-percentage='53'] {
                    background-color: hsl(61, 100%, 36%);
                }

                .points li[data-percentage='54'] {
                    background-color: hsl(61, 100%, 36%);
                }

                .points li[data-percentage='55'] {
                    background-color: hsl(61, 100%, 36%);
                }

                .points li[data-percentage='56'] {
                    background-color: hsl(61, 100%, 36%);
                }

                .points li[data-percentage='57'] {
                    background-color: hsl(61, 100%, 36%);
                }

                .points li[data-percentage='58'] {
                    background-color: hsl(61, 100%, 36%);
                }

                .points li[data-percentage='59'] {
                    background-color: hsl(61, 100%, 36%);
                }

                .points li[data-percentage='60'] {
                    background-color: hsl(67, 100%, 44%);
                }

                .points li[data-percentage='61'] {
                    background-color: hsl(67, 100%, 44%);
                }

                .points li[data-percentage='62'] {
                    background-color: hsl(67, 100%, 44%);
                }

                .points li[data-percentage='63'] {
                    background-color: hsl(67, 100%, 44%);
                }

                .points li[data-percentage='64'] {
                    background-color: hsl(67, 100%, 44%);
                }

                .points li[data-percentage='65'] {
                    background-color: hsl(67, 100%, 44%);
                }

                .points li[data-percentage='66'] {
                    background-color: hsl(67, 100%, 44%);
                }

                .points li[data-percentage='67'] {
                    background-color: hsl(67, 100%, 44%);
                }

                .points li[data-percentage='68'] {
                    background-color: hsl(67, 100%, 44%);
                }

                .points li[data-percentage='69'] {
                    background-color: hsl(67, 100%, 44%);
                }

                .points li[data-percentage='70'] {
                    background-color: hsl(144, 100%, 31%);
                }

                .points li[data-percentage='71'] {
                    background-color: hsl(144, 100%, 31%);
                }

                .points li[data-percentage='72'] {
                    background-color: hsl(144, 100%, 31%);
                }

                .points li[data-percentage='73'] {
                    background-color: hsl(144, 100%, 31%);
                }

                .points li[data-percentage='74'] {
                    background-color: hsl(144, 100%, 31%);
                }

                .points li[data-percentage='75'] {
                    background-color: hsl(144, 100%, 31%);
                }

                .points li[data-percentage='76'] {
                    background-color: hsl(144, 100%, 31%);
                }

                .points li[data-percentage='77'] {
                    background-color: hsl(144, 100%, 31%);
                }

                .points li[data-percentage='78'] {
                    background-color: hsl(144, 100%, 31%);
                }

                .points li[data-percentage='79'] {
                    background-color: hsl(144, 100%, 31%);
                }

                .points li[data-percentage='80'] {
                    background-color: hsl(144, 100%, 39%);
                }

                .points li[data-percentage='81'] {
                    background-color: hsl(144, 100%, 39%);
                }

                .points li[data-percentage='82'] {
                    background-color: hsl(144, 100%, 39%);
                }

                .points li[data-percentage='83'] {
                    background-color: hsl(144, 100%, 39%);
                }

                .points li[data-percentage='84'] {
                    background-color: hsl(144, 100%, 39%);
                }

                .points li[data-percentage='85'] {
                    background-color: hsl(144, 100%, 39%);
                }

                .points li[data-percentage='86'] {
                    background-color: hsl(144, 100%, 39%);
                }

                .points li[data-percentage='87'] {
                    background-color: hsl(144, 100%, 39%);
                }

                .points li[data-percentage='88'] {
                    background-color: hsl(144, 100%, 39%);
                }

                .points li[data-percentage='89'] {
                    background-color: hsl(144, 100%, 39%);
                }

                .points li[data-percentage='90'] {
                    background-color: hsl(144, 100%, 50%);
                }

                .points li[data-percentage='91'] {
                    background-color: hsl(144, 100%, 50%);
                }

                .points li[data-percentage='92'] {
                    background-color: hsl(144, 100%, 50%);
                }

                .points li[data-percentage='93'] {
                    background-color: hsl(144, 100%, 50%);
                }

                .points li[data-percentage='94'] {
                    background-color: hsl(144, 100%, 50%);
                }

                .points li[data-percentage='95'] {
                    background-color: hsl(144, 100%, 50%);
                }

                .points li[data-percentage='96'] {
                    background-color: hsl(144, 100%, 50%);
                }

                .points li[data-percentage='97'] {
                    background-color: hsl(144, 100%, 50%);
                }

                .points li[data-percentage='98'] {
                    background-color: hsl(144, 100%, 50%);
                }

                .points li[data-percentage='99'] {
                    background-color: hsl(144, 100%, 50%);
                }

                .points li[data-percentage='100'] {
                    background-color: transparent;
                    font-size: 18px;
                    line-height: 22px;
                    padding-left:1px;
                }

                .points li[data-percentage='100']::before {
                    content: '🥳';
                }

                .points li[data-percentage='100'] .tooltiptext {
                    font-size: 16px;
                }
            `}</style>
        </>
    )
}
