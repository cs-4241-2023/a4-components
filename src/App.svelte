<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import GoalSide from './lib/GoalSide.svelte'
  import TableSide from './lib/TableSide.svelte'

  const validGrades = ['A', 'B', 'C', 'NR']
const tableHeaders = ['Date', 'Hours', 'Time Remaining Until Goal', 'Delete']

</script>

<html lang="en" data-theme="light">
  <head>
    <title>Attendance Display - WPI Badminton Club Grade Tracker</title>
    <meta charset="utf-8" />
    <meta
      name="description"
      content="A page showing the grade goal and hours attended for WPI Badminton Club students"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- get rid of favicon error -->
    <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
  </head>

  <body>

    <p class="gradeRules">
      If you are taking Badminton Club for Gym Credit you receive your grade
      based on the amount of hours you attend.
    </p>

    <p class="underline">
      Below highlights your current progress toward your previously established
      grade goal
    </p>

    <div class="infoBox" id="infoBox">
      <div class="sideBySide">
        <div>
          <GoalSide />
        </div>

        <div>
          <TableSide />
        </div>
      </div>
    </div>
  </body>
</html>

<style>
  body {
    font-family: "Roboto", sans-serif;
    font-size: 22px;
    padding: 70px;
    color: black;
    flex-direction: column;
  }

  p {
    text-align: center;
    color: white
  }

  /* h1 {
    outline-width: 10px;
    color: rgb(179, 0, 0);

    text-align: center;

    border-width: 3px;
    border-style: solid;
    border-color: #ff5353;
  } */

  .sideBySide {
    /* visibility: hidden; */
    display: flex;
    justify-content: space-evenly;
    flex-wrap: nowrap;

    border-color: rgb(169, 31, 31);
    border-width: 3px;
    border-style: solid;
    padding: 30px;
  }

  /* nav {
    color: black;
  }

  .pure-menu-link {
    color: black;
    border-color: rgb(176, 40, 40);
    border-width: 3px;
    border-style: solid;
    text-decoration: underline;
  } */
</style>
