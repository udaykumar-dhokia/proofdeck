"use client";
import Loader from "@/components/loader";
import { subtitle, title } from "@/components/primitives";
import TestimonialsChart from "@/components/charts/testimonials-chart";
import TestimonialsPieChart from "@/components/charts/testimonials-pie-chart";
import { fetchTestimonials, Testimonial } from "@/store/slices/testimonial.slice";
import { fetchProducts } from "@/store/slices/product.slice";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import { IconArrowUpRight, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const DashboardPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { company } = useSelector((state: RootState) => state.company);
    const { products, isLoading: isProductsLoading } = useSelector(
        (state: RootState) => state.products
    );
    const { testimonials, isLoading: isTestimonialsLoading } = useSelector(
        (state: RootState) => state.testimonials
    );

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchTestimonials());
    }, [dispatch]);

    const stats = React.useMemo(() => {
        const total_products = products.length;
        const total_testimonials = testimonials.length;

        const testimonialsByProduct = testimonials.reduce((acc, t) => {
            acc[t.product_id] = (acc[t.product_id] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const testimonials_per_product = products
            .map((p) => ({
                product_name: p.name,
                count: testimonialsByProduct[p.id] || 0,
            }));

        return {
            total_products,
            total_testimonials,
            testimonials_per_product,
        };
    }, [products, testimonials]);

    if (isProductsLoading || isTestimonialsLoading) return <Loader />;

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className={title()}>Dashboard</h1>
                <p className={subtitle()}>
                    Welcome back, <span className="text-warning">{company?.name}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="py-4" shadow="sm">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start space-y-2">
                        <p className="text-tiny uppercase font-bold text-default-500">
                            Total Products
                        </p>
                        <h4 className={title()}>
                            {stats?.total_products || 0}
                        </h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                        <p className="text-small text-default-500">Active products</p>
                    </CardBody>
                </Card>

                <Card className="py-4" shadow="sm">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start space-y-2">
                        <p className="text-tiny uppercase font-bold text-default-500">
                            Total Testimonials
                        </p>
                        <h4 className={title()}>
                            {stats?.total_testimonials || 0}
                        </h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                        <p className="text-small text-default-500">
                            Testimonials created
                        </p>
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {stats?.testimonials_per_product && stats.testimonials_per_product.length > 0 && (
                    <div className="w-full">
                        <TestimonialsChart data={stats.testimonials_per_product} />
                    </div>
                )}
                {stats?.testimonials_per_product && stats.testimonials_per_product.length > 0 && (
                    <div className="w-full">
                        <TestimonialsPieChart data={stats.testimonials_per_product} />
                    </div>
                )}
            </div>

            {/* {products.length > 0 && (
                <div className="w-full">
                    <ProductsAreaChart products={products} />
                </div>
            )} */}

            <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Recent Products</h2>
                    <Button
                        as={Link}
                        href="/products"
                        color="warning"
                        variant="flat"
                        endContent={<IconArrowUpRight size={18} />}
                    >
                        View All
                    </Button>
                </div>

                <Table aria-label="Recent products table" selectionMode="none">
                    <TableHeader>
                        <TableColumn>NAME</TableColumn>
                        <TableColumn>WEBSITE</TableColumn>
                        <TableColumn>CREATED AT</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No products found."}>
                        {products.slice(0, 5).map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>
                                    <a
                                        href={product.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-warning hover:underline text-sm"
                                    >
                                        {product.website}
                                    </a>
                                </TableCell>
                                <TableCell>
                                    {new Date(product.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            as={Link}
                                            href={`/products/${product.id}/testimonials`}
                                            size="sm"
                                            color="default"
                                            variant="light"
                                            startContent={<IconEye size={16} />}
                                        >
                                            View Testimonials
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DashboardPage;