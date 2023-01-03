type DoughnutProps = {
    count: number
    headline: string
    total: number
}

export const Doughnut = (props: DoughnutProps) => {
    const percentage = Math.round((props.count / props.total) * 100)
    const doughnutFillRate = 440 - 440 * (props.count / props.total)

    return (
        <>
            <div>
                <div className="mb-2 text-center text-lg">{props.headline}</div>
                <div className="doughnut-graph flex flex-col items-center justify-center">
                    <div className="absolute mb-2 w-full text-center text-4xl">{props.count}</div>
                    <svg width={160} height={160} xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <title>{props.headline}</title>
                            <circle
                                className="circle"
                                r="69.85699"
                                cy={81}
                                cx={81}
                                strokeWidth={15}
                                strokeDashoffset={doughnutFillRate}
                                strokeLinecap="round"
                                stroke="#00ff66"
                                fill="none"
                            />
                        </g>
                    </svg>
                </div>
                <div className="text-md pt-[165px] text-center">{percentage}%</div>
            </div>
            <style jsx>
                {`
                    .doughnut-graph {
                        position: relative;
                        float: left;
                    }

                    .doughnut-graph .digit-inside-doughnut {
                        text-align: center;
                        position: absolute;
                        line-height: 125px;
                        width: 100%;
                    }

                    .doughnut-graph svg {
                        -webkit-transform: rotate(-90deg);
                        transform: rotate(-90deg);
                    }

                    .doughnut-graph .circle {
                        stroke-dasharray: 440; /* this value is the pixel circumference of the circle */
                    }
                `}
            </style>
        </>
    )
}
