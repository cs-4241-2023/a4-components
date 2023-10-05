import express from "express";
import ViteExpress from "vite-express";

const app = express();

const actions = [];

app.use(express.json());

app.get("/read", (req, res) => res.json(actions));

app.post("/add", (req, res) => {
  const newAction = {
    action: req.body.action,
    date: new Date(),
    complete: "No",
    dateCompleted: "Incomplete",
  };
  actions.push(newAction);
  console.log(actions);
  res.json(actions);
});

app.post("/change", function (req, res) {
  const idx = req.body.index;
  const act = req.body.action;

  if (act === "delete") {
    actions.splice(idx, 1);
  } else if (act === "complete") {
    if (actions[idx].complete === "No") {
      actions[idx].complete = "Yes";
      actions[idx].dateCompleted = new Date().toLocaleString();
    } else {
      actions[idx].complete = "No";
      actions[idx].dateCompleted = "Incomplete";
    }
  }

  res.json(actions);
});

ViteExpress.listen(app, 3000);
