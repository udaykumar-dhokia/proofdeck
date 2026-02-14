"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchCompany } from "@/store/slices/company.slice";
import { addToast } from "@heroui/toast";
import Loader from "@/components/loader";
import UserNavbar from "@/components/user-navbar";

type Props = {
  children: React.ReactNode;
};

const UserLayout = ({ children }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { isAuthenticated, isLoading, isInitialized } = useSelector(
    (state: RootState) => state.company,
  );

  useEffect(() => {
    dispatch(fetchCompany());
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (isAuthenticated === false) {
        addToast({
          title: "Unauthorized",
          description: "You need to log in.",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: "primary",
          variant: "flat",
        });
        router.replace("/");
      }
    }
  }, [isAuthenticated, isLoading, isInitialized, router]);

  if (isLoading || !isInitialized) return <Loader />;

  if (!isAuthenticated) return null;

  return (
    <>
      <UserNavbar />
      {children}
    </>
  );
};

export default UserLayout;
