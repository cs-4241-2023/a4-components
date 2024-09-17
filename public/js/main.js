class Recipe extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.recipe.recipe_name}</td>
        <td>{this.props.recipe.recipe_ingredients}</td>
        <td>{this.props.recipe.recipe_directions}</td>
        <td>{this.props.recipe.cooking_time} minutes</td>
      </tr>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      recipeName: "",
      recipeIngredients: "",
      recipeDirections: "",
      recipeToDelete: "",
    };
  }

  handleAddRecipe = async () => {
    const { recipeName, recipeIngredients, recipeDirections } = this.state;

    const recipeData = {
      recipe_name: recipeName,
      recipe_ingredients: recipeIngredients,
      recipe_directions: recipeDirections,
    };

    const response = await fetch("/add_recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    });

    const recipes = await response.json();
    this.setState({
      recipes,
      recipeName: "",
      recipeIngredients: "",
      recipeDirections: "",
    });
  };

  handleDeleteRecipe = async () => {
    const { recipeToDelete } = this.state;

    const response = await fetch("/delete_recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipe_name: recipeToDelete }),
    });

    const recipes = await response.json();
    this.setState({ recipes, recipeToDelete: "" });
  };

  render() {
  return (
    <div className="container">
      <h1 className="title">Recipe Tracker</h1>
      <hr className="divider" />

      <div className="form-section">
        <h2>Add a Recipe</h2>
        <div className="form-group">
          <label>Recipe Name:</label>
          <input 
            type="text" 
            value={this.state.recipeName}
            onChange={e => this.setState({ recipeName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Ingredients:</label>
          <textarea 
            rows="4"
            value={this.state.recipeIngredients}
            onChange={e => this.setState({ recipeIngredients: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Directions:</label>
          <textarea 
            rows="4"
            value={this.state.recipeDirections}
            onChange={e => this.setState({ recipeDirections: e.target.value })}
          />
        </div>
        <button onClick={this.handleAddRecipe}>Add Recipe</button>
      </div>

      <hr className="divider" />

      <div className="form-section">
        <h2>Delete a Recipe</h2>
        <div className="form-group">
          <label>Recipe Name to Delete:</label>
          <input 
            type="text" 
            value={this.state.recipeToDelete}
            onChange={e => this.setState({ recipeToDelete: e.target.value })}
          />
        </div>
        <button onClick={this.handleDeleteRecipe}>Delete Recipe</button>
      </div>

      <h1 className="title">Your Recipe List</h1>
      <hr className="divider" />

      <table className="recipe-table">
        <thead>
          <tr>
            <th>Recipe Name</th>
            <th>Ingredients</th>
            <th>Directions</th>
            <th>Cooking Time</th>
          </tr>
        </thead>
        <tbody>
          {this.state.recipes.map(recipe => (
            <Recipe key={recipe.recipe_name} recipe={recipe} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
}

ReactDOM.render(<App />, document.getElementById("root"));
