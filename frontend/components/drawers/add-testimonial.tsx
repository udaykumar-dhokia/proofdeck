"use client";
import React, { useState } from "react";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from "@heroui/drawer";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import axiosClient from "@/utils/api";
import { useDispatch } from "react-redux";
import { addToast } from "@heroui/toast";
import { addTestimonial } from "@/store/slices/testimonial.slice";

interface Props {
    isOpen: boolean;
    onOpenChange: () => void;
    productId: string;
}

const AddTestimonialDrawer: React.FC<Props> = ({
    isOpen,
    onOpenChange,
    productId,
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isNameRequired, setIsNameRequired] = useState(false);
    const [isRoleRequired, setIsRoleRequired] = useState(false);
    const [isCompanyRequired, setIsCompanyRequired] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (onClose: () => void) => {
        if (!title.trim()) return;

        try {
            setIsSubmitting(true);

            const payload = {
                title: title,
                desc: description,
                product_id: productId,
                is_name_required: isNameRequired,
                is_role_required: isRoleRequired,
                is_company_required: isCompanyRequired,
            };

            const res = await axiosClient.post("/testimonial/", payload);

            dispatch(addTestimonial(res.data.testimonial)); // Make sure backend returns this structure

            addToast({
                title: res.data.message || "Testimonial created successfully",
                timeout: 3000,
                color: "success",
            });

            // Reset form
            setTitle("");
            setDescription("");
            setIsNameRequired(false);
            setIsRoleRequired(false);
            setIsCompanyRequired(false);

            onClose();
        } catch (error: any) {
            addToast({
                title: error.response?.data?.message || "Failed to create testimonial",
                timeout: 3000,
                color: "danger",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            Create Testimonial Form
                        </DrawerHeader>
                        <DrawerBody>
                            <Input
                                label="Title"
                                placeholder="Enter testimonial title"
                                variant="flat"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <Textarea
                                className=""
                                label="Description"
                                placeholder="Enter description for the form"
                                variant="flat"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <div className="flex flex-col gap-2 mt-2">
                                <p className="text-small text-default-500">Form Requirements</p>
                                <Checkbox
                                    isSelected={isNameRequired}
                                    onValueChange={setIsNameRequired}
                                >
                                    Require Name
                                </Checkbox>
                                <Checkbox
                                    isSelected={isRoleRequired}
                                    onValueChange={setIsRoleRequired}
                                >
                                    Require Role
                                </Checkbox>
                                <Checkbox
                                    isSelected={isCompanyRequired}
                                    onValueChange={setIsCompanyRequired}
                                >
                                    Require Company
                                </Checkbox>
                            </div>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Close
                            </Button>
                            <Button
                                isLoading={isSubmitting}
                                onPress={() => handleSubmit(onClose)}
                                color="warning"
                                variant="flat"
                            >
                                Create Testimonial
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export default AddTestimonialDrawer;
