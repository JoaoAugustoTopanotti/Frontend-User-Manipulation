import * as React from "react";

export interface HeaderProps
    extends React.HTMLAttributes<HTMLDivElement> { }

const Header = React.forwardRef<HTMLInputElement, HeaderProps>(
    ({ className, ...props }, ref) => {
        return (
                <header className="bg-green-200 h-2/12 w-full content-center pl-12"> Informações de Usuários</header>
        );
    }
);
Header.displayName = "Header";

export { Header };
