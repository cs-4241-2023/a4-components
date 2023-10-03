import express from 'express';
import ViteExpress from 'vite-express'

const app = express();

const appdata = [
  {'frags': 24, 'assists': 2, 'deaths': 7, 'kd': 3.43},
  {'frags': 12, 'assists': 5, 'deaths': 16, 'kd': 0.75},
  {'frags': 15, 'assists': 3, 'deaths': 12, 'kd': 1.25}
]

app.use(express.json());
app.use((request, response, next) => {
  next();
});
app.use(express.static('public'));

app.get('/', (request, response) => {
  response.render('index');
});

app.get('/getTable', (request, response) => {
  response.json(appdata);
});

app.post('/submit', (request, response) => {
  const body = request.body;
  const kd = (parseInt(body.deaths) === 0) ? body.frags : (body.frags / body.deaths).toFixed(2);
  body['kd'] = parseFloat(kd);
  appdata.push(body);
  response.json(appdata);
});

app.post('/deleteData', (request, response) => {
  const body = request.body;
  appdata.splice(appdata.findIndex(element => {
    let frags = element.frags === body.frags;
    let assists = element.assists === body.assists;
    let deaths = element.deaths === body.deaths;
    let kd = element.kd === body.kd;
    return frags && assists && deaths && kd;
  }), 1);
  response.json(appdata);
});

app.post('/modifyData', (request, response) => {
  const body = request.body;
  let index = appdata.findIndex(element => {
    let frags = element.frags === body.obj.frags;
    let assists = element.assists === body.obj.assists;
    let deaths = element.deaths === body.obj.deaths;
    let kd = element.kd === body.obj.kd;
    return frags && assists && deaths && kd;
  });

  const kd = (parseInt(body.newObj.deaths) === 0) ? body.newObj.frags : (body.newObj.frags / body.newObj.deaths).toFixed(2);
  body.newObj['kd'] = parseFloat(kd);
  appdata[index] = body.newObj;
  response.json(appdata);
});

ViteExpress.listen(app, 3000);