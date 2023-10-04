<script>
	import Button from './button.svelte'

	let name = '';
	let attack = 0;
	let defense = 0;
	let speed = 0;
	let average = 0;
	let recommended = '';

	let characters =[];
	let group = "game";

	const addCharacter = (event) => {
		const json = { name: name, attack: attack, defense: defense, speed: speed, action: 'create' }
		const body = JSON.stringify( json )
		let header = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Credentials': 'true',
		}
		console.log (body)
		fetch( 'http://localhost:3002/submit', {
  			method:'POST',
  			headers: header,
  			body 
		}).then(response => response.json())
      		.then((result) => {
				characters = result;
		});
		name = '';
		attack = 0;
		defense = 0;
		speed = 0;
	}

	function getCharacters() {
		let header = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': "*",
			'Access-Control-Allow-Credentials': 'true',
		}
		fetch( 'http://localhost:3002/results', {
		method:'GET',
		headers: header, 
		}).then(response => response.json())
			.then((result) => {
				characters = result;
		});
	}

	function deleteCharacter() {
		const json = { name: group,  action: 'delete' }
		const body = JSON.stringify( json )
		let header = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': "*",
    		'Access-Control-Allow-Credentials': 'true',
		}
		fetch( 'http://localhost:3002/submit', {
			method:'POST',
			headers: header,
			body 
		}).then(response => response.json())
			.then((result) => {
				characters = result;
		});
	}

</script>

<style>		

</style>

<h1>Character Creator </h1>
<hr>
	<div class = "leftimg">
		<img src="swords.png" width="140" height="140" alt="swords">
	</div>
	<div class = "rightimg">
		<img src="swords.png" width="140" height="140" alt="swords">
	</div>
<section>
	<div>
		<label style="background-color: white;" for="name">Name</label>
		<input type="text" id="name" bind:value={name} />
	</div>

	<div>
		<label style="background-color: lightcoral;" for="attack"> Attack</label>
		<input type="number" id="attack"  bind:value={attack}/>
	</div>

	<div>
		<label style="background-color: skyblue;" for="defense"> Defense</label>
		<input type="number" id="defense"  bind:value={defense}/>
	</div>

	<div>
		<label style="background-color: lightgreen;" for="speed"> Speed</label>
		<input type="number" id="speed"  bind:value={speed}/>
	</div>
	<Button on:click={addCharacter}>Add/Modify character</Button>
	<br>
	<br>
	<Button on:click={getCharacters}>Get characters</Button>
</section>


<section>
	<table class="char">
		<thead>
			<tr>
		  		<th></th>
		  		<th>Name  </th>
		  		<th>Attack  </th>
		  		<th>Defense  </th>
		  		<th>Speed </th>
		  		<th>Average  </th>
		  		<th>Recommended</th>
			</tr>
		</thead>
	  {#if characters.length != 0}
	  	{#each characters as product}
			<tr>
				<td><input type="radio" value={product.name} bind:group={group}> </td>
				<td>{product.name}</td>
				<td>{product.attack}</td>
				<td>{product.defense}</td>
				<td>{product.speed}</td>
				<td>{product.average}</td>
				<td>{product.recommended}</td>
			</tr>
		{/each}
	  {/if}
	</table>
	</section>
<section>
	<Button on:click={deleteCharacter}>Delete character</Button>
</section>
