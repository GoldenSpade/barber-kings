import sha256 from 'tiny-sha256'

/**
 * Хеширует пароль с использованием SHA256
 * @param {string} password - Пароль для хеширования
 * @returns {string} - SHA256 хеш пароля в hex формате
 */
export function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string')
  }
  
  try {
    // Проверяем что sha256 это функция
    if (typeof sha256 !== 'function') {
      console.error('sha256 is not a function, got:', typeof sha256, sha256)
      throw new Error('SHA256 function not available')
    }
    
    // Хешируем пароль с использованием SHA256
    const result = sha256(password)
    
    if (!result || typeof result !== 'string') {
      throw new Error('SHA256 function returned invalid result')
    }
    
    return result
  } catch (error) {
    console.error('SHA256 hashing error:', error)
    throw new Error('Failed to hash password: ' + error.message)
  }
}

/**
 * Проверяет, совпадает ли пароль с хешем
 * @param {string} password - Введенный пароль
 * @param {string} hash - Сохраненный хеш пароля
 * @returns {boolean} - true если пароль совпадает с хешем
 */
export function verifyPassword(password, hash) {
  if (!password || !hash) {
    return false
  }
  
  try {
    const passwordHash = hashPassword(password)
    return passwordHash === hash
  } catch (error) {
    console.error('Error verifying password:', error)
    return false
  }
}