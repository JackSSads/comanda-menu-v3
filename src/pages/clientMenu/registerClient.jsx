import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useLoader } from "../../contexts";

import { Navbar, CInput, CTextarea } from "../../components";

import { CheckService } from "../../service/check/CheckService";
import { CashierService } from "../../service/cashier/CashierService"
import { LoginService } from "../../service/login/LoginService";

export const RegisterClient = () => {

    const navigate = useNavigate();
    const { loading, setLoading } = useLoader();

    const [value, setValue] = useState({
        name_client: "",
        cashier_id: null,
        obs: "",
        street: "",
        house_number: "",
        reference: "",
    });

    useEffect(() => {
        setLoading(false);

        const func = localStorage.getItem("func");
        if (func) {
            localStorage.removeItem("func");
            localStorage.removeItem("token");
        };

        const check_id = localStorage.getItem("check_id");
        if (check_id) {
            navigate(`/${check_id}/products`);
        };
    }, []);

    const handleInput = (field, event) => {
        setValue(prev => ({ ...prev, [field]: event.target.value }));
    };

    const getCashier = useCallback(() => {
        CashierService.getByStatus(1)
            .then((result) => {
                if (result.length > 0) {
                    createCheck(result[0].cashier_id);
                    return
                };

                setLoading(false);
                return toast.error(result.message);
            }).catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, [value]);

    const authenticateClient = useCallback(() => {
        if (value.name_client === "") {
            return toast.error("O nome do cliente é obrigatório.");
        };

        localStorage.setItem("client", value.name_client);

        LoginService.Create_token_for_client(value.name_client)
            .then((result) => {
                if (result.status) {
                    localStorage.setItem("token", result.token);
                    getCashier();
                    return
                };

                setLoading(false);
                return toast.error(result.message);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, [value]);

    const createCheck = useCallback((cashier_id) => {
        const data = {
            name_client: value.name_client,
            cashier_id,
            obs: value.obs,
            street: value.street,
            house_number: value.house_number,
            reference: value.reference,
        };

        CheckService.createClosed(data)
            .then((result) => {
                if (result.status) {
                    localStorage.setItem("check_id", result.check_id);
                    navigate(`/${result.check_id}/products`);
                    setValue(prev => ({ ...prev, name_client: "", obs: "" }));
                    setLoading(false);

                    return toast.success(result.message);
                };

                setLoading(false);
                return toast.error(result.message);
            }).catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });

    }, [value]);

    return (
        <>
            <Navbar title="Bem-vindo" url />

            <div className="w-full min-h-[85vh] flex items-center justify-center">
                <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <CInput
                            id="name_client"
                            name="name_client"
                            placeholder="Nome do cliente"
                            onChange={(e) => handleInput("name_client", e)}
                            value={value.name_client}
                        />

                        <CInput
                            id="street"
                            name="street"
                            placeholder="Rua"
                            onChange={(e) => handleInput("street", e)}
                            value={value.street}
                        />

                        <CInput
                            id="house_number"
                            name="house_number"
                            placeholder="Número da casa"
                            onChange={(e) => handleInput("house_number", e)}
                            value={value.house_number}
                        />

                        <CInput
                            id="reference"
                            name="reference"
                            placeholder="Referência"
                            onChange={(e) => handleInput("reference", e)}
                            value={value.reference}
                        />

                        <CTextarea
                            id="obs"
                            name="obs"
                            placeholder="Observação"
                            onChange={(e) => handleInput("obs", e)}
                            value={value.obs}
                        />
                    </div>

                    <button
                        onClick={authenticateClient}
                        disabled={loading}
                        className="w-full rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] text-white font-semibold py-3 transition-colors duration-200 disabled:opacity-50">
                        {loading ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </div>
            </div>
        </>
    );
};
