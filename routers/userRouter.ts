import "express-async-errors";
import {Router} from "express";
import {UserRecord} from "../records/user.record";


export const userRouter = Router();

userRouter
    .get('/login/check', async (req, res) => {
        const result = await UserRecord.loginValidation(req.body.login);
        if (result === "ok") {
            res.json({loginFree: true})
        } else {
            res.json({loginFree: false})
        }
    })
    .get("/login", async (req, res) => {
        const {login, pwd} = req.body;
        const check = await UserRecord.checkPwd(login, pwd);
        if (check) {
            const user = await UserRecord.findOne(login);
            res.cookie("user", user.id);
            res.json({loggedIn: true})
        } else {
            res.json({loggedIn: false})
        }
    })