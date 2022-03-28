const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {title: "Homepage"});
});

app.post("/", (req, res) => {
  const data = req.body.base64;

  var url = "http://localhost:5000";
  const options = {
    method: "POST",
    maxHeaderSize: 500000
  };

  const request = http.request(url, options, (response) => {
    res.render("result", {
      title: "Result",
      source: response.headers.result,
      plates: response.headers.plates
    });
  });

  request.write(data);
  request.end();
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
