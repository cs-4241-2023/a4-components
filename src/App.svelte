<script>
  const getBooks = function() {
    
    const p = fetch( '/read', {
      method:'GET' 
    })
    .then( response => response.json() )
    .then( json => {
      console.log(json)
      return json 
    })
    return p
  }
  let title = '', author = '', started = '', finished = '', rating = '';
  const addBook = function(e) {
    e.preventDefault()
  
   console.log(title, author, started, finished, rating)

   let json = {
      title: title, // Access the value property
      author: author,
      started: started,
      finished: finished,
      daysTaken: daysTaken(started, finished),
      rating: rating,
    },
    body = JSON.stringify(json)
    promise = fetch( '/add', {
      method:'POST',
      body,
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
  }
  function getDate(stringDate) {
    var yearMonthDate = stringDate.split('-');
    return new Date(yearMonthDate[0], yearMonthDate[1], yearMonthDate[2]);
}

const daysTaken = (startDate, endDate) => {
    let start = getDate(startDate);
    let end = getDate(endDate);

    if (start.getDate() && end.getDate()) {
        if (start.getTime() > end.getTime()) {
            console.log("Error, start must be before end.")
            return -1;
        }
        let timeDifference = start.getTime() - end.getTime();
        let dayDifference = Math.abs(timeDifference / (1000 * 3600 * 24));
        console.log(dayDifference)
        return dayDifference;
    }
}
  const removeBook = function(title) {
 let json = {
    title: title,
  },
    body = JSON.stringify(json)
    promise = fetch( '/delete', {
      method:'DELETE',
      body,
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
  }
  let promise = getBooks()
</script>

<h1>Books</h1>
 <div>
      <form>
        <label for="title"> Title:</label>
        <input type="text" bind:value={title}  class ='title' id="title" />
        <label for="author"> Author:</label>
        <input type="text"  bind:value={author} class ='author' id="author" />
        <label for="started"> Date Started:</label>
        <input type="date"  bind:value={started} class ='started' max="" id="started">
        <label for="finished"> Date Finished:</label>
        <input type="date" bind:value={finished} class ='finished' max="" id="finished" >
<script>
          const today = new Date().toISOString().split("T")[0];
          document.getElementById("started").setAttribute("max", today);
          document.getElementById("finished").setAttribute("max", today);
        </script>
        <label for="rating"> Rating out of 10:</label>
          <input class='rating' bind:value={rating}
           min="0" max="10" type="number"
            id="rating"/>

            <button on:click={addBook}>add book</button>
      </form>
    </div>

<table>
<thead> 
<tr> <th>Title</th> <th>Author</th> <th>Started</th><th>Finished</th><th>Days to Read</th><th>Rating</th><th>Delete</th></tr>
</thead>
{#await promise then books}

  {#each books as book}
    <tr><td> {book.title}</td><td>{book.author}</td><td>{book.started}</td> <td>{book.finished}</td> <td>{book.daysTaken}</td> <td>{book.rating}</td> <td><button on:click={()=>removeBook(book.title)}>
	x
</button>
</td> </tr>
  {/each}

{/await}
</table>
