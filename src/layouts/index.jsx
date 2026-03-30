import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "../components";

import { 
    ArrowRight,
    Global,
    Grafic,
    Print,
    Swath,
    Edit,
    Kitchen,
    Config,
    Products,
    Pub
} from "../libs/icons";

export const LayoutBase = ({ children }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const user_id = localStorage.getItem("user_id") || "";

        setItems([
            { icon: <Grafic />, label: "Administração", link: `/${user_id}/admin` },
            { icon: < Print />, label: "Histórico de vendas", link: "/sales_history" },
            { icon: < Edit />, label: "Comandas abertas", link: "/admin/garcom/comandas" },
            { icon: < Swath />, label: "Comandas fechadas", link: "/comandasFinalizadas" },
            { icon: < Global />, label: "Online", link: "/admin/created_online" },
            { icon: < Kitchen />, label: "Cozinha", link: "/admin/cozinha/producao" },
            { icon: < Pub />, label: "Bar", link: "/admin/barmen/producao" },
            { icon: < Products />, label: "Produtos", link: "/produtos" },
            { icon: < Config />, label: "Configurações", link: "/usuarios" },
        ]);
    }, []);

    return (
        <div className="min-h-[100dvh] pt-[75px] flex justify-center items-center">
            <Toaster />
            <Sidebar items={items} />
            {children}
        </div>
    );
};
