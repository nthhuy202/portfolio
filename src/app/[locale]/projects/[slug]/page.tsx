import {
  ProjectCaseStudyPage,
  generateProjectMetadata,
  generateProjectStaticParams,
} from "@/features/portfolio/pages/project-case-study-page";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const generateStaticParams = generateProjectStaticParams;
export const generateMetadata = generateProjectMetadata;

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;

  return <ProjectCaseStudyPage locale={locale} slug={slug} />;
}
