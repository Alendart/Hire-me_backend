import "express-async-errors";
import {Router} from "express";
import {UserRecord} from "../records/user.record";


export const userRouter = Router();

userRouter
    .get('/', async (req, res) => {
        let userInfo = null;
        if (req.cookies.user) {
            userInfo = await UserRecord.findOneById(req.cookies.user)
            if (!userInfo) {
                res.clearCookie("user");
            }
        }
        res.json(userInfo ?? null);
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
            res.cookie("user",user.id,{
                httpOnly: true,
            });
            res.json(user.id)
        } else {
            res.json(false)
        }
    })
    .post('/',async (req,res) => {
        const newUser = new UserRecord(req.body);
        const id = await newUser.addUser();

        res.json(id);
    })
    .get('/logout',(req,res) => {
        res.clearCookie("user");
        res.status(200);
        res.end();
    })
