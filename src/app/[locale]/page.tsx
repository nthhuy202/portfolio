import { HomePage } from "@/features/portfolio/pages/home-page";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <HomePage locale={locale} />;
}
