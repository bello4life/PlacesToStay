import express from "express";
import db from "../db";
import AccommodationController from "../controllers/AccommodationController";

const accommodationRouter = express.Router();
const controller = new AccommodationController(db);

accommodationRouter.get(
  "/:location",
  controller.findByLocation.bind(controller),
);
accommodationRouter.get(
  "/:location/:type",
  controller.findByLocationAndType.bind(controller),
);

export default accommodationRouter;
