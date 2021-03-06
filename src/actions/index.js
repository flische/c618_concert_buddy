import types from './types';
import axios from 'axios';
import { formatPostData } from '../helpers'


export function get_concert_details(object) {
    var URL = 'https://app.ticketmaster.com/discovery/v2/events.jsonp?apikey=86PZJxmHAum8VeEH8EJBOCjucnSAVyGR';
    if (object.id) {
        URL = URL + '&id=' + object.id;
    }
    const resp = axios.get(URL);

    return {
        type: types.GET_CONCERT_DETAILS,
        payload: resp
    }
}

export async function get_user_details() {
    const dataToSend = {
        action: 'check_trips',
    }
    const params = formatPostData(dataToSend)
    const userTrips = await axios.post('api/access_users.php', params);
  if(!userTrips.data.data[0]) {
      return{
            type: types.GET_USER_DETAILS,
            payload: payload
        }
    }

    const id = userTrips.data.data[0].trip_id;
    
    var dataToSend2 = {
        tripID: id,
        action: 'check_going'
    }
    const params2 = formatPostData(dataToSend2);
    const going = await axios.post('api/access_users.php', params2)
    const whosgoing = going.data.data;
    const payload = {
        userTrips: userTrips,
        whosgoing: whosgoing
    };
    return {
        type: types.GET_USER_DETAILS,
        payload: payload
    }
}

export async function send_email_invites(emails) {
    const dataToSend = {
        emails: emails,
    }
    const params = JSON.stringify(dataToSend)
    const response = await axios.post('api/emailInviteFriends.php', params);
    return {
        type: types.SEND_INVITES,
        payload: response
    }
}

export async function create_trip(trip) {
    return {
        type: types.CREATE_TRIP,
        payload: response
    };
}

export async function delete_trip(id){
    
    var dataToSend = {
        tripID: id,
        action: 'delete_trip'
    }

    const params2 = formatPostData(dataToSend);
    const response = await axios.post('api/access_users.php', params2)

    return {
        type: types.DELETE_TRIP,
        payload: response
    };
   
}



export async function delete_responsibility(id){
      return {
        type: types.DELETE_RESPONSIBILITY
    }
}


export const signIn = credentials => async dispatch => {
    
    try {
        const { email, password } = credentials;

        const dataToSend = {
            email: email,
            password: password,
            action: "user_login"
        };
        const params = formatPostData(dataToSend);
       
        const response = await axios.post('api/handle_login.php', params);

        if (response.data.success) {
            dispatch({ type: types.SIGN_IN} );
    
        } else {
            dispatch({
                type: types.AUTH_ERROR,
                error: 'Invalid email and/or password'
            });
        }
    } catch (error) {
        dispatch({
            type: types.AUTH_ERROR,
            error: 'Invalid email and/or password'
        });
    }
}

export const signUp = credentials => async dispatch => {
    try {
        const { email, name,  password} = credentials;
        const dataToSend = {
            email: email,
            name: name,
            password: password, 
            action: 'add_user'
            };
        
        const params = formatPostData(dataToSend);
        const resp = await axios.post('api/handle_login.php', params );
        if (resp.data.success) {

            dispatch({ type: types.SIGN_UP} );
        } else {
            dispatch({
                type: types.AUTH_ERROR,
                error: resp.data.error
            });
        }

    } catch(error){
        dispatch({
            type: types.AUTH_ERROR,
            error: 'Error creating account'
        });
    }   
}

export async function signOut(){
const dataToSend = {
    action: 'user_logout'
};
const params = formatPostData(dataToSend);
    await axios.post('api/handle_login.php', params);
    localStorage.clear();
    return { type: types.SIGN_OUT };
};

export function resetError() {
    return {type: types.RESET_ERROR};
}