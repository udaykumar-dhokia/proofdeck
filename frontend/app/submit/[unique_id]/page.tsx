"use client";
import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { useParams } from "next/navigation";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { title } from "@/components/primitives";
import axiosClient from "@/utils/api";
import { addToast } from "@heroui/toast";
import Loader from "@/components/loader";
import { Testimonial } from "@/store/slices/testimonial.slice";
import { IconSend } from "@tabler/icons-react";

const SubmitTestimonialPage = () => {
    const { unique_id } = useParams();
    const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [company, setCompany] = useState("");
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState<number | null>(null);

    useEffect(() => {
        if (unique_id) {
            fetchTestimonial();
        }
    }, [unique_id]);

    const fetchTestimonial = async () => {
        try {
            const res = await axiosClient.get(`/testimonial/public/${unique_id}`);
            setTestimonial(res.data);
        } catch (error) {
            console.error("Failed to fetch testimonial", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!testimonial) return;

        if (!feedback || !rating || !email) {
            addToast({
                title: "Please fill all required fields (Email, Feedback, Rating)",
                color: "danger",
            });
            return;
        }

        if (testimonial.is_name_required && !name) {
            addToast({ title: "Name is required", color: "danger" });
            return;
        }
        if (testimonial.is_role_required && !role) {
            addToast({ title: "Role is required", color: "danger" });
            return;
        }
        if (testimonial.is_company_required && !company) {
            addToast({ title: "Company is required", color: "danger" });
            return;
        }


        try {
            setSubmitting(true);
            await axiosClient.post(`/response/${testimonial.id}`, {
                name,
                email,
                role,
                company,
                feedback,
                rating,
            });
            setSubmitted(true);
            addToast({
                title: "Feedback submitted successfully!",
                color: "success",
            });
        } catch (error: any) {
            addToast({
                title: error.response?.data?.message || "Failed to submit feedback",
                color: "danger",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;

    if (!testimonial) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-danger">Testimonial not found or invalid link.</p>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Card className="max-w-md w-full p-6 text-center">
                    <CardBody>
                        <h1 className={title({ size: "sm" })}>Thank You!</h1>
                        <p className="mt-4 text-gray-600">
                            Your feedback has been submitted successfully.
                        </p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
            <Card className="max-w-2xl w-full" shadow="sm">
                <CardHeader className="flex flex-col gap-1 pb-0 pt-6 px-6">
                    <h1 className={title({ size: "sm" })}>{testimonial.title}</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {testimonial.desc}
                    </p>
                </CardHeader>
                <CardBody className="px-6 py-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Email"
                            placeholder="john@example.com"
                            variant="flat"
                            isRequired
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {testimonial.is_name_required && (
                            <Input
                                label="Name"
                                placeholder="John Doe"
                                variant="flat"
                                isRequired
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        )}
                        {testimonial.is_role_required && (
                            <Input
                                label="Role"
                                placeholder="Software Engineer"
                                variant="flat"
                                isRequired
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                        )}
                        {testimonial.is_company_required && (
                            <Input
                                label="Company"
                                placeholder="Acme Corp"
                                variant="flat"
                                isRequired
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        )}
                    </div>

                    <Textarea
                        label="Feedback"
                        placeholder="Tell us what you think..."
                        variant="flat"
                        isRequired
                        minRows={4}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />

                    <div>
                        <p className="text-small text-default-500 mb-2">Rating</p>
                        <ButtonGroup fullWidth size="lg">
                            {[1, 2, 3, 4, 5].map((r) => (
                                <Button
                                    key={r}
                                    isIconOnly
                                    variant={rating === r ? "solid" : "flat"}
                                    color={rating === r ? "warning" : "default"}
                                    onPress={() => setRating(r)}
                                    className="text-2xl"
                                >
                                    {r === 1 ? "😠" : r === 2 ? "🙁" : r === 3 ? "😐" : r === 4 ? "🙂" : "😍"}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                </CardBody>
                <CardFooter className="px-6 pb-6">
                    <Button
                        color="warning"
                        variant="flat"
                        fullWidth
                        size="lg"
                        endContent={<IconSend />}
                        isLoading={submitting}
                        onPress={handleSubmit}
                    >
                        Submit Feedback
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SubmitTestimonialPage;
