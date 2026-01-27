// src/services/EmailService.ts
import nodemailer from "nodemailer";

export class EmailService {
  private transporter = nodemailer.createTransport({
    // Configura aquí tu SMTP (Gmail, AWS SES, Mailgun)
    service: 'gmail', 
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  async sendConfirmation(email: string, token: string) {
    const url = `http://tu-api.com/auth/confirm/${token}`;
    await this.transporter.sendMail({
      to: email,
      subject: "Confirma tu cuenta",
      html: `<a href="${url}">Click aquí para confirmar</a>`
    });
  }

  async sendProductArrived(email: string, productName: string) {
    await this.transporter.sendMail({
      to: email,
      subject: "¡Tu paquete ha llegado!",
      text: `Tu producto ${productName} ha sido entregado exitosamente.`
    });
  }
}