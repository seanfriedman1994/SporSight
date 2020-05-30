import { AUTHENTICATE, LOGOUT, SET_AUTOLOGIN_ATTEMPT } from '../actions/auth';

const initialState = {
	userId: null,
	displayName: null,
	token: null,
	refreshToken: null,
	autoLoginAttempt: false,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case AUTHENTICATE:
			return {
				userId: action.userId,
				displayName: action.displayName,
				token: action.token,
				refreshToken: action.refreshToken,
				autoLoginAttempt: true,
			};
		case SET_AUTOLOGIN_ATTEMPT:
			return {
				...state,
				autoLoginAttempt: true,
			};
		case LOGOUT:
			return {
				...initialState,
				autoLoginAttempt: true,
			};
		default:
			return state;
	}
};
