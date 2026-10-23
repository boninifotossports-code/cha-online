import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
});

export async function POST(req: Request) {
  try {
    const { giftId, title, price, isQuota, quantity = 1 } = await req.json();

    const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arthurepyetra.vercel.app";
    const siteUrl = rawSiteUrl.replace(/\/$/, "");

    const preference = new Preference(client);

    const unitPrice = parseFloat(Number(price).toFixed(2));
    const qty = parseInt(String(quantity), 10) || 1;

    const response = await preference.create({
      body: {
        items: [
          {
            id: String(giftId),
            title: isQuota ? `Cota (${qty}x): ${title}` : String(title).slice(0, 100),
            quantity: qty,
            unit_price: unitPrice,
            currency_id: "BRL",
          },
        ],
        metadata: {
          gift_id: String(giftId),
          is_quota: Boolean(isQuota),
          quantity: qty,
        },
        back_urls: {
          success: `${siteUrl}/?status=success`,
          failure: `${siteUrl}/?status=failure`,
          pending: `${siteUrl}/?status=pending`,
        },
        notification_url: `${siteUrl}/api/webhooks/mercadopago`,
        payment_methods: {
          excluded_payment_types: [{ id: "ticket" }],
          installments: 12,
        },
      },
    });

    return NextResponse.json({ init_point: response.init_point });
  } catch (error: any) {
    console.error("Erro detalhado Mercado Pago:", error);
    return NextResponse.json(
      { error: "Falha ao gerar link de pagamento", details: error?.message },
      { status: 500 }
    );
  }
}
