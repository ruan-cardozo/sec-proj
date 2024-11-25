import { API_URL } from "../config/config";
import axiosInstance from "./axiosConfig";

type User = {
    name: string;
    email: string;
    password: string;
}

export const createUser = async (user: User) => {
    const url = `${API_URL}users`;
    const response = await axiosInstance.post(url, {
        name: user.name,
        email: user.email,
        password: user.password
    });

    return response;
}