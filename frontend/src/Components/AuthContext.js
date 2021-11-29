import {createContext, useContext} from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext(null);
export const useAuth = () => {
    const [auth,setAuth] = useContext(AuthContext);

    let user = Cookies.get("user");
    user = user && JSON.parse(user);

    return [user ? user : auth, setAuth];
};