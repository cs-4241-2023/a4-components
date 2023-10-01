import express from  'express'
import ViteExpress from 'vite-express'

const app = express(),
      port = 3000

const startDate = new Date()
//console.log(startDate)

let scores = [
  { 'name': 'david', 'score': 13, 'date': startDate}
]

app.use(express.json())

app.post("/submit", handleManualScore)

app.get("/refresh", (req, res) => {
  res.json(scores);
})

function newScore(name, score) {
  const dateSub = new Date()
  const newsc = {'name': name, 'score': score, 'date': dateSub};
  //console.log(newsc)
  scores.push(newsc)
}

function handleManualScore(request, response) {

  let req =  request.body
  console.log(req)

  const currscore = parseInt(req.score);

  if (isNaN(currscore)) {
    response.writeHead(400)
    response.end('Score is not an integer value')
    return;
  }

  let updated = false;

  for (let i = 0; i < scores.length; i++) {
    if (scores[i].name === req.yourname) {
      updated = true;
      if (currscore >= 0) {
        scores[i].score = currscore;
      } else {
        scores.splice(i,1);
      }
      break;
    }
  }
  if (!updated) {
    newScore(req.yourname, req.score)
  }

  console.log(scores)
  response.json(scores)
  

}

ViteExpress.listen(app, port)
 