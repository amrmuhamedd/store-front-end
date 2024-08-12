import CryptoJS from "crypto-js";

export function generateKashierOrderHash(order) {
  const mid = order.mid; // your merchant id
  const amount = order.amount; // eg: 22.00
  const currency = order.currency; // eg: "EGP"
  const orderId = order.merchantOrderId; // eg: 99
  const secret = order.secret;
  const path = `/?payment=${mid}.${orderId}.${amount}.${currency}`;

  const hash = CryptoJS.HmacSHA256(path, secret).toString(CryptoJS.enc.Hex);
  return hash;
}

export function validateSignature(query, secret) {
  let queryString =
    "&paymentStatus=" +
    (query["paymentStatus"] || "") +
    "&cardDataToken=" +
    (query["cardDataToken"] || "") +
    "&maskedCard=" +
    (query["maskedCard"] || "") +
    "&merchantOrderId=" +
    (query["merchantOrderId"] || "") +
    "&orderId=" +
    (query["orderId"] || "") +
    "&cardBrand=" +
    (query["cardBrand"] || "") +
    "&orderReference=" +
    (query["orderReference"] || "") +
    "&transactionId=" +
    (query["transactionId"] || "") +
    "&amount=" +
    (query["amount"] || "") +
    "&currency=" +
    (query["currency"] || "");

  let finalUrl = queryString.substr(1); // Remove the leading "&"
  const signature = CryptoJS.HmacSHA256(finalUrl, secret).toString(
    CryptoJS.enc.Hex
  );

  console.log(query, signature);
  if (signature === query.signature) {
    console.log("Success Signature");
    return true;
  } else {
    console.log("Failed Signature !!");
    return false;
  }
}
