import { ServiceController, ServiceInterceptor, ServiceMethod } from "../decorators/factory.decorators";

import BaseController from "./base.controller";
import { Request, Response } from "express-serve-static-core";

@ServiceController({ path: "/service/smalltalk", skill: "smalltalk" })
export default class SmalltalkController extends BaseController {

    @ServiceInterceptor
    authInterceptor(req: any, res: any, next: Function) {
        this.app.auth.checkAuthorized(req, (isValid: boolean) => {
            if (isValid) {
                next();
            } else {
                res.status(401).json("Unauthorized access.");
            }
        });
    }

    @ServiceMethod({ method: "POST", path: "/help" })
    getMeeting(req: Request, res: Response) {
        this.getDialogService()
            .addResponse({ message: "Helped" })
            .send(res);
    }

    @ServiceMethod({ method: "POST", path: "/greeting" })
    getGreeting(req: any, res: Response) {
        this.getDialogService()
            .addResponse({ message: "Hello" })
            .send(res);
    }

}
