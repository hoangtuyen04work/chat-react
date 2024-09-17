import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { login } from '../services/apiService'
import {useDispatch, useSelector} from "react-redux";
import { doLogin } from '../redux/action/userAction';

const Login = ({onSubmitt}) => {
    const [userid, setUserid] = useState(useSelector(state => state.user.userId));
    const [password, setPassword] = useState('');
    const [ok, setOk] = useState(true);
    const dispatch = useDispatch();
    const [rePassword, setRePassword] = useState("");
    const handleOnChangeUserId = (event) => {
        setUserid(event.target.value);
    }
    const handleOnChangePassword = (event) => {
        setPassword(event.target.value);
    }
    const handleLoginSubmit = async () => {
        let data = await login(userid, "12312312");
        if (data.ok === true) {
            dispatch(doLogin(data));
            onSubmitt();
        }
    }
    const handleOnChangeRePassword = (event) => {
        setRePassword(event.target.value);
    }
    const handleOnSignup = (event) => {
        onSubmitt();
    }
    const handleOnSwitch = () => {
        setOk(prev => !prev);
    }
    return (
        <div className="body">
            {ok ?
                <div className="login-form">
                    <div className="form">
                        <input className="userid-form" placeholder='userId' type="test" value={userid} onChange={handleOnChangeUserId} />
                        <input className="password-form" placeholder='password' type="password" onChange={handleOnChangePassword} />
                    </div>
                    <button className="login" onClick={handleLoginSubmit}>Login</button>
                    <button className="switch-btn" onClick={handleOnSwitch}>Create new account</button>
                </div>
                :
                <div className="signup-form">
                    <div className="form">
                        <input className="userid-form" placeholder='UserId' type="text" value={userid} onChange={handleOnChangeUserId} />
                        <input className="password-form" placeholder='Password' type="password" onChange={handleOnChangePassword} />
                        <input className="re-password-form" placeholder='Confirm your password' type="password" onChange={handleOnChangeRePassword} />
                    </div>
                    <button className="login" onClick={handleOnSignup}>Signup</button>
                    <button className="switch-btn" onClick={handleOnSwitch}>Login now</button>
                </div>
            }
        </div>
    )
}

export default Login;