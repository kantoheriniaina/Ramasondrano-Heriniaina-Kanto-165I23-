"use client";

import React, { useState, Suspense } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    UserCog,
    Settings,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Lazy load des composants de contenu
const contentComponents: Record<string, any> = {
    Dashboard: dynamic(() => import("@/app/sidebarContenue/dashboard")),
    Profile: dynamic(() => import("@/app/sidebarContenue/profile")),
    Settings: dynamic(() => import("@/app/sidebarContenue/setting")),
    Logout: dynamic(() => import("@/app/sidebarContenue/logout")),
};

export function SidebarDemo() {
    const [open, setOpen] = useState(true);
    const [selectedTab, setSelectedTab] = useState("Dashboard");

    const links = [
        {
            label: "Dashboard",
            icon: <LayoutDashboard className="icon-class" />,
        },
        {
            label: "Profile",
            icon: <UserCog className="icon-class" />,
        },
        {
            label: "Settings",
            icon: <Settings className="icon-class" />,
        },
        {
            label: "Logout",
            icon: <LogOut className="icon-class" />,
        },
    ];

    const SelectedComponent = contentComponents[selectedTab];

    return (
        <div
            className={cn(
                "flex flex-col md:flex-row w-full h-screen bg-gray-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 overflow-hidden"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedTab(link.label)}
                                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                >
                                    {link.icon}
                                    {open && <span className="text-sm text-black dark:text-white">{link.label}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </SidebarBody>
            </Sidebar>

            <div className="flex-1 p-6 overflow-auto bg-white dark:bg-neutral-900 rounded-tl-2xl border-l border-neutral-300 dark:border-neutral-700">
                <Suspense fallback={<div>Chargement...</div>}>
                    {SelectedComponent ? <SelectedComponent /> : <div>Sélection invalide</div>}
                </Suspense>
            </div>
        </div>
    );
}

export const Logo = () => (
    <Link
        href="#"
        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
        <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-medium text-black dark:text-white whitespace-pre"
        >
            Acet Labs
        </motion.span>
    </Link>
);

export const LogoIcon = () => (
    <Link
        href="#"
        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
        <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
);
