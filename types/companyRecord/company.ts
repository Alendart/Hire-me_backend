export interface CompanyEntity {
    id: string;
    companyName: string;
    jobDesc: string;
    url: string;
    lat: number;
    lon: number;
    jobStatus: string;
    fileName: string;
    userID: string;
}

export interface NewCompanyEntity extends Omit<CompanyEntity, "id"> {
    id?: string;
}

export type TableCompanyEntity = Pick<CompanyEntity, "id" | "companyName" | "jobStatus">;

export type CompanyGeo = Pick<CompanyEntity, "id" | "lat" | "lon">