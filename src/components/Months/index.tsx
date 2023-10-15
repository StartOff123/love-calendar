import React from 'react'
import { UserContext } from '../../App'
import { ICalendar } from '../../types/calendar'
import { debounce } from '../../utils/debounse'
import Day from '../Day'
import api from '../../api'

import '../../styles/months.scss'

const Months = (): React.ReactElement => {
    const user = React.useContext(UserContext)
    const [calendar, setCalendar] = React.useState<ICalendar[] | null>(null)

    const debounses = debounce(() => {
        api.patch('/user/update-days', { days: JSON.stringify(calendar) })
    }, 100)

    React.useEffect(() => {
        if (user) setCalendar(JSON.parse(user?.days))
    }, [user])

    React.useEffect(() => {
        if (calendar) debounses()
    }, [calendar])

    return (
        <div className='months'>
            {
                calendar && calendar.map((item, i) =>
                    <div className='months__month' key={i}>
                        <h1>{item.title}</h1>
                        <div className='months__month--days'>
                            {item.days.map((day, i) =>
                                <Day key={i} dayData={day} month={item.month} setCalendar={setCalendar} calendar={calendar} />
                            )}
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Months