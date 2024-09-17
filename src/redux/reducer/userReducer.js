
import { CREATE_USER, IS_SEARCH_USER, IS_UN_SEARCH_USER, OFF_SEARCH, ON_SEARCH } from '../action/userAction'
import { LOGIN } from '../action/userAction'
import { LOGOUT } from '../action/userAction'

const INITIAL_STATE = {
    user: {
        token: '',
        userId: ''
    },
    isAuthenticated: false,
}
const userReducer = (state = INITIAL_STATE, action) =>{
    switch (action.type) {
        case CREATE_USER:
            return {
                ...state,
                user: {
                    token: action?.payload?.token,
                    userId: action?.payload?.userid
                },
                isAuthenticated : true
            }
        case LOGIN:
            return {
                ...state,
                user: {
                    token: action?.payload?.token,
                    userId: action?.payload?.userid
                },
                isAuthenticated : true
            }
        case LOGOUT:
            return {
                ...state,
                user: {
                    token: "",
                    userId: ""
                },
                isAuthenticated : false
            }
        default: return state;
    }
}

export default userReducer;