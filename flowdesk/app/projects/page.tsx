import { prisma } from "@/lib/prisma";
import { FolderKanban, Calendar, Euro } from "lucide-react";
import { CreateProjectDialog } from "@/components/clients/CreateProjectDialog";
import { StatusBadge, ProjectStatus } from "@/components/dashboard/StatusBadge";

export default async function ProjectPage() {
    //join avec le client lié et récupération des projets
    const [projects, clients] = await Promise.all([
        prisma.project.findMany({
            include: {
                client: true, //equivalent join sql
            },
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.client.findMany({
            select:{
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            },
        }),
    ]);

    return (
        <main className="min-h-screen bg-gray-50/50 p-6 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/*en tete */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                        Projets
                        </h2>
                        <p className="text-sm text-gray-500">
                        Suivi de tes missions en cours et livrables.
                        </p>
                    </div>
                    <CreateProjectDialog clients={clients} />
                </div>

                {/**Liste */}
                {projects.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-white">
                        <FolderKanban className="mx-auto h-10 w-10 text-gray-400" />
                        <h3 className="mt-3 text-sm font-semibold text-gray-900">Aucun projet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                        Crée ton premier projet pour commencer à suivre ton activité.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between gap-4"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-medium text-gray-500 truncate">
                                            {project.client.name}
                                        </span>
                                        <StatusBadge status={project.status as ProjectStatus} />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        {project.name}
                                    </h3>
                                </div>

                                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-1 font-semibold text-gray-900">
                                        <Euro className="h-4 w-4 text-gray-400"/>
                                        <span>{project.budget.toLocaleString("fr-FR")}</span>
                                    </div>

                                    {project.deadline && (
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Calendar className="flex items-center gap-1.5 text-xs text-gray-500"/>
                                            <span>{new Date(project.deadline).toLocaleDateString("fr-FR")}</span>
                                        </div>        
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
            </div>
        </main>
    );
}