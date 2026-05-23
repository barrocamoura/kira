import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, role, message } = body;

    // Use environment variables for Nodemailer transport
    // Fallback to testing mode or ask user to provide real SMTP later
    // The user can fill out these env defaults inside their .env.local
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER, // e.g. their Gmail
        pass: process.env.SMTP_PASS, // e.g. App Password
      },
    });

    const mailOptions = {
        from: `"${name}" <${email}>`, 
        to: process.env.RECEIVER_EMAIL || 'contacto@sperosystems.pt',
        subject: `Novo Pedido de Demo Spero MES: ${company}`,
        text: `
Nome: ${name}
Email: ${email}
Telefone: ${phone}
Empresa: ${company}
Cargo: ${role}

Mensagem Adicional: 
${message || "Sem mensagem submetida."}
        `,
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #ccc; border-radius: 8px;">
            <h2 style="color: #0b1121; border-bottom: 2px solid #38bdf8; padding-bottom: 10px;">Novo Pedido de Demonstração (Spero MES)</h2>
            <ul style="list-style: none; padding: 0; margin-top: 20px;">
                <li style="margin-bottom: 10px;"><strong>Organização:</strong> ${company}</li>
                <li style="margin-bottom: 10px;"><strong>Nome do Contacto:</strong> ${name} (<em>${role}</em>)</li>
                <li style="margin-bottom: 10px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
                <li style="margin-bottom: 10px;"><strong>Telemóvel/Telefone:</strong> ${phone}</li>
            </ul>
            <div style="margin-top: 25px; padding: 15px; background-color: #f8fafc; border-radius: 6px; border-left: 4px solid #38bdf8;">
                <h4 style="margin-top: 0;">Contexto Adicional / Mensagem:</h4>
                <p style="white-space: pre-wrap;">${message || "Nenhuma mensagem preenchida."}</p>
            </div>
            <p style="margin-top: 30px; font-size: 0.9em; color: #64748b;">E-mail gerado automaticamente pelo B2B Demo Catcher.</p>
        </div>
        `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    return NextResponse.json({ success: true, message: "E-mail enviado com sucesso" }, { status: 200 });

  } catch (error: any) {
    console.error("Erro no envio do email:", error);
    return NextResponse.json(
      { success: false, message: "Avaria no envio de E-mail. Verifique o seu SMTP.", error: error.message },
      { status: 500 }
    );
  }
}
