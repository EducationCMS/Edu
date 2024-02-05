import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
// import localizedFormat from "dayjs/plugin/localizedFormat"

dayjs.extend(customParseFormat)
// dayjs.extend(localizedFormat)

const onlyDateFormatter = (date: Date) => {
  if(!date) return '-/-/-'

  return dayjs(date).format('DD/MM/YYYY')
}

const stringToDate = (date: string) => {
  const newDate = dayjs(date, 'DD.MM.YYYY')
  return newDate.isValid() ? newDate.toDate() : undefined
}

const stringToTime = (time: string) => {
  const [hours, minutes, seconds] = time.split(":");
  const currentDate = dayjs().set('hour', parseInt(hours)).set('minute', parseInt(minutes)).set('second', parseInt(seconds));
  return currentDate.toDate()
}

export {
  onlyDateFormatter,
  stringToDate,
  stringToTime
}
