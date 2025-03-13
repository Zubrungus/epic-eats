import { useState, type FormEvent, type ChangeEvent } from 'react';

import Auth from '../utils/auth';
import { signUp } from '../api/signUpAPI';
import type { UserLogin } from '../interfaces/UserLogin';

const SignUp = (_props:any) => {
  const [signUpData, setSignUpData] = useState<UserLogin>({
    username: '',
    password: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSignUpData({
      ...signUpData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await signUp(signUpData);
      Auth.login(data.token);
      localStorage.setItem('userId', data.userId);
    } catch (err) {
      console.error('Failed to login', err);
    }
  };

  return (
    <div className='form-container'>
      <form className='form login-form' onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div className='form-group'>
          <input
            placeholder='Username'
            className='form-input'
            type='text'
            name='username'
            value={signUpData.username || ''}
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <input
            placeholder='Password'
            className='form-input'
            type='password'
            name='password'
            value={signUpData.password || ''}
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <button className='btn btn-primary' type='submit'>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
