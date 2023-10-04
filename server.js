import express from 'express'
import ViteExpress from 'vite-express'

const app = express()

const hoursTilGrade = [{ "A": 28 }, { "B": 24 }, { "C": 21 }]

const appdata = [

]

let currentGoal = ""
let hoursTilGoal = 0
let ogHoursTilGoal = 0

app.use( express.json() )
//app.use( express.static('public') )

app.use( (req,res,next) => {
    //console.log(req)
    next()
})


app.get('/getTable', (req, res) => {
      res.json(appdata) 
  })

app.get('/getGrade', (req,res) => {
  res.json(currentGoal)
})

app.post('/setGoal', (req, res) => {
    const body = req.body
    const currGoal = body.goal

    console.log(currGoal, body)

    hoursTilGrade.forEach(d => {
      for (let g in d) {
        if (g === currGoal) {
          hoursTilGoal = d[g]
          break
        }
      }
    })

    currentGoal = currGoal
    ogHoursTilGoal = hoursTilGoal

    // body['current_goal'] = currGoal
    // body['hours_til_goal'] = hoursTilGoal
    console.log("KKKKKKKKK", currentGoal)
    res.json(currentGoal)
})

app.post('/editGoal', (req, res) => {
      const body = req.body
      const newGoal = req.body.goal

      console.log(newGoal)
  
      let newGoalNum = 0
      let differenceToChange = 0
  
      if (newGoal !== currentGoal) {
  
        hoursTilGrade.forEach(d => {
          for (let g in d) {
            if (g === newGoal) {
              newGoalNum = d[g]
              differenceToChange = newGoalNum - ogHoursTilGoal
              break
            }
          }
        })
  
        let hoursTilGoaNew = ogHoursTilGoal + differenceToChange
        
        currentGoal = newGoal
        ogHoursTilGoal = hoursTilGoaNew
        
        console.log(differenceToChange)
        //go thru and edit all of the remianings      
        appdata.forEach(d => {
            d.remaining += differenceToChange
          })
      }
      
        console.log(newGoal, appdata)
        res.json(currentGoal)
  })


  app.post('/deleteEntry', (req, res) => {

      const info = req.body.info
      //const index = indexObj.idx
  
      //need to edit all entries after the index
      //console.log(req)
      //console.log(appdata[index])
      let index = 0;
      for(let i = 0; i < appdata.length; i++){
        if(appdata[i] === info){
          index = i
          break
        }
      }
      console.log(info, index)
      let differenceToChange = parseFloat(info.hours)

      for (let i = index; i < appdata.length; i++) {
        appdata[i].remaining += differenceToChange
      }

      console.log(appdata)
      appdata.splice(parseInt(index), 1)
      if(appdata.length === 0)
        hoursTilGoal = ogHoursTilGoal
      console.log(appdata)

      res.json(appdata)
    })

  app.post('/addHours', (req, res) => {
      const body = req.body
  

    
  
        if(appdata.length > 0){
          hoursTilGoal = appdata[appdata.length - 1].remaining
        } 

        body['remaining'] = hoursTilGoal - body.hours
      appdata.push(body)
      res.json(appdata)
  })


  ViteExpress.listen(app, 3000)