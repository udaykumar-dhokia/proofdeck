"use client";

import React, { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { title } from "@/components/primitives";
import { Product } from "@/store/slices/product.slice";

interface Props {
    products: Product[];
}

const ProductsAreaChart: React.FC<Props> = ({ products }) => {
    const data = useMemo(() => {
        const grouped = products.reduce((acc, product) => {
            const date = new Date(product.created_at).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const sortedDates = Object.keys(grouped).sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );

        let cumulative = 0;
        return sortedDates.map((date) => {
            cumulative += grouped[date];
            return {
                date,
                count: cumulative,
            };
        });
    }, [products]);

    return (
        <Card className="h-[400px] w-full" shadow="sm">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                <h4 className={title({ size: "sm" })}>Product Growth</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#8884d8"
                            fill="#8884d8"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
    );
};

export default ProductsAreaChart;
