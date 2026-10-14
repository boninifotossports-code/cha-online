import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
});

export async function POST(req: Request) {
  try {
    const { giftId, title, price, isQuota } = await req.json();

    const preference = new Preference(client);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const response = await preference.create({
      body: {
        items: [
          {
            id: giftId,
            title: isQuota ? `Cota: ${title}` : title,
            quantity: 1,
            unit_price: Number(price),
            currency_id: "BRL",
          },
        ],
        back_urls: {
          success: `${siteUrl}/?status=success`,
          failure: `${siteUrl}/?status=failure`,
          pending: `${siteUrl}/?status=pending`,
        },
        auto_return: "approved",
        payment_methods: {
          excluded_payment_types: [{ id: "ticket" }], // Remove boleto para focar em Cartão e PIX imediato
          installments: 12,
        },
      },
    });

    return NextResponse.json({ init_point: response.init_point });
  } catch (error) {
    console.error("Erro no checkout do Mercado Pago:", error);
    return NextResponse.json({ error: "Falha ao gerar link de pagamento" }, { status: 500 });
  }
}