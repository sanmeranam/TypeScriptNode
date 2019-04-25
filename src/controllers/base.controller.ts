import { App } from "../app";
import IConfig from "../models/config.model";
import ConnectorService from "../services/connector.service";
import DialogService from "../services/dialog.service";

export default class BaseController {
    protected app: App;
    protected config: IConfig;
    private oSkill: any;
    public _skill_name: string;
    public _route_path: string;
    public _router: any;
    public _interceptor: string;
    public _restrict: true;


    public setApp(app: App) {
        this.app = app;
    }

    public setConfig(config: IConfig) {
        this.config = config;
    }

    public set skill(v) {
        this.oSkill = v;
    }
    public get skill() {
        return this.oSkill;
    }

    protected createConnection(settings: any) {
        return new ConnectorService(settings);
    }


    protected getDialogService() {
        return new DialogService();
    }

}