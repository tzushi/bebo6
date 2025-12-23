import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Add error handling for connection issues
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear any cached data when user signs out
    supabase.auth.stopAutoRefresh()
  }
})

// Add error handling for database operations
supabase.handleError = (error) => {
  console.error('Supabase error:', error)
  
  if (error.code === 'PGRST301') {
    return new Error('データベースへの接続に失敗しました')
  }
  
  if (error.code === '42501') {
    return new Error('アクセス権限がありません')
  }
  
  if (error.code === '23505') {
    return new Error('重複するデータが存在します')
  }
  
  return new Error('エラーが発生しました')
}

export default supabase