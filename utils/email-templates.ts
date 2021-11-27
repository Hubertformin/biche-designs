import {PaymentModel} from "../models/payment.model";
import {formatDate} from "./date.utils";
import {CartModel, ItemModel} from "../models/item.model";
import {formatCurrency} from "./format-currency.util";
import {formatStockStatus} from "./stock.utils";
import {EMAIL_STYLES} from "../data/email-styles";

function generateItemTable(items: any[], type = 'inv') {
    return items.map(item => {
        return ` <tr>
                <td style="width: 10%" class="purchase_item">
                    <img src="${item.thumbnails.small}" style="width: 45px;border-radius: 5px;object-fit: cover;height: 45px;display: inline;" class="logo-img"  alt="">
                </td>
                <td style="width: 60%"  class="purchase_item"><span class="f-fallback" style="padding-left: 10px;">${item.name}</span></td>
                <td style="width: 10%"  class="purchase_item"><span class="f-fallback">${item.quantity}</span></td>
                ${type === 'inv' ? `<td style="width: 20%"  class="align-right purchase_item"><span class="f-fallback">${formatCurrency(item.quantity * item.unitPrice)}</span></td>` :
                                    `<td style="width: 20%"  class="align-right purchase_item"><span class="f-fallback">${formatStockStatus(item.stockStatus)}</span></td>`}
            </tr>`;
    });
}

export function generatePurchaseEmailTemplate({
                                                  payment,
                                                  supportMail, card
}: {payment: PaymentModel, supportMail: string, card: {brand: string, last4: string}}): string {
    const action = payment.preOrder ? 'pre-order' : 'purchase';
    return (`
       <html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    ${EMAIL_STYLES}
    
    <!--[if mso]>
    <style type="text/css">
        .f-fallback  {
            font-family: Arial, sans-serif;
        }
    </style>
    <![endif]-->
</head>
<body>
<span class="preheader">This is a receipt for your recent purchase on ${formatDate(payment.date)}. No payment is due with this receipt.</span>
<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center">
            <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                    <td class="email-masthead">
                        <a href="https://bichedesigns.com" class="f-fallback email-masthead_name">
                            <img class="logo-img" src="https://firebasestorage.googleapis.com/v0/b/biche-designs.appspot.com/o/images%2Ftext-logo.png?alt=media&token=1b860f6c-ab2d-4200-a02a-12a203460d84" alt="">
                        </a>
                    </td>
                </tr>
                <!-- Email Body -->
                <tr>
                    <td class="email-body" width="100%" cellpadding="0" cellspacing="0">
                        <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                            <!-- Body content -->
                            <tr>
                                <td class="content-cell">
                                    <div class="f-fallback">
                                        <h1>Hi ${payment.user.name},</h1>
                                        <p>Thank you for your ${action} from BICHE Designs. This email is the receipt for your ${action}. No payment is due.</p>
                                        <p>This purchase will appear as “BICHE DESIGNS” as purchase statement for your ${card?.brand} card ${card?.last4 ? '**** **** ****' + card?.last4 : ''}.</p>
                                        <table class="purchase" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                            <tr>
                                                <td>
                                                    <h3>INV ${payment.invoiceNumber}</h3></td>
                                                <td>
                                                    <h3 class="align-right">${formatDate(payment.date)}</h3></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <table class="purchase_content" width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <th class="purchase_heading" align="left">
                                                                <p class="f-fallback">#</p>
                                                            </th>
                                                            <th class="purchase_heading" align="left">
                                                                <p class="f-fallback">Description</p>
                                                            </th>
                                                            <th class="purchase_heading" align="left">
                                                                <p class="f-fallback">Qty</p>
                                                            </th>
                                                            <th class="purchase_heading" align="right">
                                                                <p class="f-fallback">Amount</p>
                                                            </th>
                                                        </tr>
                                                       ${generateItemTable(payment.items)}
                                                        <tr>
                                                            <td style="width: 10%" class="purchase_footer"></td>
                                                            <td style="width: 60%"  class="purchase_footer">
                                                                <p class="f-fallback purchase_total purchase_total--label">Total</p>
                                                            </td>
                                                            <td style="width: 10%" class="purchase_footer"></td>
                                                            <td style="width: 20%" class="purchase_footer">
                                                                <p class="f-fallback purchase_total">${formatCurrency(payment.amount)}</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <p>Your order has been received and is being processed, you'll be contacted shortly to confirm your delivery address.</p>
                                        <p>If you have any questions about this receipt, simply reply to this email or reach out to our <a href="mailto:${supportMail}">support team</a> for help.</p>
                                        <p>Cheers,
                                            <br>The BICHE Designs Team</p>
                                        <!-- Action -->
                                        <!--<table class="body-action" role="presentation">
                                            <tr>
                                                <td style="align-items: center;">
                                                    <table style="width: 100%;" role="presentation">
                                                        <tr>
                                                            <td style="text-align: center;">
                                                                <a href="https://bichedesigns.com/api/inv/download?id=${payment.id}" class="f-fallback button button--blue" target="_blank">Download Invoice PDF</a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>-->
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                                <td class="content-cell" align="center">
                                    <p class="f-fallback sub align-center">&copy; ${new Date().getFullYear()} BICHE DESIGNS. All rights reserved.</p>
                                    <p class="f-fallback sub align-center">
                                        BICHE Designs
                                        <br>Rome, Italy.
                                        <br>+ 3(935) 1 962 8987
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
    `);
}

