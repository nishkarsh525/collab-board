export interface IUser {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

export function validateUser(userData: Partial<IUser>): string[] {
  const errors: string[] = []

  if (!userData.name || userData.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long")
  }

  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push("Valid email is required")
  }

  if (!userData.password || userData.password.length < 6) {
    errors.push("Password must be at least 6 characters long")
  }

  return errors
}

export function createUser(userData: Omit<IUser, "id" | "createdAt">): IUser {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: userData.name.trim(),
    email: userData.email.toLowerCase().trim(),
    password: userData.password,
    createdAt: new Date().toISOString(),
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
