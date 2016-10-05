_createObjectURL = function(blob) {
  var objURL = URL.createObjectURL(blob);
  this.objectURLs = this.objectURLs || [];
  this.objectURLs.push(objURL);
  return objURL;
};

_clearObjectURL = function() {
  if (this.objectURLs) {
    this.objectURLs.forEach(function(objURL) {
      URL.revokeObjectURL(objURL);
    });
    this.objectURLs = null;
  }
};

_requestRemoteImageAndAppend = function(imageUrl, element) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', imageUrl);
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var img = document.createElement('img');
    img.setAttribute('data-src', imageUrl);
     img.setAttribute('width', "100%");
     img.setAttribute('height', "100%");
    var objURL = this._createObjectURL(xhr.response);
    img.setAttribute('src', objURL);

    element.html(img);
  }.bind(this);
  xhr.send();
};