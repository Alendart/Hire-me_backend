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
}

export interface NewJobEntity extends Omit<JobEntity, "id" | "jobStatus"> {
    id?: string;
    jobStatus?: applicationStatus;
}

export type TableJobEntity = Pick<JobEntity, "id" | "jobName" | "jobStatus">;

export type JobGeo = Pick<JobEntity, "id" | "lat" | "lon" | "address">


export enum applicationStatus {
    Send = "Wysłano",
    Waiting = "Oczekuje na odpowiedź",
    Appointment = "Zaplanowano spotkanie",
    Accepted = "Zaakceptowane",
    Refused = "Odrzucone",
}