import { supabase } from '../config/supabase'

export async function create(userId, title) {
  try {
    const { data, error } = await supabase
      .from('chat_memos')
      .insert([{
        user_id: userId,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title_modified: title !== '新しいチャットメモ',
        is_starred: false
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating chat memo:', error)
    throw error
  }
}

export async function getAll(userId) {
  try {
    const { data, error } = await supabase
      .from('chat_memos')
      .select('*')
      .eq('user_id', userId)
      .order('is_starred', { ascending: false })
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting chat memos:', error)
    throw error
  }
}

export async function update(chatMemoId, updates) {
  try {
    const { data, error } = await supabase
      .from('chat_memos')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', chatMemoId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating chat memo:', error)
    throw error
  }
}

export async function remove(chatMemoId) {
  try {
    // First, get the chat memo
    const { data: chatMemo, error: memoError } = await supabase
      .from('chat_memos')
      .select('*')
      .eq('id', chatMemoId)
      .maybeSingle()

    if (memoError) throw memoError
    if (!chatMemo) throw new Error('Chat memo not found')

    // Get associated messages
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_memo_id', chatMemoId)
      .eq('is_deleted', false)

    if (messagesError) throw messagesError

    // Begin deletion process
    const { error: insertError } = await supabase
      .from('deleted_chat_memos')
      .insert({
        original_id: chatMemoId,
        user_id: chatMemo.user_id,
        title: chatMemo.title,
        created_at: chatMemo.created_at,
        updated_at: chatMemo.updated_at,
        title_modified: chatMemo.title_modified,
        is_starred: chatMemo.is_starred,
        deleted_at: new Date().toISOString(),
        messages: messages || []
      })

    if (insertError) throw insertError

    // Finally, delete the chat memo
    const { error: deleteError } = await supabase
      .from('chat_memos')
      .delete()
      .eq('id', chatMemoId)
      .single()

    if (deleteError) throw deleteError

    return chatMemo
  } catch (error) {
    console.error('Error removing chat memo:', error)
    throw error
  }
}

export async function undoDelete(userId, originalId) {
  try {
    // Get the most recently deleted memo
    const { data: deletedMemo, error: fetchError } = await supabase
      .from('deleted_chat_memos')
      .select('*')
      .eq('user_id', userId)
      .eq('original_id', originalId)
      .order('deleted_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (fetchError) throw fetchError
    if (!deletedMemo) throw new Error('Deleted memo not found')

    // Restore the chat memo
    const { data: restoredMemo, error: restoreError } = await supabase
      .from('chat_memos')
      .insert({
        user_id: deletedMemo.user_id,
        title: deletedMemo.title,
        created_at: deletedMemo.created_at,
        updated_at: new Date().toISOString(),
        title_modified: deletedMemo.title_modified,
        is_starred: deletedMemo.is_starred
      })
      .select()
      .single()

    if (restoreError) throw restoreError

    // Restore messages if any
    if (deletedMemo.messages?.length > 0) {
      const messages = deletedMemo.messages.map(msg => ({
        chat_memo_id: restoredMemo.id,
        content: msg.content,
        timestamp: msg.timestamp,
        is_deleted: false
      }))

      const { error: msgError } = await supabase
        .from('messages')
        .insert(messages)

      if (msgError) throw msgError
    }

    // Remove the deleted memo record
    await supabase
      .from('deleted_chat_memos')
      .delete()
      .eq('id', deletedMemo.id)

    return restoredMemo
  } catch (error) {
    console.error('Error undoing delete:', error)
    throw error
  }
}

export async function updateTitleFromFirstMessage(chatMemoId, content) {
  try {
    const { data: chatMemo, error: checkError } = await supabase
      .from('chat_memos')
      .select('title_modified')
      .eq('id', chatMemoId)
      .maybeSingle()

    if (checkError) throw checkError
    if (!chatMemo || chatMemo.title_modified) {
      return null
    }

    // Extract first line or first 50 characters
    let newTitle = content.split('\n')[0]
    if (newTitle.length > 50) {
      newTitle = newTitle.substring(0, 47) + '...'
    }

    const { data, error } = await supabase
      .from('chat_memos')
      .update({
        title: newTitle,
        title_modified: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', chatMemoId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating title from first message:', error)
    throw error
  }
}