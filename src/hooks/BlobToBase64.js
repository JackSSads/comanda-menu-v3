export const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => resolve(reader.result);

        reader.onerror = (error) => reject("Erro ao ler o Blob: " + error);

        reader.readAsDataURL(blob);
    });
};