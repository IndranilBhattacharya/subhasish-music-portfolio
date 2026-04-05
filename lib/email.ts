/**
 * lib/email.ts
 *
 * Centralized email service for the Subhasish Music store.
 * - Clean, professional email template
 * - BCC support from RESEND_BCC_EMAILS env
 * - Contact phone & address from env
 * - Shared by both verify-payment and webhook handlers
 */

interface PurchaseEmailParams {
  customerEmail: string;
  customerName: string;
  productName: string;
  licenseKey: string;
  downloadUrl?: string;
  amountPaid?: number;
  currency?: string;
  orderId?: string;
}

function getBccList(): string[] | undefined {
  const raw = process.env.RESEND_BCC_EMAILS || "";
  const list = raw.split(",").map((e) => e.trim()).filter((e) => e.includes("@"));
  return list.length > 0 ? list : undefined;
}

function formatPrice(amount?: number, currency?: string): string {
  if (!amount) return "";
  const symbol = currency === "USD" ? "$" : "₹";
  return `${symbol}${amount.toLocaleString("en-IN")}`;
}

function buildPurchaseEmailHtml(params: PurchaseEmailParams): string {
  const { customerName, productName, licenseKey, downloadUrl, amountPaid, currency, orderId } = params;
  const contactPhone = process.env.CONTACT_PHONE || "";
  const contactAddress = process.env.CONTACT_ADDRESS || "";
  const storeUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://subhasishmusic.com";
  const displayName = customerName || "there";
  const priceDisplay = formatPrice(amountPaid, currency);
  const logoUrl = `${storeUrl}/icons/icon-192x192.png`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Purchase Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:0 0 24px;">
              <img src="${logoUrl}" alt="Subhasish Music" width="48" height="48" style="display:block;border-radius:12px;border:0;" />
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">

                <!-- Header -->
                <tr>
                  <td style="padding:32px 32px 0;text-align:center;">
                    <p style="display:inline-block;background-color:#ecfdf5;color:#059669;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:6px 16px;border-radius:100px;margin:0 0 20px;">Payment Confirmed</p>
                    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;line-height:1.3;">Thank you, ${displayName}!</h1>
                    <p style="margin:0;font-size:14px;color:#71717a;line-height:1.6;">Your purchase of <strong style="color:#18181b;">${productName}</strong> is complete.</p>
                  </td>
                </tr>

                <!-- License Key -->
                <tr>
                  <td style="padding:24px 32px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#fafafa;border:1px solid #e4e4e7;border-radius:8px;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#a1a1aa;text-transform:uppercase;letter-spacing:1.5px;">License Key</p>
                          <p style="margin:0;font-family:'SF Mono','Fira Code',Consolas,monospace;font-size:14px;color:#18181b;word-break:break-all;line-height:1.6;background-color:#ffffff;border:1px solid #e4e4e7;border-radius:6px;padding:12px 16px;">${licenseKey}</p>
                          <p style="margin:8px 0 0;font-size:12px;color:#a1a1aa;">This is your permanent license key. Keep it safe.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Download Button -->
                ${downloadUrl ? `
                <tr>
                  <td align="center" style="padding:24px 32px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:320px;">
                      <tr>
                        <td align="center" style="background-color:#18181b;border-radius:8px;">
                          <a href="${downloadUrl}" target="_blank" style="display:block;padding:14px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;text-align:center;">Download ${productName}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ""}

                <!-- Order Summary -->
                <tr>
                  <td style="padding:24px 32px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #f4f4f5;padding-top:16px;">
                      <tr>
                        <td style="padding:8px 0;font-size:13px;color:#71717a;">Product</td>
                        <td align="right" style="padding:8px 0;font-size:13px;color:#18181b;font-weight:600;">${productName}</td>
                      </tr>
                      ${priceDisplay ? `<tr>
                        <td style="padding:8px 0;font-size:13px;color:#71717a;">Amount Paid</td>
                        <td align="right" style="padding:8px 0;font-size:13px;color:#18181b;font-weight:600;">${priceDisplay}</td>
                      </tr>` : ""}
                      ${orderId ? `<tr>
                        <td style="padding:8px 0;font-size:13px;color:#71717a;">Order</td>
                        <td align="right" style="padding:8px 0;font-size:12px;color:#a1a1aa;font-family:monospace;">${orderId.slice(0, 8)}...</td>
                      </tr>` : ""}
                    </table>
                  </td>
                </tr>

                <!-- Spacer -->
                <tr><td style="height:32px;"></td></tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 16px 0;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#71717a;">Subhasish Music</p>
              ${contactPhone ? `<p style="margin:0 0 2px;font-size:12px;color:#a1a1aa;">${contactPhone}</p>` : ""}
              ${contactAddress ? `<p style="margin:0 0 12px;font-size:12px;color:#a1a1aa;">${contactAddress}</p>` : ""}
              <p style="margin:0;font-size:11px;color:#d4d4d8;">
                <a href="${storeUrl}/samples-store" style="color:#71717a;text-decoration:none;">Store</a>
                &nbsp;&middot;&nbsp;
                <a href="${storeUrl}" style="color:#71717a;text-decoration:none;">Website</a>
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:#d4d4d8;">You received this email because of a purchase on Subhasish Music.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendPurchaseEmail(params: PurchaseEmailParams): Promise<void> {
  const { customerEmail } = params;
  if (!customerEmail) {
    console.warn("[EMAIL] No customer email — skipping.");
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "YOUR_RESEND_API_KEY") {
    console.warn("[EMAIL] RESEND_API_KEY not configured — skipping.");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM_EMAIL || "Subhasish Music <onboarding@resend.dev>";
    const bcc = getBccList();

    await resend.emails.send({
      from,
      to: customerEmail,
      bcc,
      subject: `Order Confirmed — ${params.productName}`,
      html: buildPurchaseEmailHtml(params),
    });

    console.log(`[EMAIL SENT] To: ${customerEmail}${bcc ? ` | BCC: ${bcc.join(", ")}` : ""}`);
  } catch (err: any) {
    console.error("[EMAIL ERROR]", err.message);
  }
}
