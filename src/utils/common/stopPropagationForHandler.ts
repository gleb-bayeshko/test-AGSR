import { SyntheticEvent } from "react";

// Обёртка для обработчика клика, которая останавливает всплытие события
export function stopPropagationForHandler<
  E extends SyntheticEvent = SyntheticEvent
>(handler?: (e: E) => void) {
  return (e: E) => {
    e.stopPropagation();
    handler?.(e);
  };
}
