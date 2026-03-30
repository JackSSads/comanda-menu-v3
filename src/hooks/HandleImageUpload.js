import toast from "react-hot-toast";

export const handleImageUpload = (e, set, is_qr = false) => {
    const file = e.target.files[0];

    if (file) {
        // Verifica se o arquivo é uma imagem
        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!validTypes.includes(file.type)) {
            toast.error("Apenas arquivos de imagem (JPG, PNG, WEBP) são permitidos.");
            return
        };

        // Verifica se o tamanho do arquivo é maior que 5 mb
        if (file.size > 5 * 1024 * 1024) {
            toast.error("A imagem deve ser menor que 5 MB.");
            return
        };

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
                is_qr ? set((prev) => ({ ...prev, image_pix: webpDataUrl }))
                    : set((prev) => ({ ...prev, image: webpDataUrl }));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };
};