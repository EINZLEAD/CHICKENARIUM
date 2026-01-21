// Chicken-themed minimal login behavior
document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('loginForm');
  const note = document.getElementById('note');
  const card = document.querySelector('.card');
  const toggleEye = document.getElementById('toggleEye');
  const pwd = document.getElementById('password');

  toggleEye.addEventListener('click', ()=>{
    if(pwd.type === 'password') pwd.type = 'text'; else pwd.type = 'password';
    toggleEye.textContent = pwd.type === 'password' ? '👁️' : '🙈';
  });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    note.textContent = '';
    const u = form.username.value.trim();
    const p = form.password.value.trim();
    if(!u || !p){
      note.textContent = 'Please enter username and password.';
      card.classList.remove('success');
      card.classList.add('shake');
      setTimeout(()=>card.classList.remove('shake'),450);
      return;
    }
    // Demo stub: accept any credentials and show success
    note.textContent = 'Welcome, ' + u + '! Redirecting...';
    card.classList.add('success');
    setTimeout(()=>{
      // replace with real auth flow / redirect
      note.textContent = 'You are now logged in (demo).';
    },600);
  });
});
