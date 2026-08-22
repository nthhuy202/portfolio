import { techStack } from "@/features/portfolio/constants/tech-stack";

export function TechStack() {
  return (
    <div className="tech-grid">
      {techStack.map((tech) => (
        <div className="tech-badge" key={tech.name}>
          <span className="tech-glyph" style={{ background: tech.bg, color: tech.fg }}>
            <tech.Icon className="tech-icon" aria-hidden="true" />
          </span>
          <span className="tech-name">{tech.name}</span>
        </div>
      ))}
    </div>
  );
}
