import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../config/supabase'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const authInitialized = ref(false)
  const isAuthenticated = computed(() => !!currentUser.value)

  async function initializeFromStorage() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      
      if (session?.user?.email_confirmed_at) {
        currentUser.value = {
          id: session.user.id,
          email: session.user.email
        }
      }
    } catch (error) {
      console.error('Session initialization error:', error)
      currentUser.value = null
    } finally {
      authInitialized.value = true
    }
  }

  async function login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        if (error.message === 'Invalid login credentials' || error.code === 'invalid_credentials') {
          throw new Error('メールアドレスまたはパスワードが正しくありません')
        }
        if (error.message === 'Email not confirmed') {
          throw new Error('メールアドレスの確認が完了していません')
        }
        throw error
      }

      if (!data?.user) {
        throw new Error('ログインに失敗しました')
      }

      currentUser.value = {
        id: data.user.id,
        email: data.user.email
      }
      
      return currentUser.value
    } catch (error) {
      // If it's our custom error message, throw it directly
      if (error.message === 'メールアドレスまたはパスワードが正しくありません' ||
          error.message === 'メールアドレスの確認が完了していません') {
        throw error
      }
      
      // For other errors, log and throw a generic message
      console.error('Login error:', error)
      throw new Error('ログインに失敗しました。もう一度お試しください。')
    }
  }

  async function signup(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Signup error:', error)
      if (error.message?.includes('already registered')) {
        throw new Error('このメールアドレスは既に登録されています')
      }
      throw new Error('アカウントの作成に失敗しました。もう一度お試しください。')
    }
  }

  async function requestPasswordReset(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      if (error) throw error
    } catch (error) {
      console.error('Password reset request error:', error)
      throw new Error('パスワードリセットメールの送信に失敗しました')
    }
  }

  async function resetPassword(newPassword) {
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      if (!session) {
        throw new Error('セッションが無効です。パスワードリセットのリンクをクリックして再度お試しください。')
      }

      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error

      // Sign out after successful password reset
      await logout()
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  async function verifyPassword(password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: currentUser.value.email,
        password
      })
      return !error && !!data.user
    } catch {
      return false
    }
  }

  async function updateEmail(newEmail, password) {
    try {
      const isValid = await verifyPassword(password)
      if (!isValid) {
        throw new Error('現在のパスワードが正しくありません')
      }

      const { error } = await supabase.auth.updateUser({
        email: newEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?type=email_change`
        }
      })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Update email error:', error)
      if (error.message?.includes('already registered')) {
        throw new Error('このメールアドレスは既に使用されています')
      }
      throw new Error('メールアドレスの更新に失敗しました。もう一度お試しください。')
    }
  }

  async function deleteAccount() {
    try {
      const { error } = await supabase.rpc('delete_user', {
        user_id: currentUser.value.id
      })
      if (error) throw error
      
      await logout()
    } catch (error) {
      console.error('Delete account error:', error)
      throw new Error('アカウントの削除に失敗しました。もう一度お試しください。')
    }
  }

  async function logout() {
    try {
      currentUser.value = null
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Logout error:', error)
      throw new Error('ログアウトに失敗しました。もう一度お試しください。')
    }
  }

  return {
    currentUser,
    isAuthenticated,
    authInitialized,
    initializeFromStorage,
    login,
    signup,
    verifyPassword,
    updateEmail,
    deleteAccount,
    logout,
    requestPasswordReset,
    resetPassword
  }
})