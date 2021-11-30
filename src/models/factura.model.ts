import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Client} from './client.model';

@model()
export class Factura extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  total: string;

  @property({
    type: 'number',
    required: true,
  })
  cantidad: number;

  @property({
    type: 'string',
    required: true,
  })
  direccion_envio: string;

  @property({
    type: 'boolean',
    required: true,
  })
  descuento: boolean;

  @belongsTo(() => Client)
  clientId: string;

  @property({
    type: 'string',
  })
  productId?: string;

  constructor(data?: Partial<Factura>) {
    super(data);
  }
}

export interface FacturaRelations {
  // describe navigational properties here
}

export type FacturaWithRelations = Factura & FacturaRelations;
