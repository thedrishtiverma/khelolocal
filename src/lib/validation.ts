export function passwordResetValidationError(password: string, confirmation: string) {
  if (password.length < 8) return "Use at least 8 characters.";
  if (password !== confirmation) return "Passwords do not match.";
  return null;
}
