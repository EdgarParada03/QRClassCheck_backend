const QRCode = require('qrcode');

const generarQR = async (texto) => {
  try {
    return await QRCode.toDataURL(texto);
  } catch (err) {
    throw new Error('Error generando QR');
  }
};

module.exports = { generarQR };
