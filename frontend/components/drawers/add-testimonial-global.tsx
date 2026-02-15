"use client";
import React, { useEffect, useState } from "react";

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
import { Select, SelectItem } from "@heroui/select";
import axiosClient from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { addToast } from "@heroui/toast";
import { addTestimonial } from "@/store/slices/testimonial.slice";
import { fetchProducts } from "@/store/slices/product.slice";
import { AppDispatch, RootState } from "@/store/store";

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const AddTestimonialGlobalDrawer: React.FC<Props> = ({
    isOpen,
    onOpenChange,
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedProductId, setSelectedProductId] = useState("");
    const [isNameRequired, setIsNameRequired] = useState(false);
    const [isRoleRequired, setIsRoleRequired] = useState(false);
    const [isCompanyRequired, setIsCompanyRequired] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { products } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        if (isOpen && products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [isOpen, dispatch, products.length]);

    const handleSubmit = async (onClose: () => void) => {
        if (!title.trim() || !selectedProductId) {
            addToast({
                title: "Please fill all required fields",
                color: "danger"
            })
            return;
        };

        try {
            setIsSubmitting(true);

            const payload = {
                title: title,
                desc: description,
                product_id: selectedProductId,
                is_name_required: isNameRequired,
                is_role_required: isRoleRequired,
                is_company_required: isCompanyRequired,
            };

            const res = await axiosClient.post("/testimonial/", payload);

            dispatch(addTestimonial(res.data.testimonial));

            addToast({
                title: res.data.message || "Testimonial created successfully",
                timeout: 3000,
                color: "success",
            });

            setTitle("");
            setDescription("");
            setSelectedProductId("");
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
                            <Select
                                label="Select Product"
                                placeholder="Choose a product"
                                variant="flat"
                                selectedKeys={selectedProductId ? [selectedProductId] : []}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                            >
                                {products.map((product) => (
                                    <SelectItem key={product.id}>
                                        {product.name}
                                    </SelectItem>
                                ))}
                            </Select>

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
                                <p className="text-small text-default-500">
                                    Form Requirements
                                </p>
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

export default AddTestimonialGlobalDrawer;