export function generateStockReportEmail(items: ItemModel[]) {
    return (`
       <html>
       <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
          ${EMAIL_STYLES}
        </head>
        <body>
        <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center">
            <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                    <td class="email-masthead">
                        <a href="https://bichedesigns.com" class="f-fallback email-masthead_name">
                            <img class="logo-img" src="https://firebasestorage.googleapis.com/v0/b/biche-designs.appspot.com/o/images%2Ftext-logo.png?alt=media&token=1b860f6c-ab2d-4200-a02a-12a203460d84" alt="">
                        </a>
                    </td>
                </tr>
                <!-- Email Body -->
                <tr>
                    <td class="email-body" width="100%" cellpadding="0" cellspacing="0">
                        <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                            <!-- Body content -->
                            <tr>
                                <td class="content-cell">
                                    <div class="f-fallback">
                                        <h1>Hello Admin,</h1>
                                        <p>Your inventory requires attention!. The Item(s) below are running low on stock or are out of stock</p>
                                        <table class="purchase" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                            <tr>
                                                <td colspan="2">
                                                    <table class="purchase_content" width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <th class="purchase_heading" align="left">
                                                                <p class="f-fallback">#</p>
                                                            </th>
                                                            <th class="purchase_heading" align="left">
                                                                <p class="f-fallback">Description</p>
                                                            </th>
                                                            <th class="purchase_heading" align="left">
                                                                <p class="f-fallback">Qty</p>
                                                            </th>
                                                            <th class="purchase_heading" align="right">
                                                                <p class="f-fallback">Status</p>
                                                            </th>
                                                        </tr>
                                                        ${generateItemTable(items, 'status')}
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                                <td class="content-cell" align="center">
                                    <p class="f-fallback sub align-center">&copy; ${new Date().getFullYear()} BICHE DESIGNS. All rights reserved.</p>
                                    <p class="f-fallback sub align-center">
                                        BICHE Designs
                                        <br>Rome, Italy.
                                        <br>+ 3(935) 1 962 8987
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
    `);
}

export function generateGenericMailTemplate(message) {
    return (`
       <html>
       <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
          ${EMAIL_STYLES}
        </head>
        <body>
        <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center">
            <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                    <td class="email-masthead">
                        <a href="https://bichedesigns.com" class="f-fallback email-masthead_name">
                            <img class="logo-img" src="https://firebasestorage.googleapis.com/v0/b/biche-designs.appspot.com/o/images%2Ftext-logo.png?alt=media&token=1b860f6c-ab2d-4200-a02a-12a203460d84" alt="">
                        </a>
                    </td>
                </tr>
                <!-- Email Body -->
                <tr>
                    <td class="email-body" width="100%" cellpadding="0" cellspacing="0">
                        <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                            <!-- Body content -->
                            <tr>
                                <td class="content-cell">
                                    <div class="f-fallback">${message}</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                                <td class="content-cell" align="center">
                                    <p class="f-fallback sub align-center">&copy; ${new Date().getFullYear()} BICHE DESIGNS. All rights reserved.</p>
                                    <p class="f-fallback sub align-center">
                                        BICHE Designs
                                        <br>Rome, Italy.
                                        <br>+ 3(935) 1 962 8987
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
    `);
}

