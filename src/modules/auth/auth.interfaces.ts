export interface LoginResponse {
    status: LoginStatus;
    token?: string;
    message?: string;
}

export enum LoginStatus {
    INVALID_CREDENTIALS = 'invalid-credentials',
    SUCCESS = 'success'
}

type User = {
    uuid: string,
    names: string,
    lastnames: string,
    password: string,
    role: string,
}

export interface IAuthenticate {
    readonly user: User;
    readonly token: string;
}

export enum Role {
    ADMIN = 'admin',
    MP = 'mp'
}

export enum ApiKey {
    SECRET = 'secret',
    PUBLIC = 'public'
}
