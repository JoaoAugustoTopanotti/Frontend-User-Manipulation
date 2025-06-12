import * as React from "react";

export interface HeaderProps
    extends React.HTMLAttributes<HTMLDivElement> { }

const Header = React.forwardRef<HTMLInputElement, HeaderProps>(
    ({ className, ...props }, ref) => {
        return (
                <header className="h-3/29 w-full content-center pl-12 text-xl"> Informações de Usuários</header>
        );
    }
);
Header.displayName = "Header";

export { Header };
