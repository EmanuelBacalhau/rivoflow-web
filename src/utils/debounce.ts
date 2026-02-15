export function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  wait: number = 500,
): (...args: T) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: T) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
