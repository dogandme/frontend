import { useState, useEffect } from "react";

export * from "./cookie";
export * from "./overlay";
export * from "./debounce";
export * from "./image";
export * from "./format";
export * from "./apiClient";

// TODO refactoring 시 해당 훅 제거 하기
/**
 * useDebounce 훅은 입력된 콜백 함수를 지연시간만큼 지연시킨 후 실행합니다.
 * 첫 번째 인수인 콜백 함수는 디바운스 될 값을 반환해야 합니다.
 * 두 번째 인수인 initialValue는 디바운스 되기 전 초기 값을 설정합니다.
 * 세 번째 인수인 delay는 디바운스 지연시간을 설정합니다.
 */
export const useDebounce = <F extends (...args: unknown[]) => ReturnType<F>>(
  callbackFn: F,
  initialValue: ReturnType<F>,
  delay: number = 500,
) => {
  const [debouncedValue, setDebouncedValue] =
    useState<ReturnType<F>>(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(callbackFn());
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callbackFn, delay]);

  return debouncedValue;
};
