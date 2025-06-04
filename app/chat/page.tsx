'use client'
import DashboardPage from "@/components/whatsapp-interface"
import { useEffect, useState } from "react"

const chatPage = () => {
    const [user, setUser] = useState<string | null>(null)
    const handleLogout = () => {
        localStorage.removeItem("chatAppUser")
    }

    useEffect(() => {
        const savedUser = localStorage.getItem("chatAppUser")
        if (savedUser) {
            setUser(savedUser)
        }
    }, [])
    if (user) {
        return (
            <>
                <DashboardPage  />
            </>
        )
    }
}

export default chatPage