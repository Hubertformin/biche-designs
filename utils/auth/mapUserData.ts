import {UserModel} from "../../models/user.model";

export const mapUserData = (user): UserModel => {
    const { uid, displayName, email, photoURL } = user;
    return {
        uid,
        email,
        displayName,
        photoURL,
    }
};
