import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import firebase from '../../firebase/clientApp';
import 'firebase/auth'
import {
    removeUserCookie,
    setUserCookie,
    getUserFromCookie,
} from './userCookies'
import { mapUserData } from './mapUserData';
import {UserModel} from "../../models/user.model";


const useUser = () => {
    const [user, setUser] = useState<UserModel>(null);
    const router = useRouter();

    const logout = async () => {
        return firebase
            .auth()
            .signOut()
            .then(() => {
                // Sign-out successful.
                router.push('/auth/login')
            })
            .catch((e) => {
                console.error(e)
            })
    };

    useEffect(() => {
        // Firebase updates the id token every hour, this
        // makes sure the react state and the cookie are
        // both kept up to date
        const cancelAuthListener = firebase
            .auth()
            .onIdTokenChanged(async (user) => {
                if (user) {
                    const {claims, token} = await firebase.auth().currentUser.getIdTokenResult();
                    const userData = mapUserData(user);
                    setUserCookie(userData);
                    setUser({...userData, claims, token});
                } else {
                    removeUserCookie();
                    setUser(null);
                }
            });

        const userFromCookie = getUserFromCookie();
        if (!userFromCookie) {
            // router.push('/');
            return
        }
        setUser(userFromCookie);

        return () => {
            cancelAuthListener();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { user, logout }
};

export { useUser }
