import { AsyncStorage } from 'react-native';

export function UserExists(userGuid){
  var user = GetUser(userGuid);

  if(user)
  {
    return false;
  }
  else
  {
    return true;
  }
}

export async function GetUser(userGuid){

  let userResponse = await fetch(`https://sporsightapi.azurewebsites.net/Users`, {
    method: 'GET',
    headers: {
      'Host': 'sporsightapi.azurewebsites.net',
      'Content-Type': 'application/json'
    }
  })
  .then((response) => response.json())
  .then((response) => {
    userResponse = response;
  })
  .catch((error) => {
    console.log(error);
  });


  let user = userResponse;
  if(user)
  {
    console.log(user);
  }
  else{
    console.log("null");
  }
  
  return user;
}