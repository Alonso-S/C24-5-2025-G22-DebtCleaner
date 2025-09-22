export const isEmailFromDomain = (email: string, domain: string): boolean => {
  const emailDomain = email.split("@")[1]?.toLowerCase();
  return emailDomain === domain.toLowerCase();
};
