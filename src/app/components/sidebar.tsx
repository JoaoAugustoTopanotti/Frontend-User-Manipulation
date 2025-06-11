import * as React from "react";
import { Icon } from "./icons/sidebarIcons";

export interface SidebarProps
    extends React.HTMLAttributes<HTMLDivElement> { }

const Sidebar = React.forwardRef<HTMLInputElement, SidebarProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className="flex flex-col w-1/22 border border-[var(--color-sidebarBorderColor)]">
                <div className="bg-yellow-200 h-3/12 text-center content-center">Logo</div>
                <div className="grid grid-row-15 h-full">
                    <div className="row-span-3"></div>
                    <div className="content-center justify-items-center border-t-2 border-b-2 border-[var(--color-sidebarBorderColor)]"> <Icon name="home" size={30}/></div>
                    <div className="content-center justify-items-center"> <Icon name="brands" size={33}/></div>
                    <div className="content-center justify-items-center border-t-2 border-b-2 border-[var(--color-sidebarBorderColor)]"> <Icon name="models" size={25}/></div>
                    <div className="content-center justify-items-center"> <Icon name="fuel" size={23}/></div>
                    <div className="content-center justify-items-center border-t-2 border-b-2 border-[var(--color-sidebarBorderColor)]" > <Icon name="vehicles" size={33}/></div>
                    <div className="content-center justify-items-center border-b-2 border-[var(--color-sidebarBorderColor)]" > <Icon name="users" size={28}/></div>
                    <div className="row-span-6"></div>
                </div>
                <div className="bg-red-200 w-full h-1/8 content-center justify-items-center border-t-2 border-b-2 border-[var(--color-sidebarBorderColor)]"><Icon name="logout" size={25}/></div>
            </div>
        );
    }
);
Sidebar.displayName = "Sidebar";

export { Sidebar };
