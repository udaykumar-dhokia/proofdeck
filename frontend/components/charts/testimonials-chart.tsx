"use client";

import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { subtitle, title } from "@/components/primitives";

interface Props {
    data: {
        product_name: string;
        count: number;
    }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const TestimonialsChart: React.FC<Props> = ({ data }) => {
    return (
        <Card className="h-[400px] w-full" shadow="sm">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                <h4 className={title({ size: "sm" })}>Testimonials</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="product_name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                        />
                        <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
    );
};

export default TestimonialsChart;
