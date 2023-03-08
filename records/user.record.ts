import {NewUserEntity, UserEntity} from "../types";
import {ValidationError} from "../utils/error";
import {v4 as uuid} from "uuid"
import {compareHash, hashPassword} from "../utils/hash";
import {db} from "../utils/db";
import {FieldPacket} from "mysql2";

type UserRecordResult = [UserEntity[], FieldPacket[]];

export class UserRecord implements UserEntity {
    id: string;
    login: string;
    pwd: string;

    constructor(obj: NewUserEntity) {

        this.id = obj.id ?? uuid();
        this.login = obj.login;
        this.pwd = obj.pwd;
    }

    static async loginValidation(login: string): Promise<string | void> {
        const [result] = await db.execute("SELECT * FROM `users` WHERE `login`=:login", {
            login
        }) as UserRecordResult;

        if (result[0] === undefined) {
            return "ok"
        }
        throw new ValidationError("Login jest zajęty! Proszę wpisać inny")
    }

    static async findOne(login: string): Promise<UserRecord | null> {
        const [result] = await db.execute("SELECT * FROM `users` WHERE `login`=:login", {
            login,
        }) as UserRecordResult;

        return result[0] ? new UserRecord(result[0]) : null;
    }

    static async findOneById(id: string): Promise<boolean> {
        const [result] = await db.execute("SELECT * FROM `users` WHERE `id`=:id", {
            id,
        }) as UserRecordResult;

        return !!result[0];
    }

    static async checkPwd(login: string, pwd: string): Promise<boolean> {
        const user = await UserRecord.findOne(login);
        return user ? await compareHash(pwd, user.pwd) : false
    }

    async addUser(): Promise<string | void> {
        this.userValidation(this);
        const check = await UserRecord.loginValidation(this.login);
        if (check === "ok") {
            this.pwd = await hashPassword(this.pwd);
            console.log(this.pwd);

            await db.execute("INSERT INTO `users` (`id`,`login`,`pwd`) VALUES (:id,:login,:pwd)", {
                id: this.id,
                login: this.login,
                pwd: this.pwd,
            })

            return this.id
        }
    }


    private userValidation(obj: NewUserEntity): void {

        if (obj.login.length > 20 || obj.login.length < 4) {
            throw new ValidationError("Login musi zawierać od 4 do 20 znaków")
        }
        if (typeof obj.login !== "string") {
            throw new ValidationError("Wygląda na to, że login użytkownika nie jest tekstem... Niespodziewaliśmy się" +
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