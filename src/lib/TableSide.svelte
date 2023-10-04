
<script>
    const tableHeaders = [
        "Date",
        "Hours",
        "Time Remaining Until Goal",
        "Delete",
    ];

    let input_date
    let input_hours

    const addHours = function (event) {
        event.preventDefault();
        const json = { date: input_date, hours: input_hours },
            body = JSON.stringify(json);

        promise = fetch("/addHours", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body
        })
            .then((response) => response.json())
    };

    const deleteEntry = function (info) {
        const json = { info },
            body = JSON.stringify(json);

        promise = fetch("/deleteEntry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
        })
        .then((response) => response.json())
    };

    const getTable = function () {
        const p = fetch("/getTable", {
            method: 'GET'
        })
        .then( response => response.json() )
        .then( res => {
            console.log("getTable:", res)
            return res
        })
        console.log("getP:", p)
        return p
    }

    let promise = getTable()
</script>

<p class="border">
    Enter the day you last attended with the amount of hours you logged
</p>

<form id="enterHourForm">
    <div>
        <div>
            <label for="date">Enter Date [Month/Day/Year]</label>
            <input type="date" class="datepicker" id="date" bind:value={input_date}/>
        </div>
        <div>
            <label for="hours">Enter Time Attended [# Hours]</label>
            <input type="number" id="hours" placeholder="eg. 3" bind:value={input_hours} />
        </div>
        <button type="button" on:click={addHours} id="enter" class="contrast"
            >Enter Data</button
        >
    </div>
</form>


<table id="badmintonDisplay">
    <thead id="badmintonDisplayHead">
        <tr>
            <th>Date</th>
            <th>Hours</th>
            <th>Remaining</th>
            <th>Delete</th>
        </tr>
    </thead>
    {#await promise then tableD}
    <tbody id="badmintonDisplayBody">
        {#each tableD as info}
        <tr>
            <td>{info.date}</td>
            
            <td>{info.hours}</td>
            {#if info.remaining >= 0}
            <td >{info.remaining}</td>
            {:else}
            <td>0</td>
            {/if}
            <td><button on:click={() => deleteEntry(info)}>Delete</button></td>
        </tr>
        {/each} 
    </tbody>
    {/await}
</table>

<style>
    .border {
        border-width: 3px;
        border-style: solid;
        border-color: #d2d1fd;
        text-align: center;
        padding: 4px;
    }

    th,td{
        color: white
    }

    form{
        color: white
    }

    button {
        text-decoration: underline;
    }

    p {
        text-align: center;
        color: white
    }
</style>
