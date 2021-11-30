import {service} from '@loopback/core';
import {
  CountSchema, repository
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Keys} from '../config/keys';
import {Client} from '../models';
import {Credentials} from '../models/credentials.model';
import {ClientRepository} from '../repositories';
import {AutenticationService, NotificationService} from '../services';

const fetch = require('node-fetch');

export class ClientController {
  constructor(
    @repository(ClientRepository)
    public clientRepository : ClientRepository,
    @service(AutenticationService)
    public authentication_service:AutenticationService,
    @service(NotificationService)
    public notifications_service: NotificationService
  ) {}

  @post('/showClient')
  @response(200, {
    description: 'Specific client'
  })
  async showClient(
    @requestBody() credentials: Credentials
  ){
    let client = await this.authentication_service.ShowInfoClient(credentials.user, credentials.KEY)
    if(client){
      let token = this.authentication_service.GenerateTokenJWT(client);
      return{
        data: {
          id:client.id,
          nombre: client.nombre,
          email: client.email,
          telefono: client.telefono,
          direccion: client.direccion,
        },
        tk:token
        }
    }else{
      throw new HttpErrors[401]('Error')
    }
  }
  @post('/clients')
  @response(200, {
    description: 'Client model instance',
    content: {'application/json': {schema: getModelSchemaRef(Client)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {
            title: 'NewClient',
            exclude: ['id'],
          }),
        },
      },
    })
    client: Omit<Client, 'id'>,
  ): Promise<Client> {
    let password = this.authentication_service.GeneratePasswordFunction();
    let password_encrypt = this.authentication_service.EncryptPasswordFunction(password);
    client.password = password_encrypt;
    let inst_client = await this.clientRepository.create(client);
    if(inst_client){
      let contenido = `Bienvenido al sistema de ordenes E-Commerce Misión TIC 2021. <br>
      Sus datos de acceso al sistema son<br>
      <ul>
        <li>Usuario:${inst_client.email}</li>
        <li>Contraseña:${password}</li>
      </ul>
      Gracias por registrarte en nuestra plataforma.`;
     this.notifications_service.SendEmail(inst_client.email, Keys.subject, contenido);
    }
    return inst_client;
  //   //Cuerpo del correo electronico
  //   let destine = client.email;
  //   let subject = "registro en la plataforma e-commerce MINTIC-2021";
  //   let content = `Hola ${client.nombre}, el correo de contacto es ${client.email}y la contraseña ${client.password}`;
  //   fetch(`${Keys.urlNotifiactions}/correos?destino=${destine}&asunto=${subject}&contenido=${content}`)
  //     .then((data: any)=>{
  //       console.log(data);
  // })
  // return inst_client;
  }

  @get('/clients/count')
  @response(200, {
    description: 'Client model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Client) where?: Where<Client>,
  ): Promise<Count> {
    return this.clientRepository.count(where);
  }

  @get('/clients')
  @response(200, {
    description: 'Array of Client model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Client, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Client) filter?: Filter<Client>,
  ): Promise<Client[]> {
    return this.clientRepository.find(filter);
  }

  @patch('/clients')
  @response(200, {
    description: 'Client PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {partial: true}),
        },
      },
    })
    client: Client,
    @param.where(Client) where?: Where<Client>,
  ): Promise<Count> {
    return this.clientRepository.updateAll(client, where);
  }

  @get('/clients/{id}')
  @response(200, {
    description: 'Client model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Client, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Client, {exclude: 'where'}) filter?: FilterExcludingWhere<Client>
  ): Promise<Client> {
    return this.clientRepository.findById(id, filter);
  }

  @patch('/clients/{id}')
  @response(204, {
    description: 'Client PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {partial: true}),
        },
      },
    })
    client: Client,
  ): Promise<void> {
    await this.clientRepository.updateById(id, client);
  }

  @put('/clients/{id}')
  @response(204, {
    description: 'Client PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() client: Client,
  ): Promise<void> {
    await this.clientRepository.replaceById(id, client);
  }

  @del('/clients/{id}')
  @response(204, {
    description: 'Client DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.clientRepository.deleteById(id);
  }
}

