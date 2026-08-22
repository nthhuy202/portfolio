import { techStack } from "@/features/portfolio/constants/tech-stack";

export function TechStack() {
  return (
    <div className="grid grid-cols-4 gap-3 mt-4 max-[760px]:grid-cols-2">
      {techStack.map((tech) => (
        <div className="flex items-center gap-2.5 py-3 px-3.5 border border-line rounded-lg bg-bg-raised" key={tech.name}>
          <span className="w-8 h-8 rounded-[7px] flex-none flex items-center justify-center font-mono font-bold text-[0.74rem]" style={{ background: tech.bg, color: tech.fg }}>
            {tech.short}
          </span>
          <span className="font-mono text-[0.86rem] tracking-[0.02em] uppercase">{tech.name}</span>
        </div>
      ))}
    </div>
  );
}
