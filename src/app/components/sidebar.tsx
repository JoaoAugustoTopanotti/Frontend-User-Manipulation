import * as React from "react";
import { Icon } from "./icons/sidebarIcons";

export interface SidebarProps
    extends React.HTMLAttributes<HTMLDivElement> { }

const Sidebar = React.forwardRef<HTMLInputElement, SidebarProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className="flex flex-col w-1/22 border border-[var(--color-sidebarBorderColor)]">
                <div className="h-1/8 text-center content-center">
                    <div className="bg-be1 bg-auto md:bg-contain bg-no-repeat h-3/4 content-center jusitify-items-center"></div>
                </div>
                <div className="grid grid-row-20 h-full">
                        <div className="content-center justify-items-center border-t-2 border-b-2 border-[var(--color-sidebarBorderColor)] hover:bg-[var(--color-hoverColor)] cursor-pointer"> <Icon name="home" size={25} /></div>
                        <div className="content-center justify-items-center hover:bg-[var(--color-hoverColor)] cursor-pointer"> <Icon name="brands" size={28} /></div>
                        <div className="content-center justify-items-center border-t-2 border-b-2 border-[var(--color-sidebarBorderColor)] hover:bg-[var(--color-hoverColor)] cursor-pointer"> <Icon name="models" size={20} /></div>
                        <div className="content-center justify-items-center hover:bg-[var(--color-hoverColor)] cursor-pointer"> <Icon name="fuel" size={18} /></div>
                        <div className="content-center justify-items-center border-t-2 border-b-2 border-[var(--color-sidebarBorderColor)] hover:bg-[var(--color-hoverColor)] cursor-pointer" > <Icon name="vehicles" size={28} /></div>
                        <div className="content-center justify-items-center border-b-2 border-[var(--color-sidebarBorderColor)] hover:bg-[var(--color-hoverColor)] cursor-pointer" > <Icon name="users" size={23} /></div>
                        <div className="row-span-14"></div>
                </div>
                <div className="w-full h-1/8 content-center justify-items-center border-t-2 border-b-2 border-[var(--color-sidebarBorderColor)] hover:bg-red-200 cursor-pointer"><Icon name="logout" size={20} /></div>
            </div>
        );
    }
);
Sidebar.displayName = "Sidebar";

export { Sidebar };
