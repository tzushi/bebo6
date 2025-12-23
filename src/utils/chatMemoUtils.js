import { format, isToday } from 'date-fns'

export function formatChatMemoTimestamp(date) {
  const messageDate = new Date(date)
  
  if (isToday(messageDate)) {
    return format(messageDate, 'HH:mm')
  }
  
  return format(messageDate, 'MM/dd')
}

export function truncateMessage(message, maxLength = 100) {
  if (!message) return ''
  if (message.length <= maxLength) return message
  
  return message.substring(0, maxLength) + '...'
}