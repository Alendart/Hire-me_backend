import {applicationStatus,JobEntity,NewJobEntity} from "../types";
import {db} from "../utils/db";
import {JobRecord} from "../records/job.record";

afterAll(() => db.end())

const simpleJob: NewJobEntity = {
    jobName: "Testowe",
    jobDesc: "sialalal",
    url: "wwww.sadasd.pl",
    address: "Testowa 13, Testy Wielkie",
    lat: 12.333456,
    lon: -5.12345,
    fileName: "testoweCV.pdf",
    userId: "a84f7625-9411-45c6-ad60-0aada4aa6544"

}

const simpleJob2: JobEntity = {
    id: "sadasasasd",
    jobName: "Test",
    jobDesc: "sialalal",
    url: "wwww.sadasd.pl",
    address: "Testowa 13, Testy Wielkie",
    lat: 12.333456,
    lon: -5.12345,
    jobStatus: applicationStatus.Send,
    fileName: "testoweCV.pdf",
    userId: "1234",
    archiveTimeStamp: ''

}

const badJob = {
    jobName: "Test",
    jobDesc: "sialalal",
    lat: 12.333456,
    lon: -5.12345,
    fileName: "testoweCV.pdf",
    userID: "1234"

}


test("New record of job should properly name all parameters", () => {

    const job = new JobRecord(simpleJob);

    expect(job).toBeInstanceOf(JobRecord)
    expect(job.jobName).toBe(simpleJob.jobName);
    expect(job.jobDesc).toBe(simpleJob.jobDesc);
    expect(job.url).toBe(simpleJob.url);
    expect(job.address).toBe(simpleJob.address);
    expect(job.lat).toBe(simpleJob.lat);
    expect(job.lon).toBe(simpleJob.lon);

    expect(job.fileName).toBe(simpleJob.fileName);
    expect(job.userId).toBe(simpleJob.userId);


});

test("New record of job should add id and jobStatus to record", () => {

    const job = new JobRecord(simpleJob);

    expect(job.id).toBeDefined();
    expect(job.id).not.toBeNull();
    expect(job.jobStatus).toBeDefined();
});

test("Adding new job with too short or too long name should throw error", () => {

    expect(() => {
        const job = new JobRecord({
            ...simpleJob,
            jobName: "T",
        });
    }).toThrowError("Nazwa musi mieć od 5 do 30 znaków")

    expect(() => {
        const job = new JobRecord({
            ...simpleJob,
            jobName: "Tssssssssssssssssssssssssssssssssssssssssssssssss",
        });
    }).toThrowError("Nazwa musi mieć od 5 do 30 znaków")
});

test("Adding new job with empty url should throw error", () => {

    expect(() => {
        const job = new JobRecord({
            ...simpleJob,
            url: "",
        });
    }).toThrowError("Link nie może być pusty ani mieć więcej niż 200 znaków")
});

test("Adding new job with too long url should throw error", () => {

    expect(() => {
        const job = new JobRecord({
            ...simpleJob,
            url: "1111111112111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
        });
    }).toThrowError("Link nie może być pusty ani mieć więcej niż 200 znaków")
});

test("Adding new job with url that isn't url should throw error", () => {

    expect(() => {
        const job = new JobRecord({
            ...simpleJob,
            url: "Tsadasdasasd",
        });
    }).toThrowError()
});

test("Adding new job without description should throw error", () => {

    expect(() => {
        const job = new JobRecord({
            ...simpleJob,
            jobDesc: "",
        });
    }).toThrowError("Opis nie może być pusty ani przekraczać 10 000 znaków")
});

test("Adding new job without address should throw error", () => {

    expect(() => {
        const job = new JobRecord({
            ...simpleJob,
            address: "",
        });
    }).toThrowError("Adres nie może być pusty ani mieć więcej niż 100 znaków")
});

test("Adding new job with too long address should throw error", () => {

    expect(() => {
        const job = new JobRecord({
            ...simpleJob,
            address: "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
        });
    }).toThrowError("Adres nie może być pusty ani mieć więcej niż 100 znaków")
});

test("Adding new job with too long file name should throw error", () => {

    expect(() => {
        const job = new JobRecord({
            ...simpleJob,
            fileName: "123333333333333333333333",
        });
    }).toThrowError("Nazwa pliku musi mieć od 4 do 20 znaków")
});

