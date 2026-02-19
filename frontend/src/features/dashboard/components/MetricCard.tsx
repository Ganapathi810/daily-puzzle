import { Card } from "../../../components/ui/Card"

export const MetricCard = ({ title, value, icon}: { title: string, value: number | string, icon: React.ReactNode}) => {
    return (
        <Card>
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="text-sm sm:text-md font-semibold">{title}</h3>
                </div>
                <p className="text-md sm:text-lg text-neutral-400">{value}</p>
            </div>
        </Card>
    )
}