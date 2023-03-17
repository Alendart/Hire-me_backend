export interface JobEntity {
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
}

export interface NewJobEntity extends Omit<JobEntity, "id" | "jobStatus" | "archiveTimeStamp"> {
    id?: string;
    jobStatus?: applicationStatus;
    archiveTimeStamp?: string | null;
}

export type TableJobEntity = Pick<JobEntity, "id" | "jobName" | "jobStatus">;

export type JobGeo = Pick<JobEntity, "id" | "lat" | "lon" | "address">


export enum applicationStatus {
    Send = "Wysłano",
    Waiting = "Oczekuje na odpowiedź",
    Appointment = "Zaplanowano spotkanie",
    Accepted = "Zaakceptowane",
    Refused = "Odrzucone",
    Archived = "Zarchiwizowane",
}