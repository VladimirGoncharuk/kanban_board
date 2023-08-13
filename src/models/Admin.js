import {BaseModel} from "./BaseModel";
import {getFromStorage, addToStorage} from "../utils";

export class Admin extends BaseModel {
    constructor(login, password) {
        super();
        this.login = login;
        this.password = password;
        this.storageKey = 'admin';
    }
    get hasAccess() {
        let admins = getFromStorage(this.storageKey);
        if (admins.length == 0) 
            return false;
        for (let admin of admins) {
            if (admin.login == this.login && admin.password == this.password) 
                return true;
            }
        return false;
    }
    static save(admin) {
        try {
            addToStorage(admin, admin.storageKey);
            return true;
        } catch (e) {
            throw new Error(e);
        }
    }
}
