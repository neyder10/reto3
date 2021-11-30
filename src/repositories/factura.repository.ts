import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongondbDataSource} from '../datasources';
import {Factura, FacturaRelations, Client} from '../models';
import {ClientRepository} from './client.repository';

export class FacturaRepository extends DefaultCrudRepository<
  Factura,
  typeof Factura.prototype.id,
  FacturaRelations
> {

  public readonly client: BelongsToAccessor<Client, typeof Factura.prototype.id>;

  constructor(
    @inject('datasources.mongondb') dataSource: MongondbDataSource, @repository.getter('ClientRepository') protected clientRepositoryGetter: Getter<ClientRepository>,
  ) {
    super(Factura, dataSource);
    this.client = this.createBelongsToAccessorFor('client', clientRepositoryGetter,);
    this.registerInclusionResolver('client', this.client.inclusionResolver);
  }
}
