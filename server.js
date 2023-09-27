const express = require('express');
const PORT = 3000;
const app = express();
const mime = require('mime');
const crypto = require('crypto');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("build"));

const appdata = [];

// custom middleware 
const stringToJSONMiddleware = (req, _, next) => {
    let dataString = '';

    req.on('data', (data) => {
        dataString += data;
    });

    req.on('end', () => {
        req.parsedBody = JSON.parse(dataString);
        next();
    });
};

app.get("/", (_, res) => {
    res.render('../src/index.html');
})

app.get('/req-server-data', (_, response) => {
    const res_type = mime.getType(JSON.stringify(appdata));
    response.writeHeader(200, { 'Content-Type': res_type })
    response.end(JSON.stringify(appdata));
});

app.post('/submit', stringToJSONMiddleware, (request, response) => {
    const user_data_json = request.parsedBody;
    console.log("Data being added: ");
    console.log(user_data_json);

    // Add user vehice service appointment data to appdata
    // Before adding it to the array of JSON objects, add new derived field 
    user_data_json['day-until-appointment'] = addNewDataField(user_data_json);
    user_data_json['uuid'] = crypto.randomUUID();

    appdata.push(user_data_json);

    console.log("Server Data after submission: ");
    console.log(appdata);
    response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
    response.end('Success')
});

app.post('/delete-frm-table', express.text(), (request, response) => {
    const unique_identifier = request.body;
    console.log(`Server: Removing UUID ${unique_identifier}`);
    const index = appdata.findIndex(entry => entry.uuid === unique_identifier);

    if (index !== -1) {
        appdata.splice(index, 1);
    }

    response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
    response.end('Success');
});

app.post('/modify-table-entry', stringToJSONMiddleware, (request, response) => {

    const data_to_modify = request.parsedBody;
    console.log("Modified Data: ");
    console.log(data_to_modify);

    const modify_uuid = data_to_modify[0];
    const modify_form_data = JSON.parse(data_to_modify[1]);

    // Locate entry we want to modify using the UUID
    const modify_index = appdata.findIndex(entry => entry.uuid === modify_uuid);

    // modify appdata
    appdata[modify_index]['year'] = modify_form_data['year'];
    appdata[modify_index]['car_make'] = modify_form_data['car_make'];
    appdata[modify_index]['model'] = modify_form_data['model'];
    appdata[modify_index]['service_type'] = modify_form_data['service_type'];
    appdata[modify_index]['appointment_date'] = modify_form_data['appointment_date'];

    const new_days_until_apt = addNewDataField(appdata[modify_index])
    appdata[modify_index]['day-until-appointment'] = new_days_until_apt;

    console.log("App data after modification");
    console.log(appdata);

    response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
    response.end('Modify Success');
});

function addNewDataField(json_data) {
    const currentDate = new Date();
    const appointment_date = new Date(json_data['appointment_date']) // 2023-09-23

    if (appointment_date >= currentDate) {
        // Calculate the time difference in milliseconds
        const timeDifference = appointment_date - currentDate;

        // Convert the time difference to days
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        return daysDifference;
    } else {
        return 0;
    }
}

app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));