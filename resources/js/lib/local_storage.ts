export const saveLocalStorage = (key: string, value: any) => {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
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
