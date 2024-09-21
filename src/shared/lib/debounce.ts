export function debounce<T extends (...args: Parameters<T>) => void>(
  callbackFn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      callbackFn(...args);
      timerId = null;
    }, delay);
  };
}
