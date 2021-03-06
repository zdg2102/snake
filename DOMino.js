;(function (root) {

  root.$d = function (arg) {
    if (arg instanceof HTMLElement) {
      return new DOMNodeCollection([arg]);
    }

    if (typeof arg === 'string') {
      var elems = root.document.querySelectorAll(arg);
      elems = Array.prototype.slice.call(elems);
      return new DOMNodeCollection(elems);
    }

    if (typeof arg === 'function') {
      root.document.addEventListener('DOMContentLoaded', arg);
    }
  };

  root.$d.extend = function () {
    var receivingObj = arguments[0];
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < args.length; i++) {
      for (var key in args[i]) {
        if (args[i].hasOwnProperty(key)) {
          receivingObj[key] = args[i][key];
        }
      }
    }
    return receivingObj;
  };

  root.$d.ajax = function (inputOptions) {
    var defaultOptions = {
      type: 'GET',
      url: "",
      success: null,
      error: function () {
        console.error("An AJAX error occurred.");
      },
      complete: null,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      data: null
    };
    var options = root.$d.extend(defaultOptions, inputOptions);

    var request = new XMLHttpRequest();
    request.open(options.type, options.url);
    request.setRequestHeader('Content-Type', options.contentType);
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          if (options.success) { options.success(request.responseText); }
        } else {
          if (options.error) { options.error(request.responseText); }
        }
        if (options.complete) { options.complete(request.responseText); }
      }
    };
    request.send(options.data);
  };

  function DOMNodeCollection(elements) {
    this.elements = Array.prototype.slice.call(elements);
  }

  DOMNodeCollection.prototype.html = function (htmlArg) {
    if (htmlArg === undefined) {
      return this.elements[0].innerHTML;
    } else {
      for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].innerHTML = htmlArg;
      }
    }
  };

  DOMNodeCollection.prototype.empty = function () {
    this.html("");
  };

  DOMNodeCollection.prototype.append = function (content) {
    var i, j;
    if (content instanceof HTMLElement) {
      for (i = 0; i < this.elements.length; i++) {
        this.elements[i].innerHTML += content.outerHTML;
      }
    } else if (content instanceof DOMNodeCollection) {
      for (i = 0; i < this.elements.length; i++) {
        for (j = 0; j < content.elements.length; j++) {
          this.elements[i].innerHTML += content.elements[j].outerHTML;
        }
      }
    } else if (typeof content === 'string') {
      for (i = 0; i < this.elements.length; i++) {
        this.elements[i].innerHTML += content;
      }
    }
  };

  DOMNodeCollection.prototype.attr = function (attrName, value) {
    if (value === undefined) {
      return this.elements[0].getAttribute(attrName);
    } else {
      for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].setAttribute(attrName, value);
      }
    }
  };

  DOMNodeCollection.prototype.addClass = function (className) {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].classList.add(className);
    }
  };

  DOMNodeCollection.prototype.removeClass = function (className) {
    if (className === undefined) {
      this.attr('class', '');
    } else {
      for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].classList.remove(className);
      }
    }
  };

  DOMNodeCollection.prototype.children = function (selector) {
    var children = [];
    for (var i = 0; i < this.elements.length; i++) {
      var elemChildren =
        Array.prototype.slice.call(this.elements[i].children);
      for (var j = 0; j < elemChildren.length; j++) {
        if (elemChildren[j].matches(selector) || selector === undefined) {
          children.push(elemChildren[j]);
        }
      }
    }
    return new DOMNodeCollection(children);
  };

  DOMNodeCollection.prototype.parent = function (selector) {
    var parents = [];
    for (var i = 0; i < this.elements.length; i++) {
      var elemParent = this.elements[i].parentNode;
      if (elemParent.matches(selector) || selector === undefined) {
        parents.push(elemParent);
      }
    }
    return new DOMNodeCollection(parents);
  };

  DOMNodeCollection.prototype.find = function (selector) {
    var found = [];
    for (var i = 0; i < this.elements.length; i++) {
      var elems = Array.prototype.slice
        .call(this.elements[i].querySelectorAll(selector));
      found = found.concat(elems);
    }
    return new DOMNodeCollection(found);
  };

  DOMNodeCollection.prototype.remove = function (selector) {
    for (var i = 0; i < this.elements.length; i++) {
      if (this.elements[i].matches(selector) || selector === undefined) {
        this.elements[i].remove();
      }
    }
  };

  DOMNodeCollection.prototype.on = function (eventName, callback) {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].addEventListener(eventName, callback);
    }
  };

  DOMNodeCollection.prototype.off = function (eventName, callback) {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].removeEventListener(eventName, callback);
    }
  };

})(this);
