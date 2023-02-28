export interface UserEntity {
    id: string;
    name: string;
    pwd: string;
}

export interface NewUserEntity extends UserEntity {
    id?: string
}