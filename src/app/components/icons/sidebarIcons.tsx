import { IoMdHome } from "react-icons/io";
import { MdOutlineStarOutline } from "react-icons/md";
import { FaCarAlt } from "react-icons/fa";
import { BsFuelPumpFill } from "react-icons/bs";
import { PiSteeringWheelFill } from "react-icons/pi";
import { LuUsersRound } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";

type Iconprops = {
    name: "home" | "brands" | "models" | "fuel" | "vehicles" | "users" | "logout";
    size?: number
    color?: string
    className?: string
}

export const Icon = ({name, size = 24, color = "#000", className}: Iconprops) => {
    const icons = {
        home: <IoMdHome size={size} color={color} className={className} />,
        brands: <MdOutlineStarOutline size={size} color={color} className={className} />,
        models: <FaCarAlt size={size} color={color} className={className} />,
        fuel: <BsFuelPumpFill size={size} color={color} className={className} />,
        vehicles: <PiSteeringWheelFill size={size} color={color} className={className} />,
        users: <LuUsersRound size={size} color={color} className={className} />,
        logout: <FiLogOut size={size} color={color} className={className} />
    }
    return icons[name] || null
}