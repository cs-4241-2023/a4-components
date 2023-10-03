export interface User {
    id: string;
    username: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData extends LoginData {
    confirmPassword: string;
}
