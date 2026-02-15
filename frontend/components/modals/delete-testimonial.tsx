"use client";

import React, { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import axiosClient from "@/utils/api";
import { addToast } from "@heroui/toast";
import { IconTrash } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { deleteTestimonial } from "@/store/slices/testimonial.slice";

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    testimonialId: string;
}

const DeleteTestimonial: React.FC<Props> = ({
    isOpen,
    onOpenChange,
    testimonialId,
}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = async (onClose: () => void) => {
        try {
            setIsDeleting(true);

            const res = await axiosClient.delete(`/testimonial/${testimonialId}`);

            dispatch(deleteTestimonial(testimonialId));

            addToast({
                title: res.data.message || "Deleted",
                timeout: 3000,
                color: "success",
            });

            onClose();
        } catch (error: any) {
            addToast({
                title: error.response?.data?.message || "Failed to delete testimonial",
                timeout: 3000,
                color: "danger",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            placement="center"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-danger">
                            Delete Testimonial
                        </ModalHeader>

                        <ModalBody>
                            <p className="text-sm text-default-600">
                                Are you sure you want to delete this testimonial?
                            </p>
                            <p className="text-sm text-default-600">
                                This action <span className="font-semibold">cannot</span> be
                                undone.
                            </p>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="flat" onPress={onClose} isDisabled={isDeleting}>
                                Cancel
                            </Button>
                            <Button
                                startContent={<IconTrash />}
                                color="danger"
                                isLoading={isDeleting}
                                onPress={() => handleDelete(onClose)}
                            >
                                Delete
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default DeleteTestimonial;
