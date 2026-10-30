import { useState, type ReactNode, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, LockKeyhole, AlertCircle } from 'lucide-react';
import { verifyAccessPassword } from './access.js';
import './access.css';

export default function AccessGate({ children }: { children: ReactNode }) {
  // No browser storage: a new page load always starts locked.
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Read the current business date on every attempt, including across midnight.
    if (verifyAccessPassword(password)) {
      setPassword('');
      setError(false);
      setVerified(true);
    } else {
      setError(true);
    }
  }

  if (verified) return children;

  return <main className="access-page">
    <section className="access-card" aria-labelledby="access-title">
      <span className="access-mark"><ArrowUpRight size={27}/></span>
      <h1 id="access-title">神马直播授权登录 Demo</h1>
      <p className="access-description">请输入访问密码，进入项目</p>
      <form onSubmit={submit} noValidate>
        <label htmlFor="access-password">访问密码</label>
        <div className={`access-input ${error ? 'invalid' : ''}`}>
          <LockKeyhole size={18}/>
          <input id="access-password" name="access-password" type="password" inputMode="numeric" autoComplete="off" autoFocus placeholder="请输入访问密码" value={password} aria-invalid={error} aria-describedby={error ? 'access-error' : undefined} onChange={event => { setPassword(event.target.value); setError(false); }}/>
        </div>
        {error && <div id="access-error" className="access-error" role="alert"><AlertCircle size={15}/>密码错误，请重新输入</div>}
        <button className="primary sports-button access-submit" type="submit">进入 Demo<ArrowRight size={17}/></button>
      </form>
    </section>
  </main>;
}
