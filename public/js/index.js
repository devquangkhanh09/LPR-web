const preview = $(".preview");
const image = $("<img/>");
const video = $("<video controls></video>");
let file = new File([], "");


function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
}


function previewFile() {
  const fileType = file.type.split("/")[0];

  preview.empty();

  if (fileType === "video") {
    video.attr("src", URL.createObjectURL(file));
    video.append("<p>Your browser doesn't support HTML5 video.</p>");
    preview.append(video);
  } else {
    image.attr("src", URL.createObjectURL(file));
    preview.append(image);
  }

  URL.revokeObjectURL(file);
}


function submitFile() {
  const fileType = file.type.split("/")[0];

  $(".container").empty();
  const loading = $("<div class='loading'></div>");
  const loading_spin = $("<div class='loading-spin'></div>");

  loading.append(loading_spin);
  loading.append("<p>We're processing your request. Please wait...</p>");
  $(".container").append(loading);
  $("footer").hide()
  $("html").css("height", "auto");

  let source = "";
  if (fileType === "video") {
    source = video.attr("src");
  } else {
    source = image.attr("src");
  }

  toDataUrl(source, (dataUrl) => {
    $.ajax({
      type: "POST",
      url: "/",
      data: {
        type: fileType,
        base64: dataUrl
      },
      success: (response) => {
        document.write(response);
      }
    });
  });
}


function changeHandler(ev) {
  file = ev.target.files[0];
  previewFile();
}


function dropHandler(ev) {
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    const item = ev.dataTransfer.items[0];
    const itemType = item.type.split("/")[0];
    if (itemType === "image" || itemType === "video") {
      file = item.getAsFile();
      previewFile();
    }
  } else {
    file = ev.dataTransfer.files[0];
    const fileType = file.type.split("/")[0];
    if (fileType === "image" || fileType === "video") {
      previewFile();
    }
  }
}


function dragOverHandler(ev) {
  event.preventDefault();
}
