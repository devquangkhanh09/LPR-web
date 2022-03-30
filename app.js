const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true,
  limit: "20mb"
}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {title: "Homepage"});
});

app.post("/", (req, res) => {
  const type = req.body.type;
  const data = req.body.base64;

  var url = "http://localhost:5000/" + type;
  const options = {
    method: "POST",
    maxHeaderSize: 20000000 // 20mb
  };

  const request = http.request(url, options, (response) => {
    if (type === "video") {
      res.render("result_video", {
        title: "Result",
        source_webm: response.headers.webm,
        source_mp4: response.headers.mp4
      });
    } else {
      res.render("result", {
        title: "Result",
        source: response.headers.result,
        plates: response.headers.plates
      });
    }
  });

  request.write(data);
  request.end();
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
