import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { Keys } from '../config/keys';
require ('dotenv').config();
const apiKey = `${process.env.SENDGRID_API_KEY}`;
const sgMail = require('@sendgrid/mail');


@injectable({scope: BindingScope.TRANSIENT})
export class NotificationService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
  SendEmail(destino:string, asunto:string, contenido:string){
    sgMail.setApiKey(apiKey)
    const msg = {
    to: destino, // Change to your recipient
    from: Keys.email_origin, // Change to your verified sender
    subject: asunto,
    text: 'and easy to do anywhere, even with Node.js',
    html: contenido,
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error:any) => {
      console.error(error)
    })
  }
}