export function generateAdminPurchaseAlert({payment}: {payment: PaymentModel}): string {
    const action = payment.preOrder ? 'pre-order' : 'purchase';
    return (`
       <html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    ${EMAIL_STYLES}
    
    <!--[if mso]>
    <style type="text/css">
        .f-fallback  {
            font-family: Arial, sans-serif;
        }
    </style>
    <![endif]-->
</head>
<body>
<span class="preheader">This is a receipt for your recent purchase on ${formatDate(payment.date)}. No payment is due with this receipt.</span>
<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center">
            <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                    <td class="email-masthead">
                        <a href="https://bichedesigns.com" class="f-fallback email-masthead_name">
                            <img class="logo-img" src="https://firebasestorage.googleapis.com/v0/b/biche-designs.appspot.com/o/images%2Ftext-logo.png?alt=media&token=1b860f6c-ab2d-4200-a02a-12a203460d84" alt="">
                        </a>
                    </td>
                </tr>
                <!-- Email Body -->
                <tr>
                    <td class="email-body" width="100%" cellpadding="0" cellspacing="0">
                        <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                            <!-- Body content -->
                            <tr>
                                <td class="content-cell">
                                    <div class="f-fallback">
                                        <h1>Hello Admin,</h1>
                                        <p>${payment.user.name} just ${action}ed from BICHE store. Be sure to review this request.</p>
                                        <p>
                                        <a href="https://bichedesigns.com/admin/orders/${payment.id}" class="f-fallback button button--blue" target="_blank">View this order</a>
                                        </p>
                                        <table class="purchase" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                            <tr>
                                                <td>
                                                    <h3>INV ${payment.invoiceNumber}</h3></td>
                                                <td>
                                                    <h3 class="align-right">${formatDate(payment.date)}</h3></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <table class="purchase_content" width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <th class="purchase_heading" align="left">
                                                                <p class="f-fallback">#</p>
                                                            </th>
                                                            <th class="purchase_heading" align="left">
                                                                <p class="f-fallback">Description</p>
                                                            </th>
                                                            <th class="purchase_heading" align="left">
                                                                <p class="f-fallback">Qty</p>
                                                            </th>
                                                            <th class="purchase_heading" align="right">
                                                                <p class="f-fallback">Amount</p>
                                                            </th>
                                                        </tr>
                                                       ${generateItemTable(payment.items)}
                                                        <tr>
                                                            <td style="width: 10%" class="purchase_footer"></td>
                                                            <td style="width: 60%"  class="purchase_footer">
                                                                <p class="f-fallback purchase_total purchase_total--label">Total</p>
                                                            </td>
                                                            <td style="width: 10%" class="purchase_footer"></td>
                                                            <td style="width: 20%" class="purchase_footer">
                                                                <p class="f-fallback purchase_total">${formatCurrency(payment.amount)}</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <!-- Action -->
                                        <!--<table class="body-action" role="presentation">
                                            <tr>
                                                <td style="align-items: center;">
                                                    <table style="width: 100%;" role="presentation">
                                                        <tr>
                                                            <td style="text-align: center;">
                                                                <a href="https://bichedesigns.com/api/inv/download?id=${payment.id}" class="f-fallback button button--blue" target="_blank">Download Invoice PDF</a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>-->
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                                <td class="content-cell" align="center">
                                    <p class="f-fallback sub align-center">&copy; ${new Date().getFullYear()} BICHE DESIGNS. All rights reserved.</p>
                                    <p class="f-fallback sub align-center">
                                        BICHE Designs
                                        <br>Rome, Italy.
                                        <br>+ 3(935) 1 962 8987
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
    `);
}
