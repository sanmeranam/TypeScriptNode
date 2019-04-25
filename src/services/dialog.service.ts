export default class DialogService {
    private responses: any[];
    constructor() {
    }

    addResponse(response: any): DialogService {
        this.responses.push(response);
        return this;
    }

    send(res: any) {
        res.json({
            data: this.responses
        });
    }
}