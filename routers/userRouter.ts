import "express-async-errors";
import {Router} from "express";
import {UserRecord} from "../records/user.record";


export const userRouter = Router();

userRouter
    .get('/', async (req, res) => {
        let logged;
        if (req.cookies.id) {
            logged = await UserRecord.findOneById(req.cookies.id)
        }
        res.json(logged ? req.cookies.id : false);
    })
    .get('/login/check/:login', async (req, res) => {
        const result = await UserRecord.loginValidation(req.params.login);
        res.json(result === "ok");
    })
    .post("/login", async (req, res) => {
        const {login, pwd} = req.body;
        const check = await UserRecord.checkPwd(login, pwd);
        if (check) {
            const user = await UserRecord.findOne(login);
            res.cookie("user", user.id);
            res.json(true)
        } else {
            res.json(false)
        }
    })
    .post('/', async (req, res) => {
        const newUser = new UserRecord(req.body);
        const id = await newUser.addUser();
        res.cookie('user', id);
        res.json(id);
    })
