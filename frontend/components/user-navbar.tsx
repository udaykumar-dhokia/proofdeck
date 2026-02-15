"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button, ButtonGroup } from "@heroui/button"
import {
    Navbar,
    NavbarContent,
    NavbarItem,
} from "@heroui/navbar"
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/dropdown"
import { IconChevronDown, IconLogout, IconSettings, IconUser } from "@tabler/icons-react"
import { ThemeSwitch } from "./theme-switch"
import { store } from "@/store/store"
import { logoutCompany } from "@/store/slices/company.slice"
import { addToast } from "@heroui/toast"
import AddProductDrawer from "./drawers/add-product"
import AddTestimonialGlobalDrawer from "./drawers/add-testimonial-global"

const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Products", href: "/products" },
]

const UserNavbar = () => {
    const router = useRouter()
    const [selectedOption, setSelectedOption] = useState<any>(new Set(["testimonial"]));
    const path = usePathname()
    const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
    const [isTestimonialDrawerOpen, setIsTestimonialDrawerOpen] = useState(false);

    const descriptionsMap: any = {
        testimonial:
            "Create a testimonial for a product.",
        product:
            "Create a product for your brand.",
    };

    const labelsMap: any = {
        testimonial: "Create Testimonial",
        product: "Create Product",
    };

    const selectedOptionValue: any = Array.from(selectedOption)[0];

    const handleLogout = () => {
        store.dispatch(logoutCompany())
        addToast({
            title: "Logout Success",
            color: "success",
            timeout: 3000,
        })
        router.replace("/")
    }

    return (
        <>
            <Navbar>
                {/* <NavbarBrand>
                <Link href="/dashboard" className="font-bold text-inherit">
                    proofdeck
                </Link>
            </NavbarBrand> */}

                <NavbarContent className="hidden sm:flex gap-6" justify="center">
                    {navLinks.map((link) => (
                        <NavbarItem key={link.href} isActive={path === link.href}>
                            <Link
                                href={link.href}
                                className={`text-foreground hover:text-warning transition-colors ${path === link.href ? "text-warning" : ""}`}
                            >
                                {link.label}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>

                <NavbarContent justify="end" className="gap-2">
                    <NavbarItem>
                        <ButtonGroup variant="flat">
                            <Button onPress={() => {
                                if (selectedOptionValue === "testimonial") {
                                    setIsTestimonialDrawerOpen(true)
                                }
                                if (selectedOptionValue === "product") {
                                    setIsProductDrawerOpen(true)
                                }
                            }}>{labelsMap[selectedOptionValue]}</Button>
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Button isIconOnly>
                                        <IconChevronDown />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="testimonial options"
                                    className="max-w-[300px]"
                                    selectedKeys={selectedOption}
                                    selectionMode="single"
                                    onSelectionChange={setSelectedOption}
                                >
                                    <DropdownItem key="testimonial" description={descriptionsMap["testimonial"]}>
                                        {labelsMap["testimonial"]}
                                    </DropdownItem>
                                    <DropdownItem key="product" description={descriptionsMap["product"]}>
                                        {labelsMap["product"]}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </ButtonGroup>
                    </NavbarItem>

                    <NavbarItem>
                        <Button variant="bordered" isIconOnly>
                            <ThemeSwitch />
                        </Button>
                    </NavbarItem>

                    <NavbarItem>
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Button
                                    isIconOnly
                                    variant="bordered"
                                    aria-label="User menu"
                                >
                                    <IconUser size={18} />
                                </Button>
                            </DropdownTrigger>

                            <DropdownMenu
                                aria-label="User Actions"
                                variant="faded"
                                onAction={(key) => {
                                    if (key === "logout") handleLogout()
                                    if (key === "profile") router.push("/profile")
                                    if (key === "settings") router.push("/settings")
                                }}
                            >
                                <DropdownItem
                                    key="profile"
                                    startContent={<IconUser size={16} />}
                                >
                                    Profile
                                </DropdownItem>

                                <DropdownItem
                                    key="settings"
                                    startContent={<IconSettings size={16} />}
                                >
                                    Settings
                                </DropdownItem>

                                <DropdownItem
                                    key="logout"
                                    startContent={<IconLogout size={16} />}
                                    className="text-danger"
                                    color="danger"
                                >
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <AddProductDrawer
                isOpen={isProductDrawerOpen}
                onOpenChange={() => setIsProductDrawerOpen(false)}
            />
            <AddTestimonialGlobalDrawer
                isOpen={isTestimonialDrawerOpen}
                onOpenChange={() => setIsTestimonialDrawerOpen(false)}
            />
        </>
    )
}

export default React.memo(UserNavbar)
