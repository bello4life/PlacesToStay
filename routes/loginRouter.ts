import express from "express";
import db from "../db";
import LoginController from "../controllers/LoginController";

const loginRouter = express.Router();
const controller = new LoginController(db);

loginRouter.get("/login", controller.getCurrentUser.bind(controller));
loginRouter.post("/login", controller.login.bind(controller));
loginRouter.post("/logout", controller.logout.bind(controller));

export default loginRouter;
