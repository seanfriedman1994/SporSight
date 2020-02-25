import {AUTHENTICATE, LOGOUT, SET_AUTOLOGIN_ATTEMPT} from '../actions/auth';

const initialState = {
    token: null,
    userId: null,
    autoLoginAttempt: false
};

export default (state = initialState, action) => {
    switch(action.type) {
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId,
                didTryAutoLogin: true
            };
        case SET_AUTOLOGIN_ATTEMPT:
            return {
                ...state,
                autoLoginAttempt: true
            };
        case LOGOUT:
            return {
                ...initialState,
                didTryAutoLogin: true
            };
        default:
            return state;
    }
}

