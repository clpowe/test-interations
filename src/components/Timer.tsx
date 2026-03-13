import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface TimeLeft {
	days: number
	hours: number
	minutes: number
	seconds: number
}

const CountdownTimer = () => {
	const [timeLeft, setTimeLeft] = useState<TimeLeft>({
		days: 0,
		hours: 7,
		minutes: 48,
		seconds: 5
	})

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				let { days, hours, minutes, seconds } = prev

				if (seconds > 0) {
					seconds--
				} else if (minutes > 0) {
					minutes--
					seconds = 59
				} else if (hours > 0) {
					hours--
					minutes = 59
					seconds = 59
				} else if (days > 0) {
					days--
					hours = 23
					minutes = 59
					seconds = 59
				}

				return { days, hours, minutes, seconds }
			})
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	const TimeUnit = ({
		value,
		label,
		isDark = false
	}: {
		value: number
		label: string
		isDark?: boolean
	}) => (
		<div className='flex flex-col items-center'>
			<div
				className={`text-4xl md:text-5xl font-bold ${
					isDark ? 'text-white' : 'text-gray-900'
				}`}
			>
				{value}
			</div>
			<div
				className={`text-xs md:text-sm tracking-widest ${
					isDark ? 'text-gray-400' : 'text-gray-500'
				}`}
			>
				{label}
			</div>
		</div>
	)

	return (
		<Card className=' bg-transparent p-6 md:p-8'>
			<div className='flex flex-col md:flex-row items-center justify-between gap-6'>
				<div className='flex items-center gap-4 md:gap-8 bg-gray-900/50 rounded-lg px-6 py-4 border border-gray-800'>
					<TimeUnit value={timeLeft.days} label='DAYS' isDark />
					<div className='text-gray-600'>|</div>
					<TimeUnit value={timeLeft.hours} label='HRS' isDark />
					<div className='text-gray-600'>|</div>
					<TimeUnit value={timeLeft.minutes} label='MIN' isDark />
					<div className='text-gray-600'>|</div>
					<TimeUnit value={timeLeft.seconds} label='SEC' isDark />
				</div>
				<Button className='bg-white text-black hover:bg-gray-100 text-lg font-semibold px-12 py-6 rounded-lg'>
					SHOP THE SALE
				</Button>
			</div>
		</Card>
	)
}

export default CountdownTimer
