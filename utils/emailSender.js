const nodemailer = require('nodemailer');

const enviarCorreoConAdjunto = async (destinatario, pdfBuffer, nombreArchivo) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CORREO_EMISOR,
      pass: process.env.CORREO_CLAVE
    }
  });

  const mailOptions = {
    from: `"QRClassCheck" <${process.env.CORREO_EMISOR}>`,
    to: destinatario,
    subject: 'Reporte de asistencia',
    text: 'Adjunto encontrarás el reporte de asistencia en formato PDF.',
    attachments: [
      {
        filename: nombreArchivo,
        content: pdfBuffer
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { enviarCorreoConAdjunto };
