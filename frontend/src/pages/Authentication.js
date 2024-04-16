import AuthForm from '../components/AuthForm';
import { json, redirect } from 'react-router-dom';

function AuthenticationPage() {
  return <AuthForm />;
}
export default AuthenticationPage;

export async function action({ request }) {
  // built-in URL constructor, which is provided by the browser then access the searchParams object

  //The searchParams object is part of the URL API
  const searchParams = new URL(request.url).searchParams;

  // get is a method available in data
  const mode = searchParams.get('mode') || 'login';
  if (mode !== 'login' && mode !== 'signup') {
    throw json({ message: 'Unsupported mode' }, { status: 422 });
  }
  // The formData() method comes from the Fetch API
  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    password: data.get('password'),
  };

  const response = await fetch('http://localhost:8080/' + mode, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });
  if (response.status === 422 || response.status === 401) {
    return response;
  }
  if (!response.ok) {
    // json is being called to create a JSON response.
    throw json({ message: 'Could not authenticate user' }, { status: 500 });
  }
  const resData = await response.json();
  const token = resData.token;
  localStorage.setItem('token', token);
console.log(token)

  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem('expiration', expiration.toISOString);

  return redirect('/');
}
