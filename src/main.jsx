import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { projects, experience } from './data';
import './styles.css';

const Arrow = () => <span aria-hidden="true">↗</span>;
const Tags = ({ items }) => <div className="tags">{items.map(item => <span key={item}>{item}</span>)}</div>;

function WaveLab() {
  const [phase, setPhase] = useState(55);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (!playing) return;
    let frame; let previous;
    const tick = now => { if (previous) setTime(t => t + Math.min(now - previous, 50) / 900); previous = now; frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  const shift = phase / 100 * Math.PI * 2;
  const path = (kind, row = 0) => Array.from({ length: 181 }, (_, i) => {
    const x = i * 3.4; const a = x / 52 - time;
    const y = kind === 0 ? Math.sin(a) * 47 : kind === 1 ? Math.sin(a + shift) * 47 : (Math.sin(a + row * .065) + Math.sin(a + shift + row * .065)) * 43;
    return `${i ? 'L' : 'M'}${x.toFixed(2)},${(150 + y + row * 5).toFixed(2)}`;
  }).join(' ');
  return <div className="wave-lab">
    <div className="lab-top"><span><i /> A LITTLE PHYSICS, IN YOUR BROWSER</span><span>FIG. 01</span></div>
    <svg viewBox="0 0 620 350" role="img" aria-label="Wave superposition illustration. Adjust phase below to change the combined wave.">
      <defs><pattern id="grid" width="31" height="31" patternUnits="userSpaceOnUse"><path d="M 31 0 L 0 0 0 31" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".12"/></pattern></defs>
      <rect width="620" height="350" fill="url(#grid)" />
      <path d="M0 150H620" stroke="currentColor" opacity=".18" strokeDasharray="3 5" />
      <path d={path(0)} className="source-wave"/><path d={path(1)} className="source-wave second"/>
      {Array.from({ length: 19 }, (_, i) => <path key={i} d={path(2, i - 9)} fill="none" stroke="currentColor" strokeWidth={i === 9 ? 2 : 1} opacity={i === 9 ? 1 : .18 + i * .018} />)}
    </svg>
    <div className="lab-equation">y = sin(x) + sin(x + φ)<span>SUPERPOSITION</span></div>
    <div className="lab-controls"><button onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Pause wave animation' : 'Play wave animation'}>{playing ? 'Ⅱ' : '▷'}</button><label htmlFor="phase">Phase <span>φ</span></label><input id="phase" type="range" min="0" max="100" value={phase} onChange={e => setPhase(Number(e.target.value))} aria-valuetext={`${Math.round(phase * 3.6)} degrees`}/><output htmlFor="phase">{Math.round(phase * 3.6)}°</output></div>
    <p className="lab-hint">Move the slider. See what adds up.</p>
  </div>;
}

function ProjectArt({ type }) {
  return <svg className={`project-art ${type}`} viewBox="0 0 500 220" aria-hidden="true">
    {type === 'wave' && Array.from({ length: 14 }, (_, row) => <path key={row} d={Array.from({ length: 101 }, (_, i) => `${i ? 'L' : 'M'}${i * 5} ${110 + Math.sin(i / 10 + row * .12) * (30 + row * 3)}`).join(' ')} />)}
    {type === 'rocket' && <g transform="translate(250 110) rotate(35)"><ellipse rx="100" ry="65" strokeDasharray="3 7"/><ellipse rx="140" ry="95" opacity=".35"/><path d="M0 -65 Q-28 -32 -17 35 L17 35 Q28 -32 0 -65Z M-17 12L-35 40L-15 33 M17 12L35 40L15 33 M-9 45L0 78L9 45"/><circle cy="-13" r="9"/><path d="M-75 0H-44 M44 0H75 M0 -85V-72"/></g>}
    {type === 'chart' && <><path d="M55 35V185H450" opacity=".3"/>{[0,1,2,3,4,5,6,7].map((n) => <rect key={n} x={80 + n * 44} y={155 - [12,30,21,58,50,81,76,110][n]} width="21" height={[12,30,21,58,50,81,76,110][n] + 20} opacity=".25" fill="currentColor" stroke="none"/>)}<path d="M80 145L135 121L180 135L230 90L280 101L330 64L375 77L420 36" strokeWidth="2"/><circle cx="420" cy="36" r="5" fill="currentColor"/></>}
    {type === 'orbit' && <g transform="translate(250 110) rotate(-18)"><circle r="12" fill="currentColor"/>{[40,75,112,160].map((r, i) => <g key={r}><ellipse rx={r} ry={r * .53}/><circle cx={r * Math.cos(i * 2)} cy={r * .53 * Math.sin(i * 2)} r="5" fill="currentColor"/></g>)}</g>}
    {type === 'bars' && Array.from({length: 35}, (_, i) => { const h = 15 + Math.abs(Math.sin(i * .54) * Math.cos(i * .12)) * 130; return <rect key={i} x={60 + i * 11} y={110 - h / 2} width="4" height={h} rx="2" fill="currentColor" stroke="none"/>; })}
    {type === 'fractal' && Array.from({length: 160}, (_, i) => { const x = i % 20; const y = Math.floor(i / 20); return (Math.sin(x * 17 + y * 31) > -.25) && <rect key={i} x={92 + x * 16} y={47 + y * 16} width="12" height="12" fill="currentColor" opacity={.2 + ((x * y) % 7) / 10} stroke="none"/>; })}
  </svg>;
}

function ProjectDialog({ project, close }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} aria-label={project.name} onCancel={close} onClick={e => { if (e.target === ref.current) close(); }}><div className="dialog-content"><button className="close" onClick={close} aria-label="Close project details">×</button><span className="eyebrow">{project.type}</span><h2>{project.name}</h2><ProjectArt type={project.visual}/><p>{project.detail}</p><Tags items={project.tags}/><a className="text-link" href="https://github.com/Davvv24" target="_blank" rel="noreferrer">Explore my GitHub profile <Arrow/></a></div></dialog>;
}

