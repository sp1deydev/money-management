import { handleLocalStorage } from "./handleLocalStorage";
import handleAuthToken from "./handleAuthToken";
import { handleSessionStorage } from "./handleSessionStorage";

const checkAuth = () => {
    const session = handleSessionStorage.get('access_token');
    const token = handleLocalStorage.get('access_token');
    if (session) {
        handleAuthToken(session)
        return true;
    }
    if (!token) {
        return false;
    }
    handleAuthToken(token)
    return true;
};


export default checkAuth;