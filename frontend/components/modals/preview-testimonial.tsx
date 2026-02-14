"use client";
import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button, ButtonGroup } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Testimonial } from "@/store/slices/testimonial.slice";

interface Props {
    isOpen: boolean;
    onOpenChange: () => void;
    testimonial: Testimonial | null;
}

const PreviewTestimonialModal: React.FC<Props> = ({
    isOpen,
    onOpenChange,
    testimonial,
}) => {
    if (!testimonial) return null;

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Preview: {testimonial.title}
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <p className="">
                                    {testimonial.desc || "No description provided."}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {testimonial.is_name_required && (
                                        <Input
                                            label="Name"
                                            placeholder="John Doe"
                                            variant="flat"
                                            isRequired
                                            isReadOnly
                                        />
                                    )}
                                    <Input
                                        label="Email"
                                        placeholder="john@example.com"
                                        variant="flat"
                                        isRequired
                                        isReadOnly
                                    />
                                    {testimonial.is_role_required && (
                                        <Input
                                            label="Role"
                                            placeholder="Software Engineer"
                                            variant="flat"
                                            isRequired
                                            isReadOnly
                                        />
                                    )}
                                    {testimonial.is_company_required && (
                                        <Input
                                            label="Company"
                                            placeholder="Acme Corp"
                                            variant="flat"
                                            isRequired
                                            isReadOnly
                                        />
                                    )}
                                </div>

                                <Textarea
                                    label="Feedback"
                                    placeholder="Tell us what you think..."
                                    variant="flat"
                                    isRequired
                                    isReadOnly
                                    minRows={4}
                                />

                                <div className="flex flex-col gap-2">
                                    <ButtonGroup fullWidth size="lg">
                                        <Button isIconOnly variant="flat" className="text-2xl">😠</Button>
                                        <Button isIconOnly variant="flat" className="text-2xl">🙁</Button>
                                        <Button isIconOnly variant="flat" className="text-2xl">😐</Button>
                                        <Button isIconOnly variant="flat" className="text-2xl">🙂</Button>
                                        <Button isIconOnly variant="flat" className="text-2xl">😍</Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="warning" variant="flat" onPress={onClose}>
                                Submit
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default PreviewTestimonialModal;
