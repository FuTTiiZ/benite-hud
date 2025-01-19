// Will return whether the current environment is in a regular browser
// and not CEF
export const isEnvBrowser = (): boolean => !window.invokeNative

// Basic no operation function
export const noop = () => {}

// Round to two decimals
export const roundTwoDecimals = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100