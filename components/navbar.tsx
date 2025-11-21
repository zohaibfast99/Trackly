"use client";

import { useEffect, useState } from "react";

import { Bell, Search, Calendar, TrendingUp, Zap, Star } from "lucide-react";
// import { Crown, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ThemeToggle } from "./theme-toggle";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ProfileAvatar } from "./profile-avatar";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { motion } from "framer-motion";

interface Props{
    id:string;
    name:string;
    email:string;
    image:string;
}

export const Navbar=({id,name,email,image}:Props)=>{
    const [currentTime, setCurrentTime] = useState("");
    const currentDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    });
     useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime(); // set immediately on mount
   const interval = setInterval(updateTime, 30000); 

    return () => clearInterval(interval); // cleanup
  }, []);

    return( <nav className="w-full flex items-center justify-between p-2 sm:p-4 border-b border-border/40 bg-gradient-to-r from-background via-background to-accent/5">
        {/* Left Section - Branding & Quick Stats */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">

            {/* Quick Stats Cards */}
            <div className="hidden md:flex items-center gap-3">
                <motion.div 
                    className="flex items-center gap-2 px-3 py-1.5 bg-accent/30 rounded-full border border-accent/40"
                    whileHover={{ scale: 1.02, backgroundColor: "hsl(var(--accent) / 0.4)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Calendar className="h-3.5 w-3.5 text-accent-foreground/80" />
                    <span className="text-xs font-medium text-accent-foreground">{currentDate}</span>
                </motion.div>

                 {/* Current Time */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-lg border border-muted-foreground/20">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-mono text-muted-foreground">{currentTime}</span>
            </div>
                
                <motion.div 
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20"
                    whileHover={{ scale: 1.02, backgroundColor: "hsl(var(--primary) / 0.15)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">Active</span>
                </motion.div>
            </div>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Search Button */}
           


            <ThemeToggle/>
            
            {/* Profile */}
            <Popover>
                <PopoverTrigger asChild>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative"
                    >
                        <ProfileAvatar url={image || undefined} name={name} className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer"/>
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                    </motion.div>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col items-center gap-3 w-64 sm:w-80 p-4 border-2 border-accent/20" align="end">
                    <div className="mb-4 w-full flex flex-col items-center justify-between">
                        <div className="relative">
                            <ProfileAvatar url={image || undefined} name={name} className="h-16 w-16 ring-4 ring-primary/20"/>
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                                <Star className="h-2 w-2 text-white" />
                            </div>
                        </div>
                        <h2 className="text-base sm:text-lg font-semibold mt-2 truncate max-w-full">
                            {name}
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-full">{email}</p>
                    </div>
                    <Separator/>
                    <Button variant="ghost" className="w-full justify-center gap-2" asChild>
                        <LogoutLink className="text-sm sm:text-base text-center">
                            <span>Sign Out</span>
                        </LogoutLink>
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    </nav>
    );
};