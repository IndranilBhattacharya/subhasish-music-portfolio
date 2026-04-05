/**
 * lib/email.ts
 *
 * Centralized email service for the Subhasish Music store.
 * - Polished HTML template synced with the app's dark/indigo theme
 * - BCC support from RESEND_BCC_EMAILS env (comma-separated)
 * - Dynamic contact phone & address from env
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

/**
 * Build the BCC list from RESEND_BCC_EMAILS env variable.
 * Returns an array of trimmed email addresses, or undefined if empty.
 */
function getBccList(): string[] | undefined {
  const raw = process.env.RESEND_BCC_EMAILS || "";
  const list = raw
    .split(",")
    .map((e) => e.trim())
    .filter((e) => e.length > 0 && e.includes("@"));
  return list.length > 0 ? list : undefined;
}

/**
 * Format currency amount for display.
 */
function formatPrice(amount?: number, currency?: string): string {
  if (!amount) return "";
  const symbol = currency === "USD" ? "$" : "₹";
  return `${symbol}${amount.toLocaleString("en-IN")}`;
}

/**
 * Generate the branded HTML email template.
 */
function buildPurchaseEmailHtml(params: PurchaseEmailParams): string {
  const {
    customerName,
    productName,
    licenseKey,
    downloadUrl,
    amountPaid,
    currency,
    orderId,
  } = params;

  const contactPhone = process.env.CONTACT_PHONE || "";
  const contactAddress = process.env.CONTACT_ADDRESS || "";
  const storeUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://subhasishmusic.com";
  const displayName = customerName || "there";
  const priceDisplay = formatPrice(amountPaid, currency);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Purchase - Subhasish Music</title>
</head>
<body style="margin:0;padding:0;background-color:#050510;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',Roboto,Helvetica,Arial,sans-serif;color:#e5e7eb;-webkit-font-smoothing:antialiased;">
  
  <!-- Outer wrapper -->
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#050510;">
    <tr>
      <td align="center" style="padding:40px 16px 20px;">
        
        <!-- Main card -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:580px;background:linear-gradient(145deg,#0f0d2e 0%,#0a0918 50%,#0d0b24 100%);border:1px solid rgba(99,102,241,0.15);border-radius:24px;overflow:hidden;">
          
          <!-- Header gradient bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa,#6366f1);background-size:200% 100%;"></td>
          </tr>
          
          <!-- Logo & Brand -->
          <tr>
            <td align="center" style="padding:36px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);width:48px;height:48px;border-radius:14px;text-align:center;vertical-align:middle;">
                    <span style="font-size:24px;line-height:48px;">🎵</span>
                  </td>
                  <td style="padding-left:14px;">
                    <p style="margin:0;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">Subhasish Music</p>
                    <p style="margin:2px 0 0;font-size:11px;font-weight:600;color:#818cf8;text-transform:uppercase;letter-spacing:2px;">The Vault</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Success badge -->
          <tr>
            <td align="center" style="padding:32px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:100px;padding:8px 24px;">
                    <span style="font-size:13px;font-weight:700;color:#4ade80;letter-spacing:0.5px;">✓ PAYMENT CONFIRMED</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:28px 32px 0;text-align:center;">
              <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#ffffff;line-height:1.3;">Thank you, ${displayName}!</h1>
              <p style="margin:0;font-size:15px;color:#9ca3af;line-height:1.6;">
                Your purchase of <strong style="color:#c7d2fe;">${productName}</strong> has been processed successfully.
                ${priceDisplay ? `<br/>Amount paid: <strong style="color:#ffffff;">${priceDisplay}</strong>` : ""}
              </p>
            </td>
          </tr>

          <!-- License Key -->
          <tr>
            <td style="padding:28px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:rgba(255,255,255,0.03);border:1px solid rgba(99,102,241,0.2);border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px 16px;">
                    <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#818cf8;text-transform:uppercase;letter-spacing:2.5px;">🔑 License Key</p>
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="background:rgba(0,0,0,0.5);border:1px solid rgba(99,102,241,0.15);border-radius:12px;padding:16px 20px;">
                          <p style="margin:0;font-family:'SF Mono','Fira Code','Cascadia Code',Consolas,monospace;font-size:15px;color:#4ade80;word-break:break-all;line-height:1.5;letter-spacing:0.5px;">${licenseKey}</p>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:10px 0 0;font-size:12px;color:#6b7280;line-height:1.5;">
                      This is your unique license key — keep it safe. It serves as your proof of purchase and is needed for re-downloads.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Download Button -->
          ${downloadUrl ? `
          <tr>
            <td align="center" style="padding:24px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:14px;background:linear-gradient(135deg,#6366f1,#7c3aed);">
                    <a href="${downloadUrl}" target="_blank" style="display:inline-block;padding:16px 48px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">
                      ⬇ Download ${productName}
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:12px 0 0;font-size:12px;color:#6b7280;">This download link expires in <strong style="color:#9ca3af;">24 hours</strong>.</p>
            </td>
          </tr>
          ` : ""}

          <!-- Order Details -->
          <tr>
            <td style="padding:28px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:2px;">Order Summary</p>
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#9ca3af;">Product</td>
                        <td align="right" style="padding:4px 0;font-size:13px;color:#e5e7eb;font-weight:600;">${productName}</td>
                      </tr>
                      ${priceDisplay ? `
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#9ca3af;">Amount</td>
                        <td align="right" style="padding:4px 0;font-size:13px;color:#e5e7eb;font-weight:600;">${priceDisplay}</td>
                      </tr>
                      ` : ""}
                      ${orderId ? `
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#9ca3af;">Order ID</td>
                        <td align="right" style="padding:4px 0;font-size:11px;color:#6b7280;font-family:monospace;">${orderId.slice(0, 8)}…</td>
                      </tr>
                      ` : ""}
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#9ca3af;">Device Locked</td>
                        <td align="right" style="padding:4px 0;font-size:13px;color:#818cf8;font-weight:600;">Yes ✓</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:28px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="border-top:1px solid rgba(255,255,255,0.06);"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 36px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#9ca3af;">Subhasish Music</p>
              ${contactPhone ? `<p style="margin:0 0 4px;font-size:12px;color:#6b7280;">📞 ${contactPhone}</p>` : ""}
              ${contactAddress ? `<p style="margin:0 0 12px;font-size:12px;color:#6b7280;">📍 ${contactAddress}</p>` : ""}
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="${storeUrl}/samples-store" style="font-size:12px;color:#818cf8;text-decoration:none;font-weight:600;">Visit Store</a>
                  </td>
                  <td style="color:#374151;">·</td>
                  <td style="padding:0 8px;">
                    <a href="${storeUrl}" style="font-size:12px;color:#818cf8;text-decoration:none;font-weight:600;">Website</a>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0;font-size:11px;color:#374151;line-height:1.5;">
                You're receiving this email because you made a purchase on Subhasish Music.<br/>
                If you have any questions, reach out to us at the contact above.
              </p>
            </td>
          </tr>

        </table>
        <!-- End main card -->

      </td>
    </tr>
  </table>
  <!-- End outer wrapper -->

</body>
</html>`;
}

/**
 * Send a purchase confirmation email via Resend.
 * Includes BCC to configured admin emails.
 */
export async function sendPurchaseEmail(params: PurchaseEmailParams): Promise<void> {
  const { customerEmail } = params;
  if (!customerEmail) {
    console.warn("[EMAIL] No customer email — skipping.");
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "YOUR_RESEND_API_KEY") {
    console.warn("[EMAIL] RESEND_API_KEY not configured — skipping email.");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const from = process.env.RESEND_FROM_EMAIL || "Subhasish Music <onboarding@resend.dev>";
    const bcc = getBccList();
    const html = buildPurchaseEmailHtml(params);

    await resend.emails.send({
      from,
      to: customerEmail,
      bcc,
      subject: `Your Purchase: ${params.productName} — License Key & Download`,
      html,
    });

    console.log(`[EMAIL SENT] To: ${customerEmail}${bcc ? ` | BCC: ${bcc.join(", ")}` : ""}`);
  } catch (err: any) {
    // Never let email failure break the payment flow
    console.error("[EMAIL ERROR]", err.message);
  }
}
