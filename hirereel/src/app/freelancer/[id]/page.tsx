import { ProfileSection } from "@/components/sections/ProfileSection";

export default async function FreelancerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProfileSection id={id} />;
}
