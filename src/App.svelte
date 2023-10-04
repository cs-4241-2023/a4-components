<script>
  let fragInput;
  let assistInput;
  let deathInput;
  let cellType = "td";
  let applyInputs = [-1, -1, -1];
  let modifyClick = function(rowNum, obj) {modifyData(rowNum, obj)};
  let modifyRow = -1;
  const getTable = function() {
    const response = fetch('/getTable', {
      method: 'GET'
    })
    .then(response => response.json());
    return response;
  }

  const submit = function() {
    if (!(fragInput && assistInput && deathInput)) {
      alert("Please fill out all input boxes before submitting.");
    } else if (fragInput < 0 || assistInput < 0 || deathInput < 0) {
      alert("Please ensure that all values are not negative.");
    } else {
      appdata = fetch('/submit', {
        method: 'POST',
        body: JSON.stringify({frags: fragInput, assists: assistInput, deaths: deathInput}),
        headers: {'Content-Type': 'application/json'}
      })
      .then(response => response.json());
    }
  }

  const deleteData = function(obj) {
    const body = JSON.stringify(obj);
    appdata = fetch('/deleteData', {
      method: 'POST',
      body,
      headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json());
  }

  const modifyData = function(rowNum, obj) {
    cellType = "input";
    modifyRow = rowNum;
    modifyClick = function(rowNum, obj) {applyModification(rowNum, obj)};
    for (let i = 0; i < 3; i++) {
      applyInputs[i] = obj[Object.keys(obj)[i]];
    }
  }

  const applyModification = function(rowNum, obj) {
    const frags = applyInputs[0],
          assists = applyInputs[1],
          deaths = applyInputs[2],
          json = {frags, assists, deaths},
          body = JSON.stringify({obj, newObj: json});
    appdata = fetch('/modifyData', {
      method: 'POST',
      body,
      headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json());
    modifyRow = -1;
    modifyClick = function(rowNum, obj) {modifyData(rowNum, obj)};
    applyInputs = [-1, -1, -1];
  }

  let appdata = getTable();
</script>

<style>
  main {
    background-color: #6495ed;
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    align-content: center;
    font-family: 'Poppins', sans-serif;
  }
</style>

<main>
  <form>
    <input type="number" min="0" id="frag-input" placeholder="Input number of frags" required bind:value={fragInput}>
    <input type="number" min="0" id="assist-input" placeholder="Input number of assists" required bind:value={assistInput}>
    <input type="number" min="0" id="death-input" placeholder="Input number of deaths" required bind:value={deathInput}>
    <button type="submit" id="submit-button" on:click={submit}>Submit</button>
  </form>
  <br>
  <br>
  <table class="border-element" id="stat-table">
    <thead>
      <tr>
        <th>Frags</th>
        <th>Assists</th>
        <th>Deaths</th>
        <th>K/D</th>
        <th>Remove</th>
        <th>Modify</th>
      </tr>
    </thead>
    {#await appdata then elements}
      <tbody id="tbody">
        {#each elements as element}
          <tr id={elements.indexOf(element)}>
            {#each Object.keys(element) as key}
              <td>
                {#if elements.indexOf(element) !== modifyRow}
                  {element[key]}
                {:else if key !== "kd"}
                  <input type="number" min="0" bind:value={applyInputs[Object.keys(element).indexOf(key)]}>
                {:else}
                  {element[key]}
                {/if}
              </td>
            {/each}
            <td><button on:click={function() {deleteData(element)}}>Delete</button></td>
            <td><button on:click={function() {modifyClick(elements.indexOf(element), element)}}>
              {#if elements.indexOf(element) !== modifyRow}
                Modify
              {:else}
                Apply
              {/if}
            </button></td>
          </tr>
        {/each}
      </tbody>
    {/await}
  </table>
</main>