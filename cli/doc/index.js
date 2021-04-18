require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const package = require('../../package.json');
const chalk = require('chalk');
const sequelizeErd = require('sequelize-erd');
const bdd = require('../../models');

let categories = [];

function stringifyBody(body, display_required) {
  if (body === undefined) return;

  let newBody = convertObj(body);

  function convertObj(obj) {
    let newObj = { ...obj };

    Object.keys(obj).forEach((k) => {
      if (typeof obj[k] === 'object') {
        let prefix = '';
        if (display_required && obj[k].required) prefix = '*';

        if (obj[k].type === 'string') {
          if (obj[k].value !== undefined) {
            newObj[prefix + k] = obj[k].value.join('/');
          } else {
            newObj[prefix + k] = '';
          }
        } else if (obj[k].type === 'data_url') {
          newObj[prefix + k] = 'data:image/...';
        } else if (obj[k].type === 'number') {
          newObj[prefix + k] = 0;
        } else if (obj[k].type === 'boolean') {
          newObj[prefix + k] = 'true/false';
        } else if (obj[k].type === 'object') {
          newObj[prefix + k] = convertObj(obj[k].attributes);
        } else {
          newObj[prefix + k] = obj[k].type;
        }

        if (display_required && obj[k].required) delete newObj[k];
      } else {
        if (obj[k] === 'string') {
          newObj[k] = '';
        } else if (obj[k] === 'data_url') {
          newObj[k] = 'data:image/...';
        } else if (obj[k] === 'number') {
          newObj[k] = 0;
        } else if (obj[k] === 'boolean') {
          newObj[k] = 'true/false';
        } else {
          newObj[k] = obj[k];
        }

        if (display_required) {
          newObj['*' + k] = newObj[k];
          delete newObj[k];
        }
      }
    });

    return newObj;
  }

  return JSON.stringify(newBody, null, 2);
}

function stringifyResult(result) {
  return JSON.stringify(result, null, 2);
}

fs.readdirSync(path.join(__dirname, '../../modules/route'))
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    let data = require(path.join(__dirname, '../../modules/route/', file));
    categories.push({
      title: data.meta.title,
      routes: data.routes.map((r) => {
        return {
          name: r.name,
          method: r.method,
          url: r.url,
          body: stringifyBody(r.body, true),
          bodyJSON: stringifyBody(r.body, false),
          query: r.query,
          description: r.description,
          result: r.result?.map((resu) => {
            return {
              code: resu.code,
              content: stringifyResult(resu.content),
            };
          }),
        };
      }),
    });
  });

const template = fs.readFileSync(
  path.join(__dirname, './template.mustache'),
  'utf-8'
);

const html = mustache.render(template, {
  doc_name: process.env.DOC_NAME,
  last_build_date: new Date(),
  version: package.version,
  categories: categories,
});

const json = JSON.stringify(
  {
    info: {
      name: process.env.DOC_NAME || 'Documentation',
      _postman_id: `${process.env.DOC_NAME || 'undefined'}-documentation`,
      version: package.version,
      schema:
        'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    variable: [
      {
        key: 'baseURL',
        value: process.env.DOC_HOST,
        // eslint-disable-next-line quotes
        name: "Host de l'API",
      },
    ],
    auth: {
      type: 'bearer',
      bearer: [
        {
          key: 'token',
          value: '[VOTRE JWT]',
          type: 'string',
        },
      ],
    },
    item: categories.map((cate) => {
      return {
        name: cate.title,
        item: cate.routes.map((route) => {
          return {
            name: route.name,
            request: {
              description: route.description,
              method: route.method,
              url: {
                raw: '{{baseURL}}' + route.url,
                host: ['{{baseURL}}'],
                path: route.url.split('/').filter((r) => r !== ''),
                variable: route.url
                  .split('/')
                  .filter((r) => r.includes(':'))
                  .map((v) => {
                    return {
                      key: v.substr(1),
                      value: '',
                    };
                  }),
              },
              body: {
                mode: 'raw',
                raw: route.bodyJSON,
                options: {
                  raw: {
                    language: 'json',
                  },
                },
              },
            },
          };
        }),
      };
    }),
  },
  null,
  2
);

// Export du résultat
if (!fs.existsSync(path.join(__dirname, '../../doc'))) {
  fs.mkdirSync(path.join(__dirname, '../../doc'));
}

fs.writeFileSync(path.join(__dirname, '../../doc/index.html'), html);
fs.writeFileSync(path.join(__dirname, '../../doc/collection.json'), json);

// Copie de tous les fichiers statiques
fs.readdirSync(path.join(__dirname, './static')).forEach((file) => {
  fs.copyFileSync(
    path.join(__dirname, './static/', file),
    path.join(__dirname, '../../doc/', file)
  );
});

// Génération du modèle de la BDD
sequelizeErd({ source: bdd.sequelize }).then((svg) => {
  fs.writeFileSync(path.join(__dirname, '../../doc/bdd.svg'), svg);

  console.log(chalk.bold.green('Documentation générée!'));
  process.exit();
});
