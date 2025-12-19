import { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});


console.log('Status:', res.status);
const text = await res.text();
console.log('Raw response:', text);

let data;
try {
  data = JSON.parse(text);
} catch {
  alert('Server did not return JSON. Status: ' + res.status);
  return;
}


      alert('Registration successful! You can login now.');
    } catch (err) {
  console.error('Register error:', err);
  alert('Something went wrong: ' + (err.message || 'unknown error'));
}

  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label><br />
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Email</label><br />
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>

        <div>
          <label>Password</label><br />
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>

        <button type="submit">Create account</button>
      </form>
    </div>
  );
}
