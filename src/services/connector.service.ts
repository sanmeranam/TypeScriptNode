import * as request from "request-promise-native";


export default class ConnectorService {

    constructor(private systemDetails: any) { }

    async getList(url: string) {
        var options = new RequestOption(this.systemDetails);
        return await request.get(this.systemDetails.baseURL + url, options).then(result => JSON.parse(result));
    }
}

export class RequestOption {
    headers: any;
    body?: any;
    json?: boolean;
    auth?: any;
    resolveWithFullResponse?: boolean;
    private hasAccessToken: boolean;
    constructor(system: any) {
        this.headers = {
            "Accept": "application/json"
        };
        if (system.username && system.password) {
            this.auth = {
                user: system.username,
                pass: system.password,
                sendImmediately: false
            }
        } else if (system.accessToken) {
            this.headers["Authorization"] = "Bearer " + system.accessToken;
            this.hasAccessToken = true;
        }
    }


    addBody(body: any, isJSON: boolean) {
        this.body = body;
        if (isJSON)
            this.json = isJSON;
    }

    setCookie(cookies: any) {
        if (cookies)
            this.headers['cookie'] = cookies;
    }

    setToken(token: string) {
        if (!this.hasAccessToken && token)
            this.headers['X-Token'] = token;
    }
    setContentType(type: string) {
        this.headers['Content-Type'] = type;
    }
}