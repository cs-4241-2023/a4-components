<script>

    import TableSide from './TableSide.svelte'
    const validGrades = ["A", "B", "C", "NR"];
    let goalEntered;

    let hasGoal = false;

    // const showGoal = function (event) {
    //     event.preventDefault();

    //     promiseG = fetch("/getGrade", {
    //         method: "GET",
    //     })
    //         .then((response) => response.json())
    //         .then((res) => {
    //             console.log("ShowGOAL:", res);
    //             //if no grade was found must unlock setgoal
    //             if (res.length === 0) {
    //                 hasGoal = false
    //                 const showGoalButton =
    //                     document.querySelector("#displayGoal");
    //                 showGoalButton.setAttribute("hidden", "hidden");

    //                 const noGrade = document.querySelector("#noGradeEntered");
    //                 noGrade.removeAttribute("hidden");
    //             } else {
    //                 hasGoal = true
    //                 // const container = document.querySelector("#termGradeGoal");
    //                 // const displayGoal = document.createElement("p");

    //                 // displayGoal.innerText = res;
    //                 // displayGoal.className = res;
    //                 // displayGoal.id = "writtenGrade"

    //                 // container.appendChild(displayGoal);

    //                 const showGoalButton =
    //                     document.querySelector("#displayGoal");
    //                 showGoalButton.setAttribute("hidden", "hidden");
    //             }
    //         });
    // };

    const setGoal = function (event) {
        event.preventDefault();
        console.log("mi");

        const goal = document.querySelector("#desiredGoal"),
            json = { goal: goalEntered },
            body = JSON.stringify(json);

        console.log(body);

        if (!validGrades.includes(goalEntered)) {
            const displayGoal = document.querySelector("#termGradeGoal");
            displayGoal.innerHTML = "Invalid grade, please try again";
        } else {
            console.log("elsa");
            promiseG = fetch("/setGoal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body
            })
                .then((response) => response.json())
                .then((res) => {
                    hasGoal = true
                    console.log(res);
                    // const displayGoal =
                    //     document.querySelector("#termGradeGoal");

                    // displayGoal.innerHTML = res;
                    // displayGoal.className = res;

                    if (res.length > 0) {
                        const showButton =
                            document.querySelector("#noGradeEntered");
                        showButton.setAttribute("hidden", "hidden");
                    }
                    return res
                });
        }
    };

    const editGoal = function (event) {
        event.preventDefault();

        const goal = document.querySelector("#newDesiredGoal"),
            json = { goal: goalEntered },
            body = JSON.stringify(json);

        if (!validGrades.includes(goalEntered)) {
            const displayGoal = document.querySelector("#termGradeGoal");
            displayGoal.innerHTML = "Invalid grade, please try again";
        } else {
            promiseG = fetch("/editGoal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body
            })
                .then((response) => response.json())
        }
    };

    const getGoal = function () {
        const p = fetch("/getGrade", {
            method: "GET",
        })
            .then((response) => response.json())
            .then((res) => {
                console.log("getGoal:", res);
                return res;
            });

        console.log("getGoalP:", p);
        return p;
    };

    let promiseG = getGoal();
    
</script>



<!-- <div id="displayGoal">
    <button on:click={showGoal} class="contrast" id="displayGoalButton"
        >Display Goal</button
    >
</div> -->

<p id="termGradeGoal">Grade Goal for this Term:</p>
{#await promiseG then grade}
<p>{grade}</p>
{/await}

{#if hasGoal}
<!-- <div id="gradeExists"> -->
    <p>If you would like to edit your goal, change it below</p>
    <ul id="gradeList">
        <li class="A">A: 28 Hours</li>
        <li class="B">B: 24 Hours</li>
        <li class="C">C: 21 Hours</li>
        <li class="NR">NR: under 21 Hours</li>
    </ul>

    <!-- <div id="editGoalSection"> -->
        <form id="editGoalForm">
            <div>
                <div>
                    <label for="newDesiredGoal">New Grade</label>
                    <input bind:value={goalEntered} type="text" id="newDesiredGoal" placeholder="eg. B" />
                </div>
                <button on:click={editGoal} class="contrast" id="editGoalSubmit"
                    >Edit Goal</button
                >
            </div>
        </form>

    <!-- </div> -->

<!-- </div> -->

{:else}
<div class="noGradeEntered" id="noGradeEntered">
    <p>It appears that you have not previously entered a grade goal</p>
    <p>Please enter one below and click submit to establish it</p>
    <form>
        <label for="desiredGoal">Grade</label>
        <input
            bind:value={goalEntered}
            type="text"
            id="desiredGoal"
            placeholder="eg. A"
        />
        <button on:click={setGoal} class="contrast" id="setGoal"
            >Set Grade Goal</button
        >
    </form>

    <ul id="gradeList">
        <li class="A">A: 28 Hours</li>
        <li class="B">B: 24 Hours</li>
        <li class="C">C: 21 Hours</li>
        <li class="NR">NR: under 21 Hours</li>
    </ul>
</div>
{/if}

<style>
    /* #gradeExists {
        visibility: visible;
    } */

    /* #displayGoal {
        visibility: visible;
    } */
    .A {
        border-width: 3px;
        border-style: solid;
        border-color: #beffa6;
        text-align: center;
    }

    .B {
        border-width: 3px;
        border-style: solid;
        border-color: #e3ffa6;
        text-align: center;
    }

    .C {
        border-width: 3px;
        border-style: solid;
        border-color: #fbf3a3;
        text-align: center;
    }

    .NR {
        border-width: 3px;
        border-style: solid;
        border-color: #fbb7a3;
        text-align: center;
    }

    .contrast:focus-visible {
        box-shadow: 0 0 10px 10px blue;
    }

    button {
        text-decoration: underline;
    }

    p {
        text-align: center;
    }
</style>
