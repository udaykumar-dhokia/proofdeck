"use client";

import Loader from "@/components/loader";
import { subtitle, title } from "@/components/primitives";
import { fetchTestimonialsByProductId } from "@/store/slices/testimonial.slice";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import AddTestimonialDrawer from "@/components/drawers/add-testimonial";
import PreviewTestimonialModal from "@/components/modals/preview-testimonial";
import { Testimonial } from "@/store/slices/testimonial.slice";
import { IconArrowBackUp, IconArrowLeft, IconArrowUpRight, IconEye, IconPlus, IconSettings, IconTrash } from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chip } from "@heroui/chip";

const TestimonialsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { testimonials, isLoading, error } = useSelector(
        (state: RootState) => state.testimonials
    );
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

    const handlePreview = (testimonial: Testimonial) => {
        setSelectedTestimonial(testimonial);
        setIsPreviewOpen(true);
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchTestimonialsByProductId(id as string));
        }
    }, [dispatch, id]);

    if (isLoading) return <Loader />;

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <>
            <section className="max-w-5xl mx-auto px-4 py-10">
                <div className="space-y-4">
                    <Button isIconOnly variant="bordered" onPress={() => router.back()}><IconArrowBackUp /></Button>
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className={title()}>Testimonials</h1>
                            <p className={subtitle()}>Manage your testimonials here</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <h1 className={title()}>{testimonials?.length || 0}</h1>
                            <Button
                                variant="flat"
                                color="warning"
                                startContent={<IconPlus />}
                                size="lg"
                                onPress={() => setIsDrawerOpen(true)}
                            >
                                Create New
                            </Button>
                        </div>
                    </div>
                </div>

                {(testimonials?.length || 0) === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                        No testimonials found for this product.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((testimonial) => (
                            <Card key={testimonial.id} className="max-w-[400px]" shadow="sm">
                                <CardHeader className="flex gap-3 justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-md font-bold">{testimonial.title}</p>
                                        <p className="text-small text-default-500">
                                            Created: {new Date(testimonial.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Button isIconOnly variant="flat" onPress={() => handlePreview(testimonial)}><IconEye /></Button>
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                    <p className="line-clamp-3">{testimonial.desc}</p>
                                    <div className="mt-4 flex gap-2 flex-wrap">
                                        {testimonial.is_name_required && <Chip color="default" variant="flat" size="sm">Name Required</Chip>}
                                        {testimonial.is_role_required && <Chip color="default" variant="flat" size="sm">Role Required</Chip>}
                                        {testimonial.is_company_required && <Chip color="default" variant="flat" size="sm">Company Required</Chip>}
                                    </div>
                                </CardBody>
                                <Divider />
                                <CardFooter className="flex justify-end gap-2">
                                    <Button
                                        isIconOnly
                                        variant="flat"
                                    // onPress={() => {
                                    //     setSelectedId(product.id);
                                    //     setIsEditOpen(true);
                                    // }}
                                    >
                                        <IconSettings />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        className="text-danger"
                                        variant="flat"
                                    >
                                        <IconTrash />
                                    </Button>
                                    <Button
                                        color="default"
                                        variant="flat"
                                        endContent={<IconArrowUpRight />}
                                    >
                                        View Responses
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
            <AddTestimonialDrawer
                isOpen={isDrawerOpen}
                onOpenChange={() => setIsDrawerOpen(false)}
                productId={id as string}
            />
            <PreviewTestimonialModal
                isOpen={isPreviewOpen}
                onOpenChange={() => setIsPreviewOpen(false)}
                testimonial={selectedTestimonial}
            />
        </>
    );
};

export default TestimonialsPage;
