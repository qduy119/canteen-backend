import moment from 'moment';
import { Request } from 'express';
import crypto from 'crypto';
import queryString from 'qs';
import { Payment } from '@/databases/models';
import { IPaymentService } from './payment.service';
import { PaymentCreateDto } from '@/dto/payment/payment-create.dto';
import { PaymentUpdateDto } from '@/dto/payment/payment-update.dto';
import { injectable } from 'inversify';
import envConfig from '@/config';

@injectable()
export default class PaymentServiceImpl implements IPaymentService {
  async getAll(userId: string): Promise<Payment[]> {
    let data: Payment[];
    if (userId) {
      data = await Payment.findAll({
        where: { userId }
      });
    } else {
      data = await Payment.findAll({
        include: 'user'
      });
    }
    return data;
  }
  async create(payload: PaymentCreateDto): Promise<Payment> {
    const data = await Payment.create(payload);
    return data;
  }
  async update(id: number, payload: PaymentUpdateDto): Promise<void> {
    await Payment.update(payload, { where: { id } });
  }
  createPaymentUrl(req: Request): string {
    const { orderId, amount, bankCode } = req.body;

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const tmnCode = envConfig.VNP_TMNCODE;
    const secretKey = envConfig.VNP_HASHSECRET;
    let vnpUrl = envConfig.VNP_URL;
    const returnUrl = envConfig.CLIENT_URL + envConfig.VNP_RETURN_URL;

    let locale = req.body.language;
    if (!locale) {
      locale = 'vn';
    }
    const currCode = 'USD';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Payment for transaction ID: ' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100000;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = this.sortObject(vnp_Params);

    const signData = queryString.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + queryString.stringify(vnp_Params, { encode: false });

    return vnpUrl;
  }
  private sortObject(obj: Record<string, any>) {
    const sorted: Record<string, string> = {};
    const str: string[] = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
      }
    }

    str.sort();

    for (const key of str) {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
    }
    return sorted;
  }
}
