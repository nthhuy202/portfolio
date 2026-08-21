import { Nav, Hero, About, FocusMarquee, Projects } from "@/features/portfolio/components";
import { getAllProjectsMeta } from "@/features/portfolio/utils/projects";
import { getExperience } from "@/features/portfolio/utils/experience";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const projects = getAllProjectsMeta(locale);
  const experience = getExperience(locale);

  return (
    <main id="top">
      <Nav />
      <Hero />
      <About />
      <FocusMarquee />
      <Projects projects={projects} />
      <section id="experience" style={{ height: "60vh" }}>
        <p>Experience</p>
      </section>
      <section id="contact" style={{ height: "60vh" }}>
        <p>Contact</p>
      </section>
    </main>
  );
}
