import {applicationStatus, JobEntity, NewJobEntity, TableJobEntity} from "../types";
import {v4 as uuid} from "uuid"
import {ValidationError} from "../utils/error";
import {FieldPacket} from "mysql2/index";
import {db} from "../utils/db";

type JobRecordResult = [JobEntity[], FieldPacket[]];
type TableJobResult = [TableJobEntity[], FieldPacket[]]

export class JobRecord implements JobEntity {
    id: string;
    jobName: string;
    jobDesc: string;
    url: string;
    address: string;
    lat: number;
    lon: number;
    jobStatus: applicationStatus;
    fileName: string;
    userID: string;
    archiveTimeStamp: string | null;

    constructor(obj: NewJobEntity) {
        this.validation(obj);

        this.id = obj.id ?? uuid()
        this.jobName = obj.jobName;
        this.jobDesc = obj.jobDesc;
        this.url = obj.url;
        this.address = obj.address;
        this.lat = Number(obj.lat);
        this.lon = Number(obj.lon);
        this.jobStatus = obj.jobStatus ?? applicationStatus.Send;
        this.fileName = obj.fileName;
        this.userID = obj.userID;
        this.archiveTimeStamp = obj.archiveTimeStamp ?? null
    }

    private validation(obj: NewJobEntity) {
        if (typeof obj.jobName !== "string" || obj.jobName.length < 5 || obj.jobName.length > 30) {
            throw new ValidationError("Nazwa musi mieć od 5 do 30 znaków")
        }
        if (typeof obj.jobDesc !== "string" || obj.jobDesc.length > 10000 || obj.jobDesc.length < 1) {
            throw new ValidationError("Opis nie może być pusty ani przekraczać 10 000 znaków")
        }
        if (typeof obj.url !== "string" || obj.url.length > 200 || obj.url.length < 1) {
            throw new ValidationError("Link nie może być pusty ani mieć więcej niż 200 znaków")
        }
        // walidacja adresu
        if (typeof obj.address !== "string" || obj.address.length > 100 || obj.address.length < 1) {
            throw new ValidationError("Adres nie może być pusty ani mieć więcej niż 100 znaków");
        }
        if (isNaN(obj.lat) || isNaN(obj.lon)) {
            throw new ValidationError("Dane geolokacyjne muszą być liczbą. Wystpąpił jakiś wewnętrzny problem," +
                " proszę spróbować ponownie później")
        }
        if (obj.fileName.length > 20 || obj.fileName.length < 4) {
            throw new ValidationError("Nazwa pliku musi mieć od 4 do 20 znaków")
        }
        if (obj.userID.length !== 36) {
            throw new ValidationError("Id użytkownika nie jest poprawne, proszę skontaktować się z administracją" +
                " serwisu jeżeli problem się powtórzy")
        }
    }

    static async findOne(id: string, userId: string): Promise<JobEntity | null> {

        const [result] = await db.execute('SELECT * FROM `jobs` WHERE `id` = :id AND `userId` = :userId', {
            id,
            userId,
        }) as JobRecordResult

        return result[0] ? new JobRecord(result[0]) : null
    }

    static async countAll(): Promise<number> {

        return
    }

    static async findAllActive(userId: string): Promise<TableJobEntity[]> {
        const [result] = await db.execute('SELECT `id`,`jobName`,`jobStatus` FROM `jobs` WHERE `userId` = :userId', {
            userId,
        }) as JobRecordResult

        return result[0] ? result.map(e => new JobRecord(e)) : null
    }

    static async findAllArchive(userId: string): Promise<TableJobEntity[]> {
        const [result] = await db.execute('SELECT `id`,`jobName`,`jobStatus` FROM `jobs` WHERE `jobStatus` = "Zarchiwizowane" AND + `userId` = :userId', {
            userId,
        }) as JobRecordResult

        return result[0] ? result.map(e => new JobRecord(e)) : null
    }

    static async findLastArchived(userId: string): Promise<TableJobEntity | null> {
        const [result] = await db.execute('SELECT `id`,`jobName`,`jobStatus` FROM `jobs` WHERE `jobStatus` =' +
            ' "Zarchiwizowane" AND + `userId` = :userId ORDER BY `archiveTimeStamp` DESC', {
            userId,
        }) as JobRecordResult

        return result[0] ? result[0] : null
    }

    async insert(): Promise<string> {


        return
    }

    async updateStatus(status: applicationStatus, userId: string): Promise<applicationStatus> {
        const res = await db.execute('UPDATE `jobs` SET `jobStatus`=:status WHERE `id`=:id AND `userId` = :userId', {
            status,
            id: this.id,
            userId,
        })
        return
    }

    async setArchive(userId: string): Promise<void> {
        const date = new Date().toLocaleString('en-GB', {timeZone: 'UTC'})

        await db.execute('UPDATE `jobs` SET `jobStatus` = :status , `archiveTimeStamp` = :date  WHERE id' +
            ' = :id AND `userID`=:userID', {
            status: applicationStatus.Archived,
            date,
            id: this.id,
            userId
        })
    }


}