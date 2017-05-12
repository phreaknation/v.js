(function() {
  var v = function() {
    var types = [
      'string',
      'number',
      'boolean'
    ];
    this.name = 'V.js'
    this.__VERSION = [0,0,1];
    this.version = this.vers = this.__VERSION.join('.');
    this.license = 'MIT';
    this.el = {
      setters: document.querySelectorAll('var[data-set]'),
      getters: document.querySelectorAll('[data-get]'),
    };
    this.__v = {};
    
    // addTypeClass: adds a class of the type of variable.
    this.addTypeClass = true;
    this.styleErrors = true;
    
    this.__get = function(name, ns) {
      var scope = this.__v;

      if (ns !== null) {
        scope = scope[ns];
      }
      
      if (scope) {
        return scope[name];
      }
      return false;
    };
    
    this.__set = function(name, value, type, ns) {
      var scope = this.__v;
      
      if (ns !== null) {
        if (typeof scope[ns] === 'undefined') {
          scope[ns] = {};
        }
      }
      
      if (typeof type === 'undefined' || types.indexOf(type) === -1) {
        type = 'string';
      }
      
      if (name !== null) {
        var v;
        switch (type) {
          case 'boolean':
            v = Boolean(value);
            break;
          case 'number':
            v = Number(value);
            break;
          default: // String
            v = String(value);
        }
        
        if (ns !== null) {
          scope[ns][name] = {
            name: name,
            value: v,
            type: type
          };
        } else {
          scope[name] = {
            name: name,
            value: v,
            type: type
          };
        }
      }
      if (scope) {
        if (ns !== null) {
          return scope[ns][name];
        }
        return scope[name];
      }
      return false;
    };
    
    this.__render = function(el, v) {
      var ns = el.getAttribute('data-ns');
      var name = el.getAttribute('data-get');
      var addTypeClass = this.addTypeClass;
      
      if (el.getAttribute('data-addTypeClass') !== null) {
        if (el.getAttribute('data-addTypeClass').toLowerCase() === 'false') {
          addTypeClass = false;
        } else {
          addTypeClass = true;
        }
      }
      
      el.classList.add('v');
      
      if (v) {
        el.innerText = v.value;
        el.classList.add('v');
        if (this.addTypeClass && addTypeClass) {
            el.classList.add(v.type);
        };
        el.classList.remove('error');
      } else {
        el.innerText = 'ERROR[V]: Could not load variable ' + (typeof ns !== 'undefined' && ns !== null? '["' + ns + '"]': '')  + '"' + name + '"';
        if (this.styleErrors) {
          el.classList.add('error');
        }
      }
    };

    this.el.setters.forEach((function(el) {
      var ns = el.getAttribute('data-ns');
      var name = el.getAttribute('data-set');
      var type = el.getAttribute('data-type');
      var value = el.getAttribute('data-value');
      
      if (name !== null) {
        this.__set(name, value, type, ns);
      } else {
        el.innerText = 'ERROR[V]: Could not set variable ' + (ns? '["' + ns + '"]': '')  + '"' + name + '"';
        if (this.styleErrors) {
          el.classList.add('error');
        }
      }
    }).bind(this));
    
    this.el.getters.forEach((function(el) {
      var scope = this.__v;
      var ns = el.getAttribute('data-ns');
      var name = el.getAttribute('data-get');
      var v = this.__get(name, ns);
      
      this.__render(el, v);
      
    }).bind(this));
    
    return this;
  };
  
  v.prototype = {
    /**
     *
     * @param {string} name - Name of the varible to get.
     * @param {string} [ns] - Namespace of the variable.
     */
    get: function(name, ns) {
      return this.__get(name, ns);
    },
    /**
     * @param {string} name - Name of the varible to set.
     * @param {string} value - Value to be set.
     * @param {(boolean|number|string)} [type=string] - description
     * @param {string} [ns] - Namespace of the variable
     * @param {node} [el] - Element to render to.
     */
    set: function(name, value, type, ns, el) {
      var v = this.__set(name, value, type, ns);
      
      if (el) {
        this.__render(el, v);
        return {
          el: el,
          var: v
        }
      }
      
      return v;
    },
    /**
     *
     * @param {node} el  - Element to render to.
     * @param {object} v - Var data in its proper format.
     */
    render: function(el, v) {
      this.__render(el, v);
      return {
        el: el,
        var: v
      }
    },
  }
  
  window.V = v;
})();
