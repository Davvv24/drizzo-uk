import React from 'react';
import { createRoot } from 'react-dom/client';
import { projects, experience } from './data';
import './styles.css';

function App() {
  return (
    <div className="page">
      <a className="skip-link" href="#main">Skip to content</a>
      <header>
        <a className="site-name" href="#">drizzo.uk</a>
        <nav aria-label="Main navigation">
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="mailto:drizzo.uk@gmail.com">Email</a>
        </nav>
      </header>
      <main id="main">
        <section className="intro" aria-labelledby="name">
          <h1 id="name">Davide Rizzo</h1>
          <p className="subtitle">Physics student at the University of Edinburgh.</p>
          <p>I'm interested in scientific computing and machine learning. I mostly work in Python, with some C++ for embedded projects. This is a small collection of things I've worked on.</p>
          <div className="profile-links">
            <a href="https://github.com/Davvv24">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/drizzo-uk">LinkedIn ↗</a>
            <a href="mailto:drizzo.uk@gmail.com">drizzo.uk@gmail.com</a>
          </div>
        </section>
        <section id="projects" aria-labelledby="projects-heading">
          <h2 id="projects-heading">Projects</h2>
          <ul className="projects">
            {projects.map(project => (
              <li key={project.url}>
                <div className="project-title">
                  <h3><a href={project.url}>{project.name} <span aria-hidden="true">↗</span></a></h3>
                  <span className="project-type">{project.type}</span>
                </div>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
          <a className="more" href="https://github.com/Davvv24?tab=repositories">Other repositories on GitHub →</a>
        </section>
        <section id="experience" aria-labelledby="experience-heading">
          <h2 id="experience-heading">A bit of background</h2>
          <dl className="experience">
            {experience.map(item => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.description}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <footer>
        <span>Davide Rizzo</span>
        <a href="https://github.com/Davvv24/drizzo-uk">Source code</a>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
