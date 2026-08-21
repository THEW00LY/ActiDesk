import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {StatCard} from "@/components/dashboard/StatCard";
export default function Dashboard() {
  
 const stats = [
                  {title : "Clients" , value : 54 },
                  {title : "Projets" , value : 4},
                  {title : "Revenus", value : "32 600 €"},
                  {title : "Tasks", value : 3}];
  
  return (
    <main className ="p-8 space-y-8"> 

    <div>
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>
      <p className="text-muted-foreground">
        Vue d&apos;ensemble de votre activité
      </p>
    </div>      

    <div className="grid gap-6 md:grid-cols-4">
      {stats.map((stat) => (
          <StatCard key={stat.title}
          title={stat.title}
          value={stat.value}
          />
      ))}
    </div>

    <Card>
      <CardHeader>
        <CardTitle>
          Activité récente
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          <li>
            Nouveau client ajouté : Acme Corp
          </li>

          <li>
            Projet terminé : Application mobile
          </li>

          <li>
            Facture envoyée : 2500 €
          </li>
        </ul>
      </CardContent>
    </Card>

    </main>
  )
}