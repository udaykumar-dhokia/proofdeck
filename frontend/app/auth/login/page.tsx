"use client";
import React, { useEffect } from "react";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { IconArrowBackUp, IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import axiosClient from "@/utils/api";
import { addToast } from "@heroui/toast";

export default function page() {
  const [password, setPassword] = React.useState("");
  const [submitted, setSubmitted] = React.useState<any | null>(null);
  const [errors, setErrors] = React.useState<any>({});

  const getPasswordError = (value: any) => {
    if (value.length < 4) {
      return "Password must be 4 characters or more";
    }
    if ((value.match(/[A-Z]/g) || []).length < 1) {
      return "Password needs at least 1 uppercase letter";
    }
    if ((value.match(/[^a-z]/gi) || []).length < 1) {
      return "Password needs at least 1 symbol";
    }

    return null;
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const newErrors: any = {};

    const passwordError = getPasswordError(data.password);

    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (data.name === "admin") {
      newErrors.name = "Nice try! Choose a different username";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    if (data.terms !== "true") {
      setErrors({ terms: "Please accept the terms" });

      return;
    }

    setErrors({});
    setSubmitted(data);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      <div className="flex items-center justify-center px-6 py-12">
        <Form
          className="w-full max-w-sm space-y-2"
          validationErrors={errors}
          onReset={() => setSubmitted(null)}
          onSubmit={onSubmit}
        >
          <div className="text-start space-y-2">
            <Button as={Link} href="/" isIconOnly variant="bordered"><IconArrowBackUp /></Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-default-500">
              Login to your account to continue
            </p>
          </div>

          <Input
            isRequired
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Please enter your email";
              }
              if (validationDetails.typeMismatch) {
                return "Please enter a valid email address";
              }
            }}
            label="Email"
            labelPlacement="inside"
            name="email"
            placeholder="Enter your email"
            type="email"
          />

          <Input
            isRequired
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Please enter your email";
              }
              if (validationDetails.typeMismatch) {
                return "Please enter a valid email address";
              }
            }}
            label="Password"
            labelPlacement="inside"
            name="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onValueChange={setPassword}
          />

          <Button
            endContent={<IconArrowUpRight size={18} />}
            className="w-full font-semibold"
            color="warning"
            size="lg"
            type="submit"
          >
            Continue
          </Button>

          <p className="text-center text-sm text-default-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-warning font-semibold hover:underline"
            >
              Register
            </Link>
          </p>

          {submitted && (
            <div className="text-xs text-default-500 mt-4">
              <pre>{JSON.stringify(submitted, null, 2)}</pre>
            </div>
          )}
        </Form>
      </div>

      <div className="relative hidden md:block">
        <img
          src="/back.jpg"
          alt="Authentication background"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />
      </div>
    </div>
  );

}
