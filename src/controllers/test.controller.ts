import BaseController from "./base.controller";
import { ServiceController, ServiceMethod } from "../decorators/factory.decorators";
import { Request, Response } from "express-serve-static-core";

@ServiceController({ path: "/api" })
export default class TestController extends BaseController {

    @ServiceMethod({ method: "GET", path: "/test" })
    getTestResponse(req: Request, res: Response) {
        this.getDialogService()
            .addResponse({ message: "test" })
            .send(res);
    }
}
