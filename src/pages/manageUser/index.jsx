import { useState } from "react";

import { ManagerUser, Settings, Categories, Navbar } from "../../components";

export const ManageUser = () => {

    const [showComponent, setShowComponent] = useState(0);

    const Viewer = () => {
        return showComponent === 0 ? (<ManagerUser key={1} />) : showComponent === 1 ? (<Categories key={1} />) : (<Settings key={2} />)
    };

    return (
        <>
            <Navbar title="Configurações" url />
            <div className="p-2 flex flex-col w-full xl:w-[1000px] h-[90dvh] justify-start items-center">

                <div className="w-full flex justify-between items-center gap-2">
                    {["Usuários", "Categorias", "Configurações"].map((header, index) => (
                        <button
                            key={index}
                            className={`${showComponent === index && "bg-[#EB8F00] text-white border-[#EB8F00]"} border-2 border-[#1C1D26] transition-all delay-75 w-1/3 text-center p-2 rounded-md font-semibold`}
                            onClick={() => setShowComponent(index)}
                        >
                            {header}
                        </button>
                    ))}
                </div>
                <Viewer />
            </div>
        </>
    );
};
