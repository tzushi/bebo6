import { supabase } from '../config/supabase'

export async function createChatMemo(userId, title, titleModified = false) {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const { data, error } = await supabase
      .from('chat_memos')
      .insert([{
        user_id: userId,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title_modified: titleModified,
        is_starred: false
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    if (!data) {
      throw new Error('No data returned from insert')
    }

    return data
  } catch (error) {
    console.error('Error creating chat memo:', error)
    throw error
  }
}

// ... rest of the database service implementation remains the same ...