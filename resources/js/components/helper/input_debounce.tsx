// Input Delay before action
export const inputDebounce = (
    callback: (...args: any[]) => void,
    delay: number = 1000
) => {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};
