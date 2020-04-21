import * as express from "express";
import * as uuid from "uuid";
import {Request, Response} from "express";

export const partyRouter = express.Router();

/**
 * Create a new party
 */
partyRouter.post("/", async (req: Request, res: Response) => {
    try {
        res.status(201).send(uuid.v4());
    } catch (e) {
        res.status(500).send(e.message);
    }
});