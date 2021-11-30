import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Client} from '../models';
import { Keys } from '../config/keys';
import {ClientRepository} from '../repositories';

const generate_password = require('password-generator');
const encryptar_password = require('crypto-js');
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticationService {
  constructor( @repository(ClientRepository)
  public client_repository:ClientRepository
  ) { }

  /*
   * Add service methods here
   */
  GeneratePasswordFunction(){
    let password = generate_password(6,false);
    return password;
  }
  EncryptPasswordFunction(password:String){
    let password_encrypt = encryptar_password.MD5(password).toString();
    return password_encrypt;
  }
  ShowInfoClient(user_email: string, password: string) {
    try {
      let client = this.client_repository.findOne({
        where: {email: user_email, password: password},
      });
      if (client) {
        return client;
      }
      return false;
    } catch {
      return false;
    }
  }
  GenerateTokenJWT(client:Client){
    let token = jwt.sign({
      data: {
        id:client.id,
        nombre: client.nombre,
        email: client.email,
        telefono: client.telefono,
        direccion: client.direccion,
      }
    },
    Keys.JWTkey);
    return token;
  }
validateToken(token:string){
  try{
    let datos = jwt.verify(token, Keys.JWTkey);
      return datos;
    }catch{
      return false;
    }
  }
}
