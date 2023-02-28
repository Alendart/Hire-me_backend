import {NewUserEntity, UserEntity} from "../types";
import {ValidationError} from "../utils/error";
import {v4 as uuid} from "uuid"


export class UserRecord implements UserEntity {
    id: string;
    name: string;
    pwd: string;

    constructor(obj: NewUserEntity) {
        this.userValidation(obj);

        this.id = obj.id ?? uuid();
        this.name = obj.name;
        this.pwd = obj.pwd;
    }

    static async findOne() {

    }

    async addUser() {

    }

    private userValidation(obj: NewUserEntity): void {
        if (obj.name.length > 12 || obj.name.length < 4) {
            throw new ValidationError("Nazwa użytkownika musi zawierać od 4 do 12 znaków")
        }
        if (typeof obj.name !== "string") {
            throw new ValidationError("Wygląda na to, że hasło użytkownika nie jest tekstem... Niespodziewaliśmy się" +
                " tego, spróbuj ponownie później.");
        }
        if (obj.pwd.length > 12 || obj.pwd.length < 4) {
            throw new ValidationError("Hasło musi zawierać od 4 do 12 znaków");
        }
        if (typeof obj.pwd !== "string") {
            throw new ValidationError("Wygląda na to, że hasło użytkownika nie jest tekstem... Niespodziewaliśmy się" +
                " tego, spróbuj ponownie później.");
        }
    }

}