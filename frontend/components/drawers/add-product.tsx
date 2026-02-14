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
import axiosClient from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addToast } from "@heroui/toast";
import { addProduct } from "@/store/slices/product.slice";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
}

const AddProductDrawer: React.FC<Props> = ({ isOpen, onOpenChange }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { company } = useSelector((state: RootState) => state.company);
  const dispatch = useDispatch();

  const handleSubmit = async (onClose: () => void) => {
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        name: name,
        desc: description,
        website: website ? `https://${website}` : null,
        company_id: company?.id,
      };
      const res = await axiosClient.post("/product/", payload);

      dispatch(addProduct(res.data.product));

      addToast({
        title: res.data.message,
        timeout: 3000,
        color: "success",
      });

      setName("");
      setDescription("");
      setWebsite("");

      onClose();
    } catch (error: any) {
      addToast({
        title: error.response.message || "Failed to create product",
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
              Create Product
            </DrawerHeader>
            <DrawerBody>
              <Input
                label="Name"
                placeholder="Enter product name"
                variant="bordered"
                onChange={(e) => setName(e.target.value)}
              />
              <Textarea
                className=""
                label="Description"
                placeholder="Enter your description"
                variant="bordered"
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                label="Website"
                labelPlacement="inside"
                placeholder="proofdeck"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">
                      https://
                    </span>
                  </div>
                }
                onChange={(e) => setWebsite(e.target.value)}
                variant="bordered"
              />
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
                Create Product
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default AddProductDrawer;
