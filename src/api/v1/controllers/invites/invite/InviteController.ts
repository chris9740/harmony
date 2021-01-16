import { NextFunction, Request, Response } from "express";
import Member from "../../../../../models/member";
import BaseController from "../../BaseController";
import GenericError from "../../../../../errors/GenericError";
import HttpStatusCode from "../../../../../interfaces/HttpStatusCode";

class InviteController extends BaseController {
    public static async getInvite(req: Request, res: Response) {
        const invite = req.bus.invite;

        res.send({ invite });
    }

    public static async useInvite(req: Request, res: Response, next: NextFunction) {
        const invite = req.bus.invite;
        const member = await Member.findOne({ server: invite.server, user: req.user.id });

        if (member) {
            return next(new GenericError("You're already in this server").setHttpStatusCode(HttpStatusCode.CONFLICT));
        }

        const newMember = new Member({
            server: invite.server,
            user: req.user.id
        });

        try {
            await newMember.save();
        } catch (error) {
            next(error);
        }

        return res.status(HttpStatusCode.CREATED).send();
    }
}

export default InviteController;