function App() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [menu, setMenu] = useState(false);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header"><a href="#" className="wordmark" aria-label="Davide Rizzo home">dr<span>.</span></a><button className="menu-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="navigation">{menu ? 'Close −' : 'Menu +'}</button><nav id="navigation" className={menu ? 'open' : ''} aria-label="Main navigation">{[['work','Selected work'],['experience','Experience'],['about','About']].map(([id, title]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{title}</a>)}<a className="nav-contact" href="#contact" onClick={() => setMenu(false)}>Let’s talk <Arrow/></a></nav></header>
    <main id="main">
      <section className="hero container"><div className="hero-copy"><div className="eyebrow"><span className="status-dot"/> DAVIDE RIZZO</div><h1>Physics.<br/>Code.<br/><em>Curiosity.</em></h1><p>I’m Davide, a physics student who likes turning complex questions into things you can explore, test, and build.</p><p className="hero-sub">Scientific computing, machine learning, and the occasional rocket.</p><div className="hero-actions"><a href="#work" className="button primary">Explore my work <span aria-hidden="true">↓</span></a><a href="#experience" className="text-link">The experience behind it <Arrow/></a></div></div><WaveLab/><div className="hero-bottom"><span>PHYSICS MPhys · UNIVERSITY OF EDINBURGH</span><span>FROM MODELS TO THE REAL WORLD <span aria-hidden="true">↘</span></span></div></section>
      <div className="focus-strip"><div className="container"><span>Currently in my orbit</span><p>Payload software @ <strong>Endeavour</strong></p><span className="strip-plus">+</span><p>Physics @ <strong>Edinburgh</strong></p><span className="strip-plus">+</span><p>Ideas worth <strong>building</strong></p></div></div>
      <section id="work" className="section container"><div className="section-heading"><div><span className="eyebrow">01 / SELECTED WORK</span><h2>Curiosity, put to work<span>.</span></h2></div><p>A few explorations across physics,<br/>software, and the space in between.</p></div><div className="filters" role="group" aria-label="Filter projects">{['All', 'Physics', 'Engineering', 'Software'].map(category => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}{category === 'All' && <span>06</span>}</button>)}</div><p className="sr-only" role="status">{projects.filter(p => filter === 'All' || p.category === filter).length} projects shown</p><div className="project-grid">{projects.filter(p => filter === 'All' || p.category === filter).map((p) => <button className="project-card" key={p.id} onClick={() => setSelected(p)}><div className="art-wrap"><span className="art-label">{p.category.toUpperCase()}</span><ProjectArt type={p.visual}/><span className="project-open" aria-hidden="true">↗</span></div><div className="project-copy"><span className="eyebrow">{p.type}</span><h3>{p.name}</h3><p>{p.description}</p><Tags items={p.tags}/></div></button>)}</div><div className="work-footer"><span>Always learning. Usually making something.</span><a href="https://github.com/Davvv24" target="_blank" rel="noreferrer" className="text-link">More on GitHub <Arrow/></a></div></section>
      <section id="experience" className="experience-section"><div className="container experience-layout"><div className="experience-intro"><span className="eyebrow">02 / EXPERIENCE</span><h2>A little theory.<br/>A lot of practice.</h2><p>Research, real-world data, and teams building ambitious things.</p><a className="text-link" href="#education">View education <span aria-hidden="true">↓</span></a></div><div className="timeline">{experience.map(job => <article className="job" key={job.role}><div className="eyebrow">{job.date}</div><h3>{job.role}</h3><div className="job-place">{job.place}</div><p>{job.text}</p><Tags items={job.tags}/></article>)}</div></div></section>
      <section id="about" className="section container about-layout"><div><span className="eyebrow">03 / THE PERSON BEHIND THE CODE</span><h2>Driven by the<br/><em>“what if?”</em></h2><div className="about-mark" aria-hidden="true">∂<span>Ideas are better<br/>when you test them.</span></div></div><div className="about-copy"><p className="lead">I’m drawn to problems where physics and computation meet.</p><p>My work ranges from evaluating machine learning models on real-world data to simulating rockets and exploring the patterns hidden in physical systems. I enjoy the process as much as the result: asking a good question, building a model, and finding out where it holds up.</p><p>Sharing ideas matters to me, too. I tutor physics and computer science, help new recruits find their feet in rocketry software, and have presented research to both technical and student audiences.</p><div id="education" className="education"><span className="eyebrow">EDUCATION</span><h3>MPhys Physics</h3><p>University of Edinburgh · 2024–2028 (expected)</p></div></div></section>
      <section className="skills container" aria-label="Technical skills"><div><span className="eyebrow">MY TOOLKIT</span><h3>Tools for the question at hand.</h3></div><div><h4>Computation & ML</h4><p>Python · NumPy · SciPy · Pandas · PyTorch · TensorFlow · scikit-learn · Matplotlib</p></div><div><h4>Software & systems</h4><p>C/C++ · Java · Rust · SQL · C# / Unity · HTML / CSS / JavaScript · Shell</p></div><div><h4>Workflow & infrastructure</h4><p>Git · Linux · AWS S3 · Remote VMs / SSH · LaTeX · STM / ESP / Arduino</p></div></section>
      <section id="contact" className="contact-section"><div className="container"><span className="eyebrow">04 / WHAT’S NEXT?</span><h2>Have an interesting<br/>problem in mind?</h2><div className="contact-bottom"><p>For opportunities, collaborations,<br/>or a good conversation about an idea.</p><a href="mailto:drizzo.uk@gmail.com">Let’s talk <Arrow/></a></div><a className="email" href="mailto:drizzo.uk@gmail.com">drizzo.uk@gmail.com</a></div></section>
    </main><footer className="container"><a className="wordmark" href="#">dr<span>.</span></a><span>© {new Date().getFullYear()} Davide Rizzo</span><div><a href="https://github.com/Davvv24" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/drizzo-uk" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="#">Back to top ↑</a></div><small>Built with React, Vite, and curiosity.</small></footer>
    {selected && <ProjectDialog project={selected} close={() => setSelected(null)}/>}
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
