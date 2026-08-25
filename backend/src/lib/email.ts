import { Resend } from "resend";
import { env } from "./env.js";

type OrderEmailPayload = {
  number: string;
  customerName: string;
  company?: string | null;
  city: string;
  state: string;
  phone: string;
  email: string;
  notes?: string | null;
  total: string;
  items: Array<{
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: string;
    lineTotal: string;
  }>;
};

function formatOrderHtml(order: OrderEmailPayload, forCustomer: boolean) {
  const items = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.productName}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.quantity} ${item.unit}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">R$ ${item.unitPrice}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">R$ ${item.lineTotal}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:Georgia,serif;color:#1a1a1a">
      <h1 style="font-size:22px">${forCustomer ? "Recebemos o seu pedido" : "Novo pedido Mustafá"}</h1>
      <p><strong>Pedido:</strong> ${order.number}</p>
      <p><strong>Cliente:</strong> ${order.customerName}${order.company ? ` — ${order.company}` : ""}</p>
      <p><strong>Cidade:</strong> ${order.city}/${order.state}</p>
      <p><strong>Telefone:</strong> ${order.phone}</p>
      <p><strong>E-mail:</strong> ${order.email}</p>
      ${order.notes ? `<p><strong>Observações:</strong> ${order.notes}</p>` : ""}
      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <thead>
          <tr>
            <th align="left" style="padding:8px;border-bottom:2px solid #222">Produto</th>
            <th align="left" style="padding:8px;border-bottom:2px solid #222">Qtd</th>
            <th align="left" style="padding:8px;border-bottom:2px solid #222">Preço</th>
            <th align="left" style="padding:8px;border-bottom:2px solid #222">Total</th>
          </tr>
        </thead>
        <tbody>${items}</tbody>
      </table>
      <p style="margin-top:16px;font-size:18px"><strong>Total: R$ ${order.total}</strong></p>
      ${
        forCustomer
          ? "<p>Em breve a equipe Mustafá entra em contato para confirmar o pedido.</p>"
          : "<p>Acesse o painel admin para analisar e atualizar o status.</p>"
      }
    </div>
  `;
}

export async function sendOrderEmails(order: OrderEmailPayload) {
  if (!env.resendApiKey) {
    console.warn("RESEND_API_KEY not set — skipping e-mail notification");
    return;
  }

  const resend = new Resend(env.resendApiKey);
  const tasks: Promise<unknown>[] = [];

  if (env.orderNotifyEmail) {
    tasks.push(
      resend.emails.send({
        from: env.emailFrom,
        to: env.orderNotifyEmail,
        subject: `Novo pedido ${order.number} — Mustafá`,
        html: formatOrderHtml(order, false),
      })
    );
  }

  tasks.push(
    resend.emails.send({
      from: env.emailFrom,
      to: order.email,
      subject: `Pedido ${order.number} recebido — Mustafá`,
      html: formatOrderHtml(order, true),
    })
  );

  await Promise.allSettled(tasks);
}
