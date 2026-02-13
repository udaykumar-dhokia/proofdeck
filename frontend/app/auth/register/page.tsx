"use client";
import React from "react";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { IconArrowBackUp, IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";

export default function page() {
  const [password, setPassword] = React.useState("");
  const [submitted, setSubmitted] = React.useState<any | null>(null);
  const [errors, setErrors] = React.useState<any>({});


  const onSubmit = (e: any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const newErrors: any = {};

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
              Create an account
            </h1>
            <p className="text-sm text-default-500">
              Sign up to get started with ProofDeck
            </p>
          </div>

          <Input
            isRequired
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Please enter your name";
              }
              return errors.name;
            }}
            label="Name"
            labelPlacement="inside"
            name="name"
            placeholder="Enter your name"
          />

          <Input
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Please enter your wesbite";
              }
              return errors.name;
            }}
            label="Wesbite"
            labelPlacement="inside"
            name="name"
            placeholder="Enter your wesbite"
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
                return "Please enter your password";
              }
              if (validationDetails.typeMismatch) {
                return "Please enter a valid password";
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

          <div className="space-y-2">
            <Checkbox
              isRequired
              classNames={{ label: "text-sm" }}
              isInvalid={!!errors.terms}
              name="terms"
              validationBehavior="aria"
              value="true"
              onValueChange={() =>
                setErrors((prev: any) => ({ ...prev, terms: undefined }))
              }
            >
              I agree to the terms and conditions
            </Checkbox>

            {errors.terms && (
              <span className="text-danger text-sm">
                {errors.terms}
              </span>
            )}
          </div>

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
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-warning font-semibold hover:underline"
            >
              Login
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
