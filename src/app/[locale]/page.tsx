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
      <p style={{ padding: 40 }}>
        {projects.length} projects, {experience.length} experience entries loaded for locale &quot;{locale}&quot;.
      </p>
    </main>
  );
}
