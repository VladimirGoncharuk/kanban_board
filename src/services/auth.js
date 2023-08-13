import {appState} from "../app";
import {User} from "../models/User";
import {Admin} from "../models/Admin";

export const authUser = function (login, password) {
    if (login != "Admin") {
        const user = new User(login, password);
        if (!user.hasAccess) 
            return false;
        appState.currentUser = user;
        return true;
    } else {
        const admin = new Admin(login, password);
        if (!admin.hasAccess) 
            return false;
        appState.currentUser = admin;
        return true;
    }

};
