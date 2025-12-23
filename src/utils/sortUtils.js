import { parseISO } from 'date-fns'

export function getLatestActivityTimestamp(chatMemo) {
  const timestamps = [
    chatMemo.created_at,
    chatMemo.updated_at
  ]

  // Convert all timestamps to Date objects, filtering out invalid ones
  const validDates = timestamps
    .filter(ts => ts)
    .map(ts => parseISO(ts))
    .filter(date => !isNaN(date))

  // Return the most recent timestamp
  return validDates.length > 0 ? Math.max(...validDates.map(d => d.getTime())) : 0
}

export function sortChatMemos(chatMemos) {
  return [...chatMemos].sort((a, b) => {
    // First sort by starred status
    if (a.is_starred && !b.is_starred) return -1
    if (!a.is_starred && b.is_starred) return 1

    // If both are starred or both are not starred,
    // sort by latest activity timestamp
    const aTimestamp = getLatestActivityTimestamp(a)
    const bTimestamp = getLatestActivityTimestamp(b)
    return bTimestamp - aTimestamp
  })
}