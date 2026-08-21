import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type StatCardProps = {
    title: string;
    value: React.ReactNode;
}; //A way more flexible way to create re-usable components

export function StatCard({ title, value }: StatCardProps ) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <p className="text-3xl font-bold">
                    {value}
                </p>
            </CardContent>
        </Card>
    )
}