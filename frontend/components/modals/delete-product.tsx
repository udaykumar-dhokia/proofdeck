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
import { deleteProduct } from "@/store/slices/product.slice";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
}

const DeleteProduct: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  productId,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async (onClose: () => void) => {
    try {
      setIsDeleting(true);

      const res = await axiosClient.delete(`/product/${productId}`);

      dispatch(deleteProduct(productId));

      addToast({
        title: res.data.message || "Deleted",
        timeout: 3000,
        color: "success",
      });

      onClose();
    } catch (error: any) {
      addToast({
        title: error.response.message || "Failed to delete product",
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
              Delete Product
            </ModalHeader>

            <ModalBody>
              <p className="text-sm text-default-600">
                Are you sure you want to delete this product?
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

export default DeleteProduct;
