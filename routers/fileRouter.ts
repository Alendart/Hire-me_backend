import {Request,Router} from "express";
import multer,{FileFilterCallback} from "multer";
import {ValidationError} from "../utils/error";
import {JobRecord} from "../records/job.record";
import {FileRecord} from "../records/file.record";
import * as path from 'path'
import * as fs from "fs";

const fileFilter = (req: Request,file: Express.Multer.File,cb: FileFilterCallback) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "application/msword") {
        cb(null,true)
    } else {
        cb(new ValidationError("Typ pliku nie jest obsługiwany"))
    }


}
const storage = multer.diskStorage({
    destination: (req,file,callback) => {
        callback(null,'uploads/cv/')
    },
    filename(req: Request,file: Express.Multer.File,callback: (error: (Error | null),filename: string) => void) {
        if (file.mimetype === "application/pdf") {
            callback(null,"CV_"+Date.now()+path.extname(file.originalname))
        } else if (file.mimetype === "application/msword") {
            callback(null,"CV_"+Date.now()+path.extname(file.originalname))
        } else {
            callback(null,"CV_"+Date.now()+"_"+"unkownfile")
        }
    }
})

const upload = multer({
    storage: storage,
    limits: {fileSize: 5000000},
    fileFilter: fileFilter
})

export const fileRouter = Router();

fileRouter
    // Dodanie pliku CV do firmy
    .post("/",upload.single('file'),async (req,res) => {
        const fileName = req.file.filename;
        const userId = req.cookies.user
        const {
            name,
            jobId
        } = req.body;
        const job = await JobRecord.findOne(jobId,userId);
        const file = new FileRecord({
            fileName,
            userId,
            userFileName: name,
        })

        await file.addFile();
        await job.updateFileName(name);

        res.json(true)


    })
    // Pobranie listy wszystkich plików użytkownika
    .get("/",async (req,res) => {
        const userId = req.cookies.user;
        const fileList = await FileRecord.listAllFiles(userId)

        const fileNames = fileList.map(e => e.userFileName)
        res.json(fileNames);

    })
    // Pobranie pliku CV po kliknięciu w ikonkę pliku
    .get("/:fileName",async (req,res) => {
        const userId = req.cookies.user;
        const fileName = req.params.fileName;

        const file = await FileRecord.findOneByName(fileName,userId);
        if (file) {
            const readStream = fs.createReadStream(`uploads/cv/${file.fileName}`)
            readStream.pipe(res);
        } else {
            throw new ValidationError("W bazie danych nie ma takiego pliku, lub ten użytkownik nie ma do niego dostępu")
        }

    })
    .post("/select",async (req,res) => {
        const {
            jobId,
            fileName
        } = req.body;
        const userId = req.cookies.user;

        const file = await FileRecord.findOneByName(fileName,userId);
        const job = await JobRecord.findOne(jobId,userId);
        if (file && job) {
            await job.updateFileName(file.userFileName);
            res.json(true);
        } else {
            throw new ValidationError("Błąd podczas powiązywania pliku, spróbuj ponownie później")
        }
    })