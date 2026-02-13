"use client"
import { RootState } from '@/store/store'
import React from 'react'
import { useSelector } from 'react-redux'

const page = () => {
    const { company } = useSelector((state: RootState) => state.company)
    return (
        <div>{company?.email}</div>
    )
}

export default page