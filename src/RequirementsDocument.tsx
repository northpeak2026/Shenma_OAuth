import { useEffect, useState } from 'react';
import { AlertCircle, LoaderCircle, RotateCcw, BookOpen } from 'lucide-react';
import { renderRequirements, type DocumentHeading } from './markdown';
import './document.css';
import { loadRequirements } from './loadRequirements.js';

type DocumentState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; html: string; headings: DocumentHeading[] };

export default function RequirementsDocument() {
  const [state, setState] = useState<DocumentState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    loadRequirements()
      .then(source => {
        const document = renderRequirements(source);
        if (!cancelled) setState({ status: 'ready', ...document });
      })
      .catch(() => { if (!cancelled) setState({ status: 'error' }); });
    return () => { cancelled = true; };
  }, [attempt]);

  return <main className="document-main" aria-label="需求文档">
    {state.status === 'loading' && <div className="document-message" role="status"><LoaderCircle className="spin" size={24}/><p>正在加载需求文档…</p></div>}
    {state.status === 'error' && <div className="document-message" role="alert"><AlertCircle size={26}/><h2>需求文档加载失败</h2><p>请检查连接后重试，或查看项目中的 docs/REQUIREMENTS.md。</p><button className="secondary" onClick={() => setAttempt(value => value + 1)}><RotateCcw size={14}/>重新加载</button></div>}
    {state.status === 'ready' && <div className="document-layout">
      <nav className="document-toc" aria-label="需求章节目录"><div className="document-toc-label"><BookOpen size={15}/>需求目录</div>{state.headings.filter(heading => heading.depth === 2).map(heading => <a key={heading.id} href={`#${heading.id}`} onClick={event => {
        event.preventDefault();
        const target = document.getElementById(heading.id);
        target?.scrollIntoView({ block: 'start' });
        target?.focus({ preventScroll: true });
      }}>{heading.text}</a>)}</nav>
      <div className="document-scroll" tabIndex={0} aria-label="完整需求正文"><article className="requirements-markdown" dangerouslySetInnerHTML={{ __html: state.html }}/></div>
    </div>}
  </main>;
}
