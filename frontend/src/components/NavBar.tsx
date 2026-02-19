import { NavLink } from "react-router-dom"
import { AvatarDropdown } from "./AvatarDropdown"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export const NavBar = () => {
    const [open, setOpen] = useState<boolean>(false)

    const navLinks = [
        { name: "Dashboard", path: "/"},
        { name: "Leaderboard", path: "/leaderboard"}
    ]
    
    return (
        <header className="fixed z-10 top-0 left-0 h-16 w-screen border-b border-[#073362] bg-(--bg-primary)">
            <nav className="relative flex items-center justify-between p-3">
                <NavLink
                    to="/"
                    className="inline-flex items-center gap-3 sm:gap-5"
                >
                    <img 
                        src={'/favicon.ico'} 
                        alt="Daily puzzle Logo" 
                        className="rounded-lg size-9 sm:size-10"
                        style={{
                            boxShadow: "0 0 10px 3px #0c3f91"
                        }}
                    />
                    <h1 className="hidden sm:block text-lg sm:text-xl font-bold text-white">Daily Puzzle</h1>
                </NavLink>

                <div className="items-center gap-8 hidden md:flex">
                    <ul className="flex items-center gap-7">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <NavLink
                                    to={link.path}
                                    className="relative"
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span className="text-white font-semibold">{link.name}</span>
        
                                            {isActive && (
                                                <motion.div
                                                    layoutId="underline"
                                                    className="absolute left-0 -bottom-3 h-[2px] w-full bg-blue-500"
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <AvatarDropdown />
                </div>

                <div className="md:hidden flex items-center gap-3">
                    <button
                        onClick={() => setOpen((open) => !open)}
                    >
                        {open 
                            ? <X className="size-6 text-white font-bold cursor-pointer"/>
                            : <Menu className="size-6  text-white font-bold cursor-pointer"/>
                        }
                    </button>
                    <AvatarDropdown />
                </div>

                {open && (
                    <AnimatePresence>
                        <motion.div 
                            initial={{ opacity: 0, y: -2 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn"} }}
                            transition={{ duration: 0.2, ease: "easeOut"}}

                            className="absolute left-0 top-16 bg-(--bg-surface) w-full"
                        >
                            <ul className="flex flex-col gap-3 p-3">
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <NavLink
                                            to={link.path}
                                            onClick={() => setOpen(false)}
                                            className={({ isActive }) => `block rounded-md w-full  px-3 py-2 hover:bg-(--bg-primary)/30 ${isActive ? "bg-(--bg-primary)/50" : ""}`}
                                        >
                                            <span className="text-white font-semibold">{link.name}</span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </AnimatePresence>
                )}
            </nav>
        </header>
    )
}