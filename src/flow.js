export const initialState = { scenario: 'H5', initialLoggedIn: false, wakeFails: false, loggedIn: false, stage: 'home', fallback: false, result: null, error: '' };
export function reducer(state, action) {
  const reset = (patch = {}) => { const next = { ...state, ...patch }; return { ...next, loggedIn: next.initialLoggedIn, stage: 'home', fallback: false, result: null, error: '' }; };
  switch(action.type) {
    case 'scenario': return reset({scenario: action.value});
    case 'session': return reset({initialLoggedIn: action.value});
    case 'wake': return reset({wakeFails: action.value});
    case 'reset': return reset();
    case 'start': return {...state, result: null, error: '', stage: state.scenario === 'App' ? 'launching' : state.loggedIn ? 'consent' : 'login'};
    case 'launched': if(state.stage !== 'launching') return state; return {...state, stage: state.wakeFails ? 'failure' : state.loggedIn ? 'consent' : 'login'};
    case 'fallback': return {...state, fallback: true, stage: state.loggedIn ? 'consent' : 'login'};
    case 'login': return action.account === 'harry' && action.password === '123456' ? {...state, loggedIn: true, stage: 'consent', error: ''} : {...state, error: '账号或密码错误，请检查后重试。'};
    case 'cancel': return {...state, stage: 'home', fallback: false, result: 'cancelled', error: ''};
    case 'authorize': return state.stage === 'consent' && state.loggedIn ? {...state, stage: 'home', fallback: false, result: action.failed ? 'failed' : 'success', error: ''} : state;
    default: return state;
  }
}

// Sample once in the click handler, keeping the reducer deterministic under StrictMode.
export function createAuthorizationAction(random = Math.random) {
  return { type: 'authorize', failed: random() < 0.3 };
}
