import {FileEntity,FileNames,NewFileEntity,SimpleFileEntity} from "../types";
import {ValidationError} from "../utils/error";
import {UserRecord} from "./user.record";
import {db} from "../utils/db";

export class FileRecord implements FileEntity {
    id: number | null;
    fileName: string;
    userFileName: string;
    userId: string;

    constructor(obj: NewFileEntity) {
        this.id = obj.id ?? null;
        this.fileName = obj.fileName;
        this.userFileName = obj.userFileName;
        this.userId = obj.userId

        this.fileNameValidation()
    }

    static async listAllFiles(userId: string): Promise<SimpleFileEntity[] | null> {
        if (typeof userId === "string") {
            const [result] = await db.execute('SELECT `userFileName` FROM `files` WHERE `userId` = :userId',{
                userId
            }) as any

            return result[0] ? result : null
        }
        return null

    }

    static async findOneByName(fileName: string,userId: string): Promise<FileNames | null> {
        if (typeof fileName === "string" && typeof userId === "string") {
            const [result] = await db.execute('SELECT `fileName`,`userFileName` FROM `files` WHERE `userId` = :userId AND `userFileName` = :fileName',{
                userId,
                fileName,
            }) as any

            return result[0] ? result[0] : null
        }
        return null
    }

    async addFile() {
        const idCheck = await this.userIdCheck();
        if (idCheck) {
            const result = await db.execute('INSERT INTO `files` (`fileName`,`userFileName`,`userId`) VALUES (:fileName,:userFileName,:userId)',{
                fileName: this.fileName,
                userFileName: this.userFileName,
                userId: this.userId,
            }) as any;
            return result[0]?.insertId;
        } else {
            throw new ValidationError("Nie można dodać pliku ponieważ nie istnieje taki użytkownik")
        }
    }

    private fileNameValidation() {
        if (this.userFileName.length < 3 || this.userFileName.length > 20) {
            throw new ValidationError("Nazwa pliku musi mieć od 3 do 20 znaków");
        }
    }

    private async userIdCheck() {
        return UserRecord.findOneById(this.userId)
    }
}