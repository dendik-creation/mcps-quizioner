export const saveLocalStorage = (key: string, value: any) => {
    if (typeof window !== "undefined") {
        if (existLocalStorage(key)) return;
        window.localStorage.setItem(key, JSON.stringify(value));
        window.location.reload();
    }
};

export const existLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
        return window.localStorage.getItem(key) !== null;
    }
    return false;
};

export const getLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }
    return null;
};

export const removeLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
    }
};
