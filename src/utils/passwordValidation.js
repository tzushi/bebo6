export function validatePassword(currentPassword, newPassword, confirmPassword) {
  const errors = []

  // Check if new password meets minimum length requirement
  if (newPassword.length < 8) {
    errors.push('新しいパスワードは8文字以上である必要があります')
  }

  // Check if new password and confirmation match
  if (newPassword !== confirmPassword) {
    errors.push('新しいパスワードが一致しません')
  }

  return errors
}