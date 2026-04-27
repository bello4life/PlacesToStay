import express from 'express';
import db from '../db';
import BookingController from '../controllers/BookingController';

const bookingRouter = express.Router();
const controller = new BookingController(db);

bookingRouter.post('/book', controller.book.bind(controller));

export default bookingRouter;
