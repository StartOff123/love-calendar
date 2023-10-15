import React from 'react'
import { ICalendar, ICalendarDay } from '../../types/calendar'

import '../../styles/day.scss'

interface IDayProps {
  dayData: ICalendarDay
  month: number
  setCalendar: React.Dispatch<React.SetStateAction<ICalendar[] | null>>
  calendar: ICalendar[] | null
}

const Day = ({ dayData, month, setCalendar, calendar }: IDayProps): React.ReactElement => {
  const [classNameDay, setClassNameDay] = React.useState<string>('')
  const svgRef = React.useRef<SVGSVGElement>(null)

  const handleClickDay = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const pElement = event.currentTarget.children.item(0)

    if (!pElement?.classList.contains('disabled')) {
      handleDay()

      svgRef.current?.classList.add('day__animate-active')

      setTimeout(() => {
        svgRef.current?.classList.remove('day__animate-active')
      }, 400)
    }
  }

  const handleDay = () => {
    if (calendar) {
      const calendarItem: ICalendar = calendar[month - 8]

      calendarItem.days.map(day => {
        if (day.day === dayData.day) {
          day.active = true
        }
      })

      const filterCalendar: ICalendar[] = calendar.filter(monthCal => monthCal.month !== month)
      const newCalendar: ICalendar[] = [
        ...filterCalendar.slice(0, month - 8),
        calendarItem,
        ...filterCalendar.slice(month - 8)
      ]

      setCalendar(newCalendar)
      generateClassName()
    }
  }

  const generateClassName = () => {
    if (month < new Date().getMonth()) {
      if (dayData.active) setClassNameDay(state => `${state} active disabled`)
    }
    else if (dayData.day <= new Date().getDate() && month === new Date().getMonth()) {
      if (dayData.active) setClassNameDay(state => `${state} active disabled`)
      if (dayData.day === new Date().getDate()) setClassNameDay(state => `${state} current`)
    } else {
      setClassNameDay(state => `${state} disabled`)
    }
  }

  React.useEffect(() => {
    generateClassName()
  }, [])

  return (
    <div className='day' onClick={handleClickDay}>
      <p
        className={classNameDay}
      >
        {dayData.day}
        <span></span>
      </p>
      {
        dayData.active &&
        <svg className='day__img day__activeImg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z" />
        </svg>
      }
      <svg ref={svgRef} className='day__img day__animate' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 9.229c.234-1.12 1.547-6.229 5.382-6.229 2.22 0 4.618 1.551 4.618 5.003 0 3.907-3.627 8.47-10 12.629-6.373-4.159-10-8.722-10-12.629 0-3.484 2.369-5.005 4.577-5.005 3.923 0 5.145 5.126 5.423 6.231zm-12-1.226c0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-7.962-9.648-9.028-12-3.737-2.338-5.262-12-4.27-12 3.737z" />
      </svg>
    </div>
  )
}

export default Day