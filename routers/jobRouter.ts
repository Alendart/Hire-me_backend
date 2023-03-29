import "express-async-errors";
import {Router} from "express";
import {JobRecord} from "../records/job.record";
import {CreateFormJobEntity} from "../types";
import {UserRecord} from "../records/user.record";
import {ValidationError} from "../utils/error";


export const jobRouter = Router();

jobRouter
    // Zwrócenie listy wszystkich niezarchiwizowanych aplikacji w uproszczonej formie oraz ostatniego zarchiwizowanego zgłoszenia
    .get("/",async (req,res) => {
        const userId: string = req.cookies.user;
        const list = await JobRecord.findAllActive(userId);
        const lastArchived = await JobRecord.findLastArchived(userId);
        res.json({
            list,
            lastArchived
        });
    })
    // Pobranie pełnych danych na temat jednej firmy
    .get("/job/:id",async (req,res) => {
        const jobId: string = req.params.id;
        const userId: string = req.cookies.user;
        const job = await JobRecord.findOne(jobId,userId);

        if (job) {
            res.json({job})
        } else {
            throw new ValidationError("Nie istnieje takie ogłoszenie o pracę lub nie masz do niego dostępu")
        }

    })
    // Dodanie nowego ogłoszenia o pracę
    .post("/job",async (req,res) => {
        const jobData: CreateFormJobEntity = req.body;
        const userId: string = req.cookies.user;
        if (await UserRecord.findOneById(userId)) {
            const newJob = new JobRecord({
                ...jobData,
                userId
            })
            const id = await newJob.add();
            res.json(id)
        } else {
            throw new ValidationError("Użytkownik do którego próbujesz przypisać ogłoszenie o pracę nie istnieje!")
        }

    })
    //Zaktualizowanie statusu ogłoszenia
    .patch("/job",async (req,res) => {
        const {
            newStatus,
            jobId
        } = req.body;
        const userId: string = req.cookies.user;
        const job = await JobRecord.findOne(jobId,userId)

        if (job) {
            await job.updateStatus(newStatus)
            res.json(true)
        } else {
            throw new ValidationError("Nie znaleźliśmy ogłoszenia, w którym chciałeś zmienić status")
        }


    })
    // Pobranie listy wszystkich zarchiwizowanych w uproszczonej formie
    .get("/archive",async (req,res) => {
        const userId: string = req.cookies.user;
        const list = await JobRecord.findAllArchive(userId);
        res.json(list)
    })
