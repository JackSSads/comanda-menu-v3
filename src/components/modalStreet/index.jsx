import { useToggleView } from "../../contexts";
import { Close } from "../../libs/icons";

export const ModalStreet = ({ item }) => {
    const { toggleView, setToggleView } = useToggleView();

    return (
        <div className={`${toggleView ? "flex" : "hidden"} fixed inset-0 z-50 bg-black/20 items-center justify-center px-4`}>
            <div className="relative bg-white rounded-2xl w-full max-w-lg p-6 overflow-auto max-h-[90vh] flex flex-col gap-4">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
                    onClick={() => setToggleView(false)}
                    aria-label="Fechar">
                    <Close />
                </button>

                <h2 className="text-xl font-bold text-center text-gray-800">
                    Endereço
                </h2>

                <div className="flex flex-col gap-3">
                    <label className="w-full text-slate-700 font-semibold flex flex-col">
                        Rua
                        <input
                            type="text"
                            id="street"
                            name="street"
                            className="w-full border border-slate-300 rounded-xl font-light px-4 py-3 text-slate-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#EB8F00] placeholder:text-slate-40"
                            disabled
                            value={item.street}
                        />
                    </label>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="w-full text-slate-700 font-semibold flex flex-col">
                        Número
                        <input
                            type="text"
                            id="house_number"
                            name="house_number"
                            className="w-full border border-slate-300 rounded-xl font-light px-4 py-3 text-slate-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#EB8F00] placeholder:text-slate-40"
                            disabled
                            value={item.house_number}
                        />
                    </label>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="w-full text-slate-700 font-semibold flex flex-col">
                        Referência
                        <textarea
                            id="reference"
                            name="reference"
                            className="w-full border border-slate-300 rounded-xl font-light px-4 py-3 text-slate-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#EB8F00] placeholder:text-slate-40"
                            disabled
                            value={item.reference}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};