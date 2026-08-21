import Link from "next/link";

export function Navbar() {
    return (
        <nav className="border-b px-6 py-4 flex justify-between items-center">
            <h1  className="text-x1 font-bold">
                ActiDesk
            </h1>

            <div className = "flex gap-6">
                <Link href="/dashboard">
                    Dashboard
                </Link>
                <Link href="/clients">
                    Clients
                </Link>

                <Link href="/projects"> 
                    Projects
                </Link>

            </div>
        </nav>
    );
}