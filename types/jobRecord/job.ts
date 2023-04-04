export interface JobEntity {
    id: string;
    jobName: string;
    jobDesc: string;
    url: string;
    address: string;
    lat: number;
    lon: number;
    jobStatus: applicationStatus;
    fileName: string | null;
    userId: string;
    archiveTimeStamp: string | null;
}

export interface NewJobEntity extends Omit<JobEntity,"id" | "jobStatus" | "archiveTimeStamp" | "fileName"> {
    id?: string;
    fileName?: string;
    jobStatus?: applicationStatus;
    archiveTimeStamp?: string | null;
}

export type CreateFormJobEntity = Omit<JobEntity,"userId" | "id" | "jobStatus" | "archiveTimeStamp" | "fileName">;

export type TableJobEntity = Pick<JobEntity,"id" | "jobName" | "jobStatus">;

export type MapJobEntity = Pick<JobEntity,"id" | "jobName" | "address" | "lat" | "lon" | "url" | "jobStatus">

export type applicationStatusString = keyof typeof applicationStatus;

export enum applicationStatus {
    Prepared = "Przygotowane",
    Send = "Wysłano",
    Waiting = "Oczekuje na odpowiedź",
    Appointment = "Zaplanowano spotkanie",
    Accepted = "Zaakceptowane",
    Refused = "Odrzucone",
    Archived = "Zarchiwizowane",
}