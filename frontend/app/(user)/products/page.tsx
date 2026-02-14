"use client";

import Loader from "@/components/loader";
import { subtitle, title } from "@/components/primitives";
import { fetchProducts } from "@/store/slices/product.slice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import {
  IconArrowUpRight,
  IconPlus,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react";
import AddProductDrawer from "@/components/drawers/add-product";
import DeleteProduct from "@/components/modals/delete-product";
import UpdateProduct from "@/components/modals/update-product";

import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { isLoading, products, error } = useSelector(
    (state: RootState) => state.products,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

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
        <div className="mb-8 flex justify-between items-center">
          <div className="">
            <h1 className={title()}>Products</h1>
            <p className={subtitle()}>Browse your products here</p>
          </div>
          <div className="flex items-center gap-4">
            <h1 className={title()}>{products.length}</h1>
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

        {products.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="max-w-[400px]" shadow="sm">
                <CardHeader className="flex gap-3">
                  <Image
                    alt="logo"
                    height={40}
                    radius="sm"
                    src={`https://api.dicebear.com/9.x/shapes/svg?seed=${product.id}`}
                    width={40}
                  />
                  <div className="flex flex-col">
                    <p className="text-md">{product.name}</p>
                    <p className="text-small text-default-500">
                      {product.website}
                    </p>
                  </div>
                </CardHeader>
                <CardBody>
                  <p>{product.desc}</p>
                </CardBody>
                <Divider />
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    isIconOnly
                    variant="flat"
                    onPress={() => {
                      setSelectedId(product.id);
                      setIsEditOpen(true);
                    }}
                  >
                    <IconSettings />
                  </Button>

                  <Button
                    isIconOnly
                    className="text-danger"
                    variant="flat"
                    onPress={() => {
                      setSelectedId(product.id);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <IconTrash />
                  </Button>

                  <Button
                    color="default"
                    variant="flat"
                    onPress={() => {
                      router.push(`/products/${product.id}/testimonials`);
                    }}
                    endContent={<IconArrowUpRight />}
                  >
                    View Testimonials
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
      <AddProductDrawer
        isOpen={isDrawerOpen}
        onOpenChange={() => setIsDrawerOpen(false)}
      />
      {selectedId && (
        <DeleteProduct
          isOpen={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          productId={selectedId}
        />
      )}
      <UpdateProduct
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        product={products.find((p) => p.id === selectedId) || null}
      />
    </>
  );
};

export default Page;
