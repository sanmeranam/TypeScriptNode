import * as express from 'express'
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import * as basicAuth from 'express-basic-auth'
import IConfig from './models/config.model';
import { readFileSync } from 'fs';
import { join } from 'path';
import AuthService from './services/auth.service';
import TestController from './controllers/test.controller';
import SmalltalkController from './controllers/smalltalk.controller';

export class App {
    public express: any;
    public appConfig: IConfig;
    public skills: any;
    public auth: AuthService;

    constructor() {
        this.express = express();
        this.init();
    }

    private init() {
        this.express.use(bodyParser.json())
        this.express.use((req,res,next)=>{
            next();
        })
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cookieParser());
        this.appConfig = JSON.parse(readFileSync(join(__dirname, "../config/app.config.json")).toString()) as IConfig;

        if (process.env.app_config) {
            this.appConfig = JSON.parse(process.env.app_config);
        }

        this.skills = JSON.parse(readFileSync(join(__dirname, "../config/skills.json")).toString());
        this.auth = new AuthService();
        if (process.env.secure_user) {
            let SecureUser = JSON.parse(process.env.secure_user);
            this.express.use(basicAuth({ users: SecureUser }));
        }

    }


    public addController(oCtrl: any) {
        oCtrl.setApp(this);
        oCtrl.setConfig(this.appConfig);
        if (this.skills[oCtrl._skill_name]) {
            oCtrl.skill = this.skills[oCtrl._skill_name];
        }
        if (oCtrl._interceptor) {
            this.express.use(oCtrl._route_path, oCtrl[oCtrl._interceptor].bind(oCtrl), oCtrl._router);
        } else {
            this.express.use(oCtrl._route_path, oCtrl._router);
        }

    }
}

const oApp = new App();

/**
 * Register your controller to App.
 */
oApp.addController(new SmalltalkController());
oApp.addController(new TestController());

export default oApp.express;