/**
 * Cookie Utility Functions
 * For managing tableId with automatic expiration
 */

/**
 * Set a cookie with expiration time
 * @param name - Cookie name
 * @param value - Cookie value
 * @param hours - Hours until expiration (default: 5)
 */
export function setCookie(name: string, value: string, hours: number = 5): void {
  const maxAge = hours * 60 * 60; // Convert hours to seconds
  const cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = cookie;
  console.log(`Cookie set: ${name}=${value} (expires in ${hours} hours)`);
}

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(row => row.startsWith(`${name}=`));
  
  if (cookie) {
    const value = cookie.split('=')[1];
    console.log(`Cookie retrieved: ${name}=${value}`);
    return value;
  }
  
  console.log(`Cookie not found: ${name}`);
  return null;
}

/**
 * Delete a cookie
 * @param name - Cookie name
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0`;
  console.log(`Cookie deleted: ${name}`);
}

/**
 * Check if a cookie exists and is not expired
 * @param name - Cookie name
 * @returns true if cookie exists
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}
