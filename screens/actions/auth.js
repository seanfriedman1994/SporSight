import { AsyncStorage } from 'react-native';
import {CLIENT_ID, TENANT_ID} from 'react-native-dotenv';
import { AuthSession } from 'expo';
import { openAuthSession } from 'azure-ad-graph-expo';

export const AUTHENTICATE = 'ATHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_AUTOLOGIN_ATTEMPT = 'SET_AUTOLOGIN_ATTEMPT'

const azureAdAppProps = {
  clientId: CLIENT_ID,
  tenantId: TENANT_ID,
  scope: 'user.read',
  redirectUrl: AuthSession.getRedirectUrl()
};

export const setAutoLoginAttempt = () => {
    return { type: SET_AUTOLOGIN_ATTEMPT };
};

export const authenticate = (userId, displayName, token, refreshToken, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({ type: AUTHENTICATE, userId: userId, displayName: displayName,
           token: token, refreshToken: refreshToken,});
    };
};

export const loginAsync = async () => {
    return async dispatch => {

      let response;

      try
      {
        response = await openAuthSession(azureAdAppProps);
      }
      catch(err)
      {
        let message;
        if(err.error)
        {
          message = err.error.message;
        }
        else
        {
          message = 'An unkown error occured.'
        }

        throw new Error(message);
      }
  
      try
      {
        const resData =  response;
        dispatch(
          authenticate(
            resData.userId,
            resData.displayName,
            resData.token,
            resData.refreshToken,
            parseInt(resData.expiresIn) * 1000
          )
        );
        const expirationDate = new Date(
          new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        saveDataToStorage(resData.userId, resData.displayName, resData.token,
          resData.refreshToken, expirationDate);
        }
      catch(err)
      {
        let message;
        if(err.error)
        {
          message = err.error.message;
        }
        else
        {
          message = 'An unkown error occured.'
        }

        throw new Error(message);
      }
      
    };
  };
  
  export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
  };
  
  const clearLogoutTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };
  
  const setLogoutTimer = expirationTime => {
    return dispatch => {
      timer = setTimeout(() => {
        dispatch(logout());
      }, expirationTime);
    };
  };
  
  const saveDataToStorage = (userId, displayName, token, refreshToken, expirationDate) => {
    AsyncStorage.setItem(
      'userData',
      JSON.stringify({
        userId: userId,
        displayName : displayName,
        token: token,
        refreshToken: refreshToken,
        expiryDate: expirationDate.toISOString()
      })
    );
  };
