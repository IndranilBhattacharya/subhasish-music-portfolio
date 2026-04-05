/**
 * lib/email.ts
 *
 * Centralized email service for Subhasish Music.
 * - Brand-matched email with S logo + "UBHASISH" text
 * - Copy button for license key
 * - BCC from RESEND_BCC_EMAILS env
 * - Contact details from env
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
  if (currency === "USD") return `$${amount.toFixed(2)}`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function buildPurchaseEmailHtml(params: PurchaseEmailParams): string {
  const { customerName, productName, licenseKey, downloadUrl, amountPaid, currency, orderId } = params;
  const contactPhone = process.env.CONTACT_PHONE || "";
  const contactAddress = process.env.CONTACT_ADDRESS || "";
  const storeUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://subhasishmusic.com";
  const displayName = customerName || "there";
  const priceDisplay = formatPrice(amountPaid, currency);
  const logoUrl = "https://i.ibb.co/QvZqH1Q6/subhasish-logo-s.png";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Order Confirmation — Subhasish</title>
</head>
<body style="margin:0;padding:0;background-color:#0c0c0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#e4e4e7;">

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#0c0c0f;">
    <tr>
      <td align="center" style="padding:40px 16px 32px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px;">

          <!-- Brand Header: S logo + UBHASISH -->
          <tr>
            <td align="center" style="padding:0 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="${logoUrl}" alt="S" width="28" height="28" style="display:block;border:0;" />
                  </td>
                  <td style="vertical-align:middle;padding-left:2px;">
                    <span style="font-size:14px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:1.5px;">ubhasish</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color:#18181b;border-radius:16px;overflow:hidden;border:1px solid #27272a;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">

                <!-- Accent line -->
                <tr>
                  <td style="height:3px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#6366f1);"></td>
                </tr>

                <!-- Confirmation Badge + Greeting -->
                <tr>
                  <td style="padding:32px 28px 0;text-align:center;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td style="background-color:#052e16;border:1px solid #14532d;border-radius:100px;padding:5px 16px;">
                          <span style="font-size:12px;font-weight:600;color:#4ade80;letter-spacing:0.5px;">&#10003; Payment Confirmed</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 28px 0;text-align:center;">
                    <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#fafafa;line-height:1.3;">Hey ${displayName}!</h1>
                    <p style="margin:0;font-size:14px;color:#a1a1aa;line-height:1.6;">
                      Your purchase of <strong style="color:#e4e4e7;">${productName}</strong> was successful.${priceDisplay ? ` Amount: <strong style="color:#e4e4e7;">${priceDisplay}</strong>` : ""}
                    </p>
                  </td>
                </tr>

                <!-- License Key Section -->
                <tr>
                  <td style="padding:24px 28px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#0f0f12;border:1px solid #27272a;border-radius:12px;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="font-size:11px;font-weight:700;color:#71717a;text-transform:uppercase;letter-spacing:1.5px;padding-bottom:10px;">License Key</td>
                              <td align="right" style="padding-bottom:10px;">
                                <a href="javascript:void(0)" onclick="navigator.clipboard.writeText('${licenseKey}')" style="font-size:11px;font-weight:600;color:#818cf8;text-decoration:none;background-color:#1e1b4b;border:1px solid #312e81;border-radius:6px;padding:3px 10px;letter-spacing:0.3px;">Copy</a>
                              </td>
                            </tr>
                          </table>
                          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="background-color:#09090b;border:1px solid #1c1c22;border-radius:8px;padding:14px 16px;">
                                <p style="margin:0;font-family:'SF Mono','Fira Code','Cascadia Code',Consolas,monospace;font-size:14px;color:#a78bfa;word-break:break-all;line-height:1.6;">${licenseKey}</p>
                              </td>
                            </tr>
                          </table>
                          <p style="margin:8px 0 0;font-size:11px;color:#52525b;">This is your permanent license key. Keep it secure.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Download Button -->
                ${downloadUrl ? `
                <tr>
                  <td style="padding:20px 28px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="background-color:#fafafa;border-radius:10px;">
                          <a href="${downloadUrl}" target="_blank" style="display:block;padding:14px 20px;font-size:14px;font-weight:600;color:#18181b;text-decoration:none;text-align:center;letter-spacing:0.2px;">&#8595;&nbsp;&nbsp;Download ${productName}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ""}

                <!-- Order Summary -->
                <tr>
                  <td style="padding:24px 28px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #27272a;">
                      <tr>
                        <td colspan="2" style="padding:16px 0 8px;font-size:11px;font-weight:700;color:#52525b;text-transform:uppercase;letter-spacing:1.5px;">Order Details</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#71717a;">Product</td>
                        <td align="right" style="padding:6px 0;font-size:13px;color:#e4e4e7;font-weight:500;">${productName}</td>
                      </tr>
                      ${priceDisplay ? `<tr>
                        <td style="padding:6px 0;font-size:13px;color:#71717a;">Amount</td>
                        <td align="right" style="padding:6px 0;font-size:13px;color:#e4e4e7;font-weight:500;">${priceDisplay}</td>
                      </tr>` : ""}
                      ${orderId ? `<tr>
                        <td style="padding:6px 0;font-size:13px;color:#71717a;">Order</td>
                        <td align="right" style="padding:6px 0;font-size:12px;color:#52525b;font-family:monospace;">${orderId.slice(0, 8)}...</td>
                      </tr>` : ""}
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#71717a;">License</td>
                        <td align="right" style="padding:6px 0;font-size:13px;color:#4ade80;font-weight:500;">Permanent &#10003;</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Bottom padding -->
                <tr><td style="height:28px;"></td></tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 8px 0;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="${logoUrl}" alt="S" width="16" height="16" style="display:block;border:0;opacity:0.5;" />
                  </td>
                  <td style="vertical-align:middle;padding-left:2px;">
                    <span style="font-size:11px;font-weight:700;color:#52525b;text-transform:uppercase;letter-spacing:1px;">ubhasish</span>
                  </td>
                </tr>
              </table>
              ${contactPhone ? `<p style="margin:8px 0 0;font-size:12px;color:#3f3f46;">${contactPhone}</p>` : ""}
              ${contactAddress ? `<p style="margin:2px 0 0;font-size:12px;color:#3f3f46;">${contactAddress}</p>` : ""}
              <p style="margin:12px 0 0;">
                <a href="${storeUrl}/samples-store" style="font-size:11px;color:#71717a;text-decoration:none;">Store</a>
                <span style="color:#27272a;margin:0 6px;">&middot;</span>
                <a href="${storeUrl}" style="font-size:11px;color:#71717a;text-decoration:none;">Website</a>
              </p>
              <p style="margin:16px 0 0;font-size:10px;color:#27272a;line-height:1.5;">
                You received this because you made a purchase on subhasishmusic.com
              </p>
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
