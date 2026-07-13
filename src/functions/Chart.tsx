import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const PerformanceChart = ({ data }: { data: any }) => {
    return (
        <ResponsiveContainer width={100} height={250}>
            <LineChart data={data}>
                <XAxis dataKey={"Date"} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type={"monotone"} dataKey={"score"} strokeWidth={3} />
            </LineChart>
        </ResponsiveContainer>
    );
}

export { PerformanceChart };