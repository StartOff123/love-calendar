export interface ICalendar {
    title: string
    month: number
    days: ICalendarDay[]
}
 
export interface ICalendarDay {
    day: number
    active: boolean
}