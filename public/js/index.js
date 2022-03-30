const input = $("input");
const preview = $(".preview");
const image = $("<img/>");
const video = $("<video controls></video>");
const button = $("button");

input.on("change", previewFile);
button.on("click", submitFile);

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
  const curFile = input.prop("files")[0];
  const fileType = curFile.type.split("/")[0];

  preview.empty();

  if (fileType === "video") {
    video.attr("src", URL.createObjectURL(curFile));
    video.append("<p>Your browser doesn't support HTML5 video.</p>");
    preview.append(video);
  } else {
    image.attr("src", URL.createObjectURL(curFile));
    preview.append(image);
  }

  URL.revokeObjectURL(curFile);
}

function submitFile() {
  const curFile = input.prop("files")[0];
  const fileType = curFile.type.split("/")[0];

  $(".container").empty();
  const loading = $("<div class='loading'></div>");
  const loading_spin = $("<div class='loading-spin'></div>");

  loading.append(loading_spin);
  loading.append("<p>We're processing your request. Please wait...</p>");
  $(".container").append(loading);

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
