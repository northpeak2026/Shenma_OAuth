import { useEffect, useState, type CSSProperties } from 'react';
import { UserRound, LockKeyhole, AlertCircle } from 'lucide-react';

export function LoginForm({ error, onLogin, onCancel }: { error: string; onLogin: (account: string, password: string) => void; onCancel: () => void }) {
 const [account,setAccount]=useState('harry');
 const [password,setPassword]=useState('123456');
 const [showPassword,setShowPassword]=useState(false);
 return (<form onSubmit={e=>{e.preventDefault();onLogin(account,password)}}><label htmlFor="account">账号</label><div className="input-wrap"><UserRound size={17}/><input id="account" name="username" autoComplete="username" placeholder="请输入账号" required value={account} onChange={e=>setAccount(e.target.value)}/></div><label htmlFor="password">密码</label><div className="input-wrap"><LockKeyhole size={17}/><input id="password" name="password" type={showPassword?'text':'password'} autoComplete="current-password" placeholder="请输入密码" required value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" className="show-password" aria-label={showPassword?'隐藏密码':'显示密码'} onClick={()=>setShowPassword(!showPassword)}>{showPassword?'隐藏':'显示'}</button></div>{error&&<div className="feedback error" role="alert"><AlertCircle size={16}/>{error}</div>}<button className="primary live-button" type="submit">登录并继续</button><button className="primary secondary login-cancel" type="button" onClick={onCancel}>取消并返回</button></form>);
}

export function ResultFeedback({ result }: { result: string }) {
 const [visible,setVisible]=useState(true);
 useEffect(()=>{ const timer=setTimeout(()=>setVisible(false),result==='success'?3000:4500); return ()=>clearTimeout(timer); },[result]);
 if(!visible) return null;
 if(result==='success') return <div className="confetti" aria-hidden="true">{Array.from({length:54},(_,i)=><i key={i} style={{'--x':`${(i*37)%100}%`, '--drift':`${(i%2?1:-1)*(25+i%9*12)}px`, '--delay':`${i%9*65}ms`, '--rotation':`${(i%2?1:-1)*(200+i*13)}deg`, '--color':['#2f8c6a','#e8b94f','#ed8058','#7ba6c5','#b998cc'][i%5]} as CSSProperties}/>)}</div>;
 const failed=result==='failed';
 return <div className={`result-toast ${failed?'failed':'cancelled'}`} role={failed?'alert':'status'}><AlertCircle size={18}/><span>{failed?'授权失败，请重新尝试':'已取消授权，未登录神马体育'}</span><button type="button" aria-label="关闭提示" onClick={()=>setVisible(false)}>×</button></div>;
}
