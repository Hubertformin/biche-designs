import {shallowEqual, useSelector} from "react-redux";

export const useReduxState = () => {
    return useSelector(
        (state => ({
            cart: state
        })),
        shallowEqual
    )
};