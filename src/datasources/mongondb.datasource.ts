import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongondb',
  connector: 'mongodb',
  url: 'mongodb+srv://neydergomez:neydergomez@proyweb.y46tr.mongodb.net/lb4?retryWrites=true&w=majority',
  host: '',
  port: 0,
  user: '',
  password: '',
  database: '',
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongondbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongondb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongondb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
