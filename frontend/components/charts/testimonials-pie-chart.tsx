"use client";

import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { title } from "@/components/primitives";

interface Props {
    data: {
        product_name: string;
        count: number;
    }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const TestimonialsPieChart: React.FC<Props> = ({ data }) => {
    return (
        <Card className="h-[400px] w-full" shadow="sm">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                <h4 className={title({ size: "sm" })}>Distribution</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ cx, cy, midAngle = 0, innerRadius, outerRadius, percent = 0 }) => {
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        fill="white"
                                        textAnchor={x > cx ? "start" : "end"}
                                        dominantBaseline="central"
                                    >
                                        {`${(percent * 100).toFixed(0)}%`}
                                    </text>
                                );
                            }}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="product_name"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
    );
};

export default TestimonialsPieChart;
