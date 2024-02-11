export const dispatchAuthEvent = () => {
  window.dispatchEvent(new Event('authChange'));
};