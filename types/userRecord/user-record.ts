export interface UserEntity {
    id: string;
    name: string;
    pwd: string;
}

export interface NewUserEntity extends Omit<UserEntity, "id"> {
    id?: string
}