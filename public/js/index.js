const input = $("input");
const preview = $(".preview");
const image = $('<img/>');

input.on('change', updateImageDisplay);

function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

function updateImageDisplay() {
  preview.empty();

  const curFile = input.prop("files")[0];

  image.attr("src", URL.createObjectURL(curFile));

  preview.append(image);
}

function submitFile() {
  toDataUrl(image.attr("src"), (dataUrl) => {
    $.ajax({
      type: 'POST',
      url: '/',
      data: {
        base64: dataUrl
      },
      success: (response) => {
        document.write(response);
      }
    });
  });
}
