"use client"
import { RootState } from '@/store/store'
import React from 'react'
import { useSelector } from 'react-redux'

const page = () => {
    const { company } = useSelector((state: RootState) => state.company)
    console.log(company)
    return (
        <div className='mt-40'>
            <h1 className='text-foreground'>{company?.name || "No Company Name"}</h1>
        </div>
    )
}

export default page