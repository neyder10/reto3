import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Factura,
  Client,
} from '../models';
import {FacturaRepository} from '../repositories';

export class FacturaClientController {
  constructor(
    @repository(FacturaRepository)
    public facturaRepository: FacturaRepository,
  ) { }

  @get('/facturas/{id}/client', {
    responses: {
      '200': {
        description: 'Client belonging to Factura',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Client)},
          },
        },
      },
    },
  })
  async getClient(
    @param.path.string('id') id: typeof Factura.prototype.id,
  ): Promise<Client> {
    return this.facturaRepository.client(id);
  }
}
