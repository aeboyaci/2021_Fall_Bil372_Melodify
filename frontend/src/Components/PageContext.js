import {createContext, useContext} from "react";

export const PageContext = createContext(null);
export const usePage = () => useContext(PageContext);