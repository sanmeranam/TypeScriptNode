
export default class AuthService {

    constructor() {
    }
    /**
     * Request validation with authToken or oauth2
     * @param req 
     * @param callback 
     */
    checkAuthorized(req: any, callback: Function): void {
        callback(true); //need to implement request validation
    }
}