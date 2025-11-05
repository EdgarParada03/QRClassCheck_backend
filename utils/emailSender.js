const sgMail = require('@sendgrid/mail');

// Configurar la API Key de SendGrid desde variables de entorno
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const enviarCorreoConAdjunto = async (destinatario, pdfBuffer, nombreArchivo) => {
  const msg = {
    to: destinatario,
    from: process.env.CORREO_EMISOR, // ⚠️ Debe estar verificado en SendGrid
    subject: 'Reporte de asistencia',
    text: 'Adjunto encontrarás el reporte de asistencia en formato PDF.',
    attachments: [
      {
        content: pdfBuffer.toString("base64"), // SendGrid requiere base64
        filename: nombreArchivo,
        type: "application/pdf",
        disposition: "attachment"
      }
    ]
  };

  await sgMail.send(msg);
};

module.exports = { enviarCorreoConAdjunto };
