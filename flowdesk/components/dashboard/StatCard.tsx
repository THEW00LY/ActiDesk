import { LucideIcon } from "lucide-react";

type StatCardProps = {
    title: string;
    value: React.ReactNode;
    description?: string;
    icon: LucideIcon;
}; //A way more flexible way to create re-usable components

export function StatCard({ title, value, description, icon:Icon }: StatCardProps ) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:shadow-md hover:border-gray-300">
            <div className="flex items-center justify-between pb-2">
                <p className="text-xs sm:text-sm font-medium text-gray-500">{title}</p>
                <div className="rounded-lg bg-gray-50 p-2 text-gray-500">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
            </div>
            
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                {value}
            </div>

            {description && (
                <p className="text-xs text-gray-500 mt-1">
                {description}
                </p>
            )}
            </div>
    )
}