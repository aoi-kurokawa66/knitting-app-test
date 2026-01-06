import { notFound } from "next/navigation";
import { getProjectById } from "../../../lib/db";
import EditProjectForm from "../../../components/EditProjectForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const projectId = parseInt(id, 10);

  if (isNaN(projectId)) {
    notFound();
  }

  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return <EditProjectForm project={project} />;
}

