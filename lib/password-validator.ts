export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = []

  // Minimum length
  if (password.length < 8) {
    errors.push("Parola trebuie să aibă cel puțin 8 caractere")
  }

  // Maximum length (to prevent DoS attacks)
  if (password.length > 128) {
    errors.push("Parola nu poate avea mai mult de 128 de caractere")
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Parola trebuie să conțină cel puțin o literă mică")
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Parola trebuie să conțină cel puțin o literă mare")
  }

  // At least one number
  if (!/\d/.test(password)) {
    errors.push("Parola trebuie să conțină cel puțin o cifră")
  }

  // At least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Parola trebuie să conțină cel puțin un caracter special (!@#$%^&* etc.)")
  }

  // No common weak passwords
  const commonPasswords = [
    'password', 'parola', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'parola123', 'admin', 'user', 'test', 'guest'
  ]
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("Această parolă este prea comună și nesigură")
  }

  // No repeated characters (more than 3 in a row)
  if (/(.)\1{3,}/.test(password)) {
    errors.push("Parola nu poate conține același caracter repetat de mai mult de 3 ori consecutiv")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function generatePasswordStrengthScore(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0

  // Length bonus
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1

  // Character variety
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1

  // Bonus for mixed character types
  const charTypes = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ].filter(Boolean).length

  if (charTypes >= 3) score += 1

  // Determine strength label and color
  if (score <= 2) {
    return { score, label: "Slabă", color: "text-red-400" }
  } else if (score <= 4) {
    return { score, label: "Medie", color: "text-yellow-400" }
  } else if (score <= 6) {
    return { score, label: "Bună", color: "text-blue-400" }
  } else {
    return { score, label: "Foarte bună", color: "text-green-400" }
  }
}