export const handleSessionStorage = {
    get: (key) => {
        return JSON.parse(sessionStorage.getItem(key));
    },
    set: (key, value) => {
        sessionStorage.setItem(key, JSON.stringify(value))
    },
    remove: (key) => {
        sessionStorage.removeItem(key)
    },
}