import { prisma } from "@/lib/prisma";
import { Users, Mail, Building2 } from "lucide-react";
import { CreateClientDialog } from "@/components/clients/CreateClientDialog";

export default async function ClientsPage() {
    //lecture directe depuis postgre SQL
    const clients = await prisma.client.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return(
        <main className="min-h-screen bg-gray-50/50 p-6 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {//en tete 
                }
                <div className="flex flex-col sm:flex-row sm:tiems-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Clients
                        </h2>
                        <p className="text-sm text-gray-500">
                            Gérez vos contacts et entreprises partenaires.
                        </p>
                    </div>
                    <CreateClientDialog />
                </div>

                {//liste ou message vide
                }
                {clients.length === 0 ? (
                    <div className="rounded-xl border-dashed border-gray-300 p-12 text-center bg-white">
                        <Users className="mx-auto h-10 w-10 text-gray-400" />
                        <h3 className="mt-3 text-sm font-semibold text-gray-900">Aucun client</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Commencez par ajouter votre premier client.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {clients.map((client) => (
                            <div
                                key={client.id}
                                className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">

                                <div>
                                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                                    {client.company && (
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                            <Building2 className="h-3.5 w-3.5" />
                                            <span>{client.company}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-gray-100">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="truncate">{client.email}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </main>
    );
}