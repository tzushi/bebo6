import { supabase } from '../config/supabase'

export async function create(chatMemoId, content) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      chat_memo_id: chatMemoId,
      content,
      timestamp: new Date().toISOString(),
      is_deleted: false
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAll(chatMemoId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_memo_id', chatMemoId)
    .eq('is_deleted', false)
    .order('timestamp', { ascending: true })

  if (error) throw error
  return data
}

export async function update(messageId, content) {
  const { data: currentMessage } = await supabase
    .from('messages')
    .select('*')
    .eq('id', messageId)
    .single()

  if (currentMessage) {
    await supabase
      .from('message_history')
      .insert([{
        message_id: messageId,
        content: currentMessage.content,
        timestamp: currentMessage.timestamp
      }])
  }

  const { data, error } = await supabase
    .from('messages')
    .update({
      content,
      timestamp: new Date().toISOString()
    })
    .eq('id', messageId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function remove(messageId) {
  try {
    // First, check if the message exists
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .single()

    if (fetchError) throw fetchError
    if (!message) throw new Error('Message not found')

    // Then mark it as deleted
    const { data, error: updateError } = await supabase
      .from('messages')
      .update({
        is_deleted: true,
        timestamp: new Date().toISOString()
      })
      .eq('id', messageId)
      .select()
      .single()

    if (updateError) throw updateError
    return data
  } catch (error) {
    console.error('Error removing message:', error)
    throw error
  }
}

export async function getHistory(messageId) {
  const { data, error } = await supabase
    .from('message_history')
    .select('*')
    .eq('message_id', messageId)
    .order('timestamp', { ascending: false })

  if (error) throw error
  return data
}

export async function restore(messageId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .update({
        is_deleted: false,
        timestamp: new Date().toISOString()
      })
      .eq('id', messageId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error restoring message:', error)
    throw error
  }
}