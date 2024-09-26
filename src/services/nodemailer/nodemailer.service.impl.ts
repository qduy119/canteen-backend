import { INodemailerService } from './nodemailer.service';
import * as nodemailer from 'nodemailer';
import * as htmlToText from 'html-to-text';
import { injectable } from 'inversify';

@injectable()
export default class NodemailerServiceImpl implements INodemailerService {
  private _transporter: nodemailer.Transporter;

  constructor() {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
      }
    });
    this._transporter = transporter;
  }

  async send({ subject, content, to }): Promise<void> {
    const mailOptions = {
      from: process.env.GMAIL_FROM,
      to,
      subject,
      html: content,
      text: htmlToText.convert(content)
    };

    await this._transporter.sendMail(mailOptions);
  }
}
