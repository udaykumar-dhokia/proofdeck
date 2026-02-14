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
import { Product, updateProduct } from "@/store/slices/product.slice";
import axiosClient from "@/utils/api";
import { addToast } from "@heroui/toast";
import { useDispatch } from "react-redux";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

const UpdateProduct = ({ isOpen, onOpenChange, product }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // ✅ Prefill
  useEffect(() => {
    if (product && isOpen) {
      setName(product.name || "");
      setDescription(product.desc || "");
      setWebsite(product.website?.replace("https://", "") || "");
    }
  }, [product, isOpen]);

  const handleUpdate = async (onClose: () => void) => {
    if (!product) return;

    const changes: Partial<Product> = {};

    if (name !== product.name) changes.name = name;
    if (description !== product.desc) changes.desc = description;
    if (`https://${website}` !== product.website)
      changes.website = `https://${website}`;

    if (Object.keys(changes).length === 0) {
      onClose();
      return;
    }

    try {
      setLoading(true);

      const res = await axiosClient.put(`/product/${product.id}`, changes);

      dispatch(
        updateProduct({
          id: product.id,
          changes,
        }),
      );

      addToast({
        title: res.data.message || "Product updated",
        timeout: 3000,
        color: "success",
      });

      onClose();
    } catch (error: any) {
      addToast({
        title: error.response?.data?.message || "Failed to update product",
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
            <ModalHeader>Product Settings</ModalHeader>

            <ModalBody>
              <Input
                label="Product Name"
                variant="flat"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Textarea
                className=""
                label="Description"
                placeholder="Enter your description"
                variant="flat"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Input
                label="Website"
                labelPlacement="inside"
                value={website}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">
                      https://
                    </span>
                  </div>
                }
                onChange={(e) => setWebsite(e.target.value)}
                variant="flat"
              />
            </ModalBody>

            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={onClose}
                isDisabled={loading}
              >
                Cancel
              </Button>

              <Button
                color="warning"
                variant="flat"
                onPress={() => handleUpdate(onClose)}
                isLoading={loading}
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

export default UpdateProduct;
