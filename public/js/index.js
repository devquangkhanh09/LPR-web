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

function previewFile(event) {
  const fileName = event.target.files[0].name;
  const extension = fileName.split(".")[1];
  const curFile = input.prop("files")[0];

  preview.empty();

  if (extension === "mp4" || extension === "mkv") {
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
  toDataUrl(image.attr("src"), (dataUrl) => {
    $.ajax({
      type: "POST",
      url: "/",
      data: {
        base64: dataUrl
      },
      success: (response) => {
        document.write(response);
      }
    });
  });
}
