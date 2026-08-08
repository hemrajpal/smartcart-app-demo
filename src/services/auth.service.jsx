import publicApi from "../config/publicApi";

export const signup = (data) => {
  return publicApi.post("/register", data);
};

export const login = (data) => {
  return publicApi.post("/login", data);
};
