import { format, isToday, isThisYear, isYesterday, isWithinInterval, subDays } from 'date-fns'
import { ja } from 'date-fns/locale'

export function formatMessageDate(date) {
  const messageDate = new Date(date)
  const timeStr = format(messageDate, 'HH:mm')
  const dateStr = format(messageDate, 'MM/dd')
  const weekDay = format(messageDate, 'E', { locale: ja })
  
  if (isToday(messageDate)) {
    return `今日 ${dateStr}(${weekDay}) ${timeStr}`
  }
  
  if (isYesterday(messageDate)) {
    return `昨日 ${dateStr}(${weekDay}) ${timeStr}`
  }
  
  if (isWithinInterval(messageDate, {
    start: subDays(new Date(), 7),
    end: new Date()
  })) {
    return `${dateStr}(${weekDay}) ${timeStr}`
  }
  
  if (isThisYear(messageDate)) {
    return `${dateStr} ${timeStr}`
  }
  
  return `${format(messageDate, 'yyyy/MM/dd')} ${timeStr}`
}

export function formatChatMemoTimestamp(date) {
  const messageDate = new Date(date)
  
  if (isToday(messageDate)) {
    return format(messageDate, 'HH:mm')
  }
  
  return format(messageDate, 'MM/dd')
}