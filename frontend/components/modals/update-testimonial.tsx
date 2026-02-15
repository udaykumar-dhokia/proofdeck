import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Checkbox } from "@heroui/checkbox";
import { Testimonial, toggleTestimonialStatus, updateTestimonial } from "@/store/slices/testimonial.slice";
import axiosClient from "@/utils/api";
import { addToast } from "@heroui/toast";
import { useDispatch } from "react-redux";

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    testimonial: Testimonial | null;
}

const UpdateTestimonial = ({ isOpen, onOpenChange, testimonial }: Props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isNameRequired, setIsNameRequired] = useState(false);
    const [isRoleRequired, setIsRoleRequired] = useState(false);
    const [isCompanyRequired, setIsCompanyRequired] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (testimonial && isOpen) {
            setTitle(testimonial.title || "");
            setDescription(testimonial.desc || "");
            setIsNameRequired(testimonial.is_name_required);
            setIsRoleRequired(testimonial.is_role_required);
            setIsCompanyRequired(testimonial.is_company_required);
        }
    }, [testimonial, isOpen]);

    const handleToggleStatus = async (onClose: () => void) => {
        if (!testimonial) return;

        try {
            setIsToggling(true);

            const res = await axiosClient.put(`/testimonial/${testimonial.id}/toggle-status`);

            dispatch(
                toggleTestimonialStatus(testimonial.id),
            );

            addToast({
                title: res.data.message || "",
                timeout: 3000,
                color: "success",
            });

            onClose();
        } catch (error: any) {
            addToast({
                title: error.response?.data?.message || "Failed to updated testimonial",
                timeout: 3000,
                color: "danger",
            });
        } finally {
            setIsToggling(false);
        }
    };

    const handleUpdate = async (onClose: () => void) => {
        if (!testimonial) return;

        const changes: Partial<Testimonial> = {};

        if (title !== testimonial.title) changes.title = title;
        if (description !== testimonial.desc) changes.desc = description;
        if (isNameRequired !== testimonial.is_name_required) changes.is_name_required = isNameRequired;
        if (isRoleRequired !== testimonial.is_role_required) changes.is_role_required = isRoleRequired;
        if (isCompanyRequired !== testimonial.is_company_required) changes.is_company_required = isCompanyRequired;

        if (Object.keys(changes).length === 0) {
            onClose();
            return;
        }

        try {
            setLoading(true);

            const res = await axiosClient.put(`/testimonial/${testimonial.id}`, changes);

            dispatch(
                updateTestimonial({
                    id: testimonial.id,
                    changes,
                }),
            );

            addToast({
                title: res.data.message || "Testimonial updated",
                timeout: 3000,
                color: "success",
            });

            onClose();
        } catch (error: any) {
            addToast({
                title: error.response?.data?.message || "Failed to update testimonial",
                timeout: 3000,
                color: "danger",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Update Testimonial</ModalHeader>

                        <ModalBody>
                            <Input
                                label="Title"
                                variant="flat"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <Textarea
                                className=""
                                label="Description"
                                placeholder="Enter description"
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
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                color={testimonial?.is_active ? "danger" : "success"}
                                variant="flat"
                                onPress={() => handleToggleStatus(onClose)}
                                isDisabled={isToggling}
                                isLoading={isToggling}
                            >
                                {testimonial?.is_active ? "Disable" : "Enable"}
                            </Button>

                            <Button
                                color="warning"
                                variant="flat"
                                onPress={() => handleUpdate(onClose)}
                                isLoading={loading}
                                isDisabled={loading}
                            >
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default UpdateTestimonial;
