import {applicationStatus,JobEntity,NewJobEntity,TableJobEntity} from "../types";
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
    userId: string;
    archiveTimeStamp: string | null;

    constructor(obj: NewJobEntity) {


        this.id = obj.id ?? uuid()
        this.jobName = obj.jobName;
        this.jobDesc = obj.jobDesc;
        this.url = obj.url;
        this.address = obj.address;
        this.lat = Number(obj.lat);
        this.lon = Number(obj.lon);
        this.jobStatus = obj.jobStatus ?? applicationStatus.Send;
        this.fileName = obj.fileName ?? null;
        this.userId = obj.userId;
        this.archiveTimeStamp = obj.archiveTimeStamp ?? null
        this.validation(obj);
    }

    static async findOne(id: string,userId: string): Promise<JobRecord | null> {

        const [result] = await db.execute('SELECT * FROM `jobs` WHERE `id` = :id AND `userId` = :userId',{
            id,
            userId,
        }) as JobRecordResult

        return result[0] ? new JobRecord(result[0]) : null
    }

    static async findAllActive(userId: string): Promise<TableJobEntity[] | null> {
        const [result] = await db.execute('SELECT `id`,`jobName`,`jobStatus` FROM `jobs` WHERE `userId` = :userId',{
            userId,
        }) as TableJobResult

        return result[0] ? result : null
    }

    static async countAll(): Promise<number> {

        return
    }

    static async findAllArchive(userId: string): Promise<TableJobEntity[] | null> {
        const [result] = await db.execute('SELECT `id`,`jobName`,`jobStatus` FROM `jobs` WHERE `jobStatus` = "Zarchiwizowane" AND `userId` = :userId',{
            userId,
        }) as TableJobResult

        return result[0] ? result : null
    }

    static async findLastArchived(userId: string): Promise<TableJobEntity | null> {
        const [result] = await db.execute('SELECT `id`,`jobName`,`jobStatus` FROM `jobs` WHERE `jobStatus`="Zarchiwizowane" AND `userId` = :userId ORDER BY `archiveTimeStamp` DESC',{
            userId,
        }) as JobRecordResult

        return result[0] ? result[0] : null
    }

    async add(): Promise<string> {

        await db.execute("INSERT INTO `jobs` (`id`,`jobName`,`jobDesc`,`url`,`address`,`lat`,`lon`,`jobStatus`,`fileName`,`userId`) VALUES(:id,:jobName,:jobDesc,:url,:address,:lat,:lon,:jobStatus,:fileName,:userId)",{
            id: this.id,
            jobName: this.jobName,
            jobDesc: this.jobDesc,
            url: this.url,
            address: this.address,
            lat: this.lat,
            lon: this.lon,
            jobStatus: this.jobStatus,
            fileName: this.fileName,
            userId: this.userId,
        })

        return this.id
    }

    async updateStatus(status: applicationStatus): Promise<void> {
        await db.execute('UPDATE `jobs` SET `jobStatus`=:status WHERE `id`=:id AND `userId` = :userId',{
            status,
            id: this.id,
            userId: this.userId,
        })

    }

    async setArchive(): Promise<void> {
        const date = new Date().toLocaleString('en-GB',{timeZone: 'UTC'})

        await db.execute('UPDATE `jobs` SET `jobStatus` = :status , `archiveTimeStamp` = :date  WHERE id'+' = :id AND `userID`=:userID',{
            status: applicationStatus.Archived,
            date,
            id: this.id,
            userId: this.userId,
        })
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
            throw new ValidationError("Dane geolokacyjne muszą być liczbą. Wystpąpił jakiś wewnętrzny problem,"+" proszę spróbować ponownie później")
        }
        // if (obj.fileName.length > 20 || obj.fileName.length < 4) {
        //     throw new ValidationError("Nazwa pliku musi mieć od 4 do 20 znaków")
        // }
        if (obj.userId.length !== 36) {
            throw new ValidationError("Id użytkownika nie jest poprawne, proszę skontaktować się z administracją"+" serwisu jeżeli problem się powtórzy")
        }
    }


}