import {applicationStatus, JobEntity, NewJobEntity} from "../types";
import {db} from "../utils/db";

afterAll(() => db.end())

const simpleJob: NewJobEntity = {
    jobName: "Testowe",
    jobDesc: "sialalal",
    url: "wwww.sadasd.pl",
    address: "Testowa 13, Testy Wielkie",
    lat: 12.333456,
    lon: -5.12345,
    fileName: "testoweCV.pdf",
    userID: "1234"

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
    userID: "1234"

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

    const job = new jobRecord(simpleJob);

    expect(job).toBeInstanceOf(jobRecord)
    expect(job.jobName).toBe(simpleJob.jobName);
    expect(job.jobDesc).toBe(simpleJob.jobDesc);
    expect(job.url).toBe(simpleJob.url);
    expect(job.address).toBe(simpleJob.address);
    expect(job.lat).toBe(simpleJob.lat);
    expect(job.lon).toBe(simpleJob.lon);

    expect(job.fileName).toBe(simpleJob.fileName);
    expect(job.userID).toBe(simpleJob.userID);


});

test("New record of job should add id and jobStatus to record", () => {

    const job = new jobRecord(simpleJob);

    expect(job.id).toBeDefined();
    expect(job.id).not.toBeNull();
    expect(job.jobStatus).toBeDefined();
});

test("Adding new job with too short or too long name should throw error", () => {

    expect(() => {
        const job = new jobRecord({
            ...simpleJob,
            jobName: "T",
        });
    }).toThrowError()

    expect(() => {
        const job = new jobRecord({
            ...simpleJob,
            jobName: "Tsssssssssssssssssssssssssssssssssssssss",
        });
    }).toThrowError()
});

test("Adding new job with empty url should throw error", () => {

    expect(() => {
        const job = new jobRecord({
            ...simpleJob,
            url: "",
        });
    }).toThrowError()
});

test("Adding new job with too long url should throw error", () => {

    expect(() => {
        const job = new jobRecord({
            ...simpleJob,
            url: "1111111112111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
        });
    }).toThrowError()
});

test("Adding new job with url that isn't url should throw error", () => {

    expect(() => {
        const job = new jobRecord({
            ...simpleJob,
            url: "Tsadasdasasd",
        });
    }).toThrowError()
});

test("Adding new job without description should throw error", () => {

    expect(() => {
        const job = new jobRecord({
            ...simpleJob,
            jobDesc: "",
        });
    }).toThrowError()
});

test("Adding new job without address should throw error", () => {

    expect(() => {
        const job = new jobRecord({
            ...simpleJob,
            jobDesc: "",
        });
    }).toThrowError()
});

test("Adding new job with too long address should throw error", () => {

    expect(() => {
        const job = new jobRecord({
            ...simpleJob,
            jobDesc: "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
        });
    }).toThrowError()
});

test("Adding new job with too long file name should throw error", () => {

    expect(() => {
        const job = new jobRecord({
            ...simpleJob,
            fileName: "123333333333333333333333",
        });
    }).toThrowError()
});

