"use client"

import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchCompany } from "@/store/slices/company.slice"
import { addToast } from "@heroui/toast"
import Loader from "@/components/loader"

type Props = {
    children: React.ReactNode
}

const UserLayout = ({ children }: Props) => {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    const { isAuthenticated, isLoading } = useSelector(
        (state: RootState) => state.company
    )

    useEffect(() => {
        dispatch(fetchCompany())
    }, [dispatch])

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            addToast({
                title: "Toast Title",
                description: "Toast Description",
                timeout: 3000,
                shouldShowTimeoutProgress: true,
                color: "primary",
                variant: "flat"
            });
            router.replace("/")
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading || !isAuthenticated) {
        return <Loader />
    }

    return <>{children}</>
}

export default UserLayout
