import { DollarSign, FolderKanban, Users, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import Link from "next/link";
import { StatusBadge, ProjectStatus } from "@/components/dashboard/StatusBadge";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  //recup des données depuis postgre
  const [
    totalClients,
    activeProjectsCount,
    budgetStats,
    recentProjects,
  ] = await Promise.all([ 
    prisma.client.count(),

    prisma.project.count({
      where: { status: "in_progress" },
    }),

    prisma.project.aggregate({
      _sum: {
        budget: true,
      },
    }),

    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: "desc"},
      include: {
        client: {
          select: { name: true},
        },
      },
    }),
  ]);

  const totalBudget = budgetStats._sum.budget ?? 0;

  const stats = [
    {
      title: "Chiffre d'affaires cumulé",
      value: `${totalBudget.toLocaleString("fr-FR")} €`,
      description: "Basé sur les budgets signés",
      icon: DollarSign,
    },
    {
      title: "Projets en cours",
      value: activeProjectsCount.toString(),
      description: "Missions actives",
      icon: FolderKanban,
    },
    {
      title: "Clients actifs",
      value: totalClients.toString(),
      description: "Entreprises et contacts",
      icon: Users,
    },
    {
      title: "Temps moyen / mission",
      value: "Est. 3 sem.",
      description: "Calcul indicatif",
      icon: Clock,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Tableau de bord
            </h2>
            <p className="text-sm text-gray-500">
              Vue d&apos;ensemble en temps réel de ton activité freelance.
            </p>
          </div>
          <Link href="/projects">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              + Nouveau projet
            </Button>
          </Link>
        </div>

        {/* Grille de statistiques connectée à la BDD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item) => (
            <StatCard
              key={item.title}
              title={item.title}
              value={item.value}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>

        {/* Section Projets récents */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Projets récents</h3>
              <p className="text-xs text-gray-500">Derniers dossiers enregistrés</p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Voir tout
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              Aucun projet pour le moment.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">{project.name}</span>
                      <StatusBadge status={project.status as ProjectStatus} />
                    </div>
                    <p className="text-xs text-gray-500">
                      Client : {project.client.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-sm">
                    <div className="text-left sm:text-right">
                      <span className="block font-semibold text-gray-900">
                        {project.budget.toLocaleString("fr-FR")} €
                      </span>
                      {project.deadline && (
                        <span className="block text-xs text-gray-500">
                          Échéance : {new Date(project.deadline).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}