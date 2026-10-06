import Link from "next/link";
import { ArrowBigDown, ArrowBigRightDash, ArrowRight, ArrowUpSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center bg-gray-50/50 px-6 py-12 text-center">
      <div className="max-w-3xl space-y-6">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
          <CheckCircle2 className="h-4 w-4" />
          <span>L&apos;outil tout-en-un pour freelance organisé</span>
        </div>

        <h1 className="test-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
          Gérez vos projets et clients sans prise de tête avec{" "}
          <span className="text-blue-600">ActiDesk</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Suivez vos revenus, centralisez vos projets et gardez le contrôle sur votre activité de freelance en un seul endroit.
        </p>

        <div className="pt-4 flex justify-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Link href="/dashboard">
              Accéder au dashboard
              <ArrowRight className="h-4 w-4 flex justify-center" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}