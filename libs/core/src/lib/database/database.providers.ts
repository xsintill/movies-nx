import { Sequelize } from 'sequelize-typescript';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        host: 'DESKTOP-RYZEN5',
        dialect: 'mssql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
        dialectOptions: {
          authentication: {
            type: 'ntlm',
            options: {
              userName: 'xsintill',
              password: 'xs1nt1lL!',
              domain: 'WORKGROUP',
            },
          },
          options: {
            port: 1433,
            requestTimeout: 60000,
          }
        }
      });
      sequelize.addModels([]);
      await sequelize.sync();
      return sequelize;
    },
  },
];