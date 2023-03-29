import {Request,Router} from "express";
import multer,{FileFilterCallback} from "multer";
import {ValidationError} from "../utils/error";
import {JobRecord} from "../records/job.record";
import {FileRecord} from "../records/file.record";
import * as path from 'path'

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
            callback(null,"CV_"+Date.now()+"_"+path.extname(file.originalname))
        } else if (file.mimetype === "application/msword") {
            callback(null,"CV_"+Date.now()+"_"+path.extname(file.originalname))
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
        const uploadedFile = req.file;
        console.log({
            fileName,
            userId,
            name,
            jobId,
            uploadedFile
        })
        const job = await JobRecord.findOne(jobId,userId);
        const file = new FileRecord({
            fileName,
            userId,
            userFileName: name,
        })

        const newId = await file.addFile();
        console.log(newId)
        await job.updateFileName(fileName);

        res.json(true)


    })
    // Pobranie listy wszystkich plików użytkownika
    .get("/all",async (req,res) => {


    })
    // Pobranie pliku CV po kliknięciu w ikonkę pliku
    .get("/:fileName",async (req,res) => {


    })