import { Nav, Hero, About, FocusMarquee, Projects, Experience, Contact, Footer } from "@/features/portfolio/components";
import { getAllProjectsMeta } from "@/features/portfolio/utils/projects";
import { getExperience } from "@/features/portfolio/utils/experience";

interface HomePageProps {
  locale: string;
}

export async function HomePage({ locale }: HomePageProps) {
  const projects = getAllProjectsMeta(locale);
  const experience = getExperience(locale);

  return (
    <main id="top">
      <Nav />
      <Hero />
      <About />
      <FocusMarquee />
      <Projects projects={projects} />
      <Experience entries={experience} />
      <Contact />
      <Footer />
    </main>
  );
}
