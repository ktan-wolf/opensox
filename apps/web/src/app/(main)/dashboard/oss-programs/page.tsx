import { loadAllPrograms, getAllTags } from "@/data/oss-programs";
import ProgramsList from "./ProgramsList";

export const revalidate = 3600;

export default async function Page() {
  // Load programs asynchronously - happens on server, not blocking client
  await loadAllPrograms();
  const [programs, tags] = await Promise.all([loadAllPrograms(), getAllTags()]);

  return <ProgramsList programs={programs} tags={tags} />;
}
