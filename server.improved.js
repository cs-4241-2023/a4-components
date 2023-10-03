const http = require("http");
const fs = require("fs");
const mime = require("mime");
const dir = "public/";
const port = process.env.PORT || 3000;

const appdata = [];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const requestData = JSON.parse(dataString);

   if (request.url === "/delete_recipe") {
      // Remove the recipe with the specified name
      const recipeNameToDelete = requestData.recipe_name;
      const indexToDelete = appdata.findIndex((recipe) => recipe.recipe_name === recipeNameToDelete);
      if (indexToDelete !== -1) {
        appdata.splice(indexToDelete, 1);
      }
    }
    // Calculate cooking time based on ingredients complexity
const calculateCookingTime = (ingredients) => {
  const ingredientCount = ingredients.split(',').length;
  const cookingTime = ingredientCount * 5; // 5 minutes per ingredient
  return cookingTime;
};

if (request.url === "/add_recipe") {
  appdata.push(requestData);
  const addedRecipe = requestData;
  addedRecipe.cooking_time = calculateCookingTime(addedRecipe.recipe_ingredients);
  response.writeHead(200, "OK", { "Content-Type": "application/json" });
  response.end(JSON.stringify(appdata));
}

    console.log(appdata);

    response.writeHead(200, "OK", { "Content-Type": "application/json" });
    response.end(JSON.stringify(appdata));
  });
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    if (err === null) {
      response.writeHead(200, { "Content-Type": type });
      response.end(content);
    } else {
      response.writeHead(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
