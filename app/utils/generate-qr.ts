import QRCode from "qrcode";

export async function generateQRCode(data: string) {
    try {
    
        const qrCodeDataUrl = await QRCode.toDataURL(data, {
            errorCorrectionLevel: "H",
            width: 300,
            margin: 2,
            color: {
              dark: "#000",
              light: "#fff",
            },
          });
        return { qrCodeDataUrl, data };
      } catch (err) {
        console.error("Error generating QR code:", err);
        throw err;
      }
}