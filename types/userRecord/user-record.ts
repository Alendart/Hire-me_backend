export interface UserEntity {
    id: string;
    login: string;
    pwd: string;
}

export interface NewUserEntity extends Omit<UserEntity, "id"> {
    id?: string
}

export type UserSimpleEntity = Omit<UserEntity, "pwd">