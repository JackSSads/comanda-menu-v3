import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";

import { CInput, CSelect } from "../../components";

import { useLoader, useToggleView } from "../../contexts";
import { useDebounce } from "../../hooks/UseDebounce";

import { Delete } from "../../libs/icons";

import { SettingService } from "../../service/setting/SettingService";

export const Settings = ({ showComponent }) => {
  const { toggleView } = useToggleView();
  const { setLoading } = useLoader();

  const { debounce } = useDebounce(1500);

  const [setting, setSetting] = useState({
    setting_id: 1,
    estabishment_name: "",
    serveice_change: 0,
    service_change_percentage: 0,
    image_pix: "",
    color: "",
    service_change_printer: 0,
    printer_name: "",
  });

  const [hasManualChange, setHasManualChange] = useState(false);

  useEffect(() => {
    getSetting();
  }, []);

  useEffect(() => {
    if (!hasManualChange) return;

    debounce(() => {
      updateSetting();
      setHasManualChange(false);
    });
  }, [setting]);

  const handleInput = (field, value) => {
    setSetting((prev) => ({
      ...prev,
      [field]: field === "serveice_change" || field === "service_change_printer"
        ? Number(value.target.value) : value.target.value,
    }));
    setHasManualChange(true);
  };

  const updateSetting = useCallback(() => {
    if (!setting.setting_id) {
      toast.error("Configurações não carregadas.");
      return;
    }

    const payload = {
      estabishment_name: setting.estabishment_name,
      serveice_change: setting.serveice_change,
      service_change_percentage: setting.service_change_percentage,
      image_pix: setting.image_pix,
      color: setting.color,
      service_change_printer: setting.service_change_printer,
      printer_name: setting.printer_name,
    };

    setLoading(true);

    SettingService.update(setting.setting_id, payload)
      .then((result) => {
        getSetting();
        toast.success(result.message);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message || error);
      });
  }, [setting]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Apenas arquivos de imagem (JPG, PNG, WEBP) são permitidos.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ser menor que 5 MB.");
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          const webpDataUrl = canvas.toDataURL("image/webp", 0.8);

          handleInput("image_pix", webpDataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const getSetting = useCallback(() => {
    setLoading(true);

    SettingService.get()
      .then((result) => {
        if (result[0]) {
          const image = result[0].image_pix?.data;

          if (image) {
            const blob = new Blob([new Uint8Array(image)], { type: "image/jpeg" });
            blobToBase64(blob)
              .then((base64Image) => {
                setSetting((prev) => ({
                  ...prev,
                  setting_id: result[0].setting_id,
                  estabishment_name: result[0].estabishment_name,
                  serveice_change: result[0].serveice_change,
                  service_change_percentage: result[0].service_change_percentage,
                  color: result[0].color,
                  image_pix: base64Image,
                  service_change_printer: result[0].service_change_printer,
                  printer_name: result[0].printer_name,
                }));
                setLoading(false);
              })
              .catch((error) => {
                setLoading(false);
                toast.error("Erro ao converter a imagem: " + error.message);
              });
          } else {
            setSetting(result[0]);
            setLoading(false);
          }
        } else if (result?.status === false) {
          setLoading(false);
          toast.error(result.message);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, []);

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve(reader.result);

      reader.onerror = (error) => reject("Erro ao ler o Blob: " + error);

      reader.readAsDataURL(blob);
    });
  };

  return (
    <div className={`w-full ${showComponent === 3 ? "flex" : "hidden"} py-5 flex flex-col gap-6`}>
      <h2 className="w-full text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold">
        Configurações
      </h2>

      <CInput
        id="establishmentName"
        name="establishmentName"
        label="Nome do Estabelecimento"
        placeholder="Ex: Restaurante XYZ"
        onChange={(e) => handleInput("estabishment_name", e)}
        value={setting.estabishment_name}
      />

      <CSelect
        label="Cobrar Taxa de Serviço?"
        options={[{ value: 1, label: "Sim" }, { value: 0, label: "Não" }]}
        value={setting.serveice_change}
        onChange={(e) => handleInput("serveice_change", e)}
      />

      {String(setting.serveice_change) === "1" && (
        <CInput
          id="serviceChargePercentage"
          name="serviceChargePercentage"
          label="Percentual de Taxa de Serviço (%)"
          placeholder="0"
          onChange={(e) => handleInput("service_change_percentage", e)}
          value={setting.service_change_percentage}
        />
      )}

      <CSelect
        label="Imprimir comprovantes?"
        options={[{ value: 1, label: "Sim" }, { value: 0, label: "Não" }]}
        value={setting.service_change_printer}
        onChange={(e) => handleInput("service_change_printer", e)}
      />

      {String(setting.service_change_printer) === "1" && (
        <CInput
          id="serviceChargePercentage"
          name="serviceChargePercentage"
          label="Nome da impressora"
          placeholder="Ex: Epson TM-T20"
          onChange={(e) => handleInput("printer_name", e)}
          value={setting.printer_name}
        />
      )}

      <label className={`${toggleView ? "-z-10" : ""} relative w-full flex flex-col gap-3`}>
        <div className="w-full flex flex-col items-center gap-3 border rounded-xl p-3 relative">
          {setting.image_pix && (
            <div className="flex items-center gap-3">
              <img
                className="w-[250px] rounded-xl object-cover"
                src={setting.image_pix}
                alt="Imagem do QR Code Pix"
              />
              <button
                className="p-2 h-10 text-red-600 rounded-full shadow-md hover:bg-red-100 transition-all delay-75"
                type="button"
                onClick={() => handleInput("image_pix", "")}
                aria-label="Remover imagem QR Code Pix"
              >
                <Delete />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => document.getElementById("qrcodepix").click()}
            className="w-full py-2 bg-[#EB8F00] text-white font-semibold rounded-lg hover:bg-[#1C1D26] transition-all"
          >
            QR Code Pix
          </button>
        </div>

        <input
          type="file"
          id="qrcodepix"
          name="qrcodepix"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </label>
    </div>
  );
};
