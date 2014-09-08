(function (root, factory) {
  if (typeof exports === 'object' && typeof require === 'function') {
    module.exports = factory(require("backbone"));
  } else if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["backbone"], function(Backbone) {
      // Use global variables if the locals are undefined.
      return factory(Backbone || root.Backbone);
    });
  } else {
    factory(Backbone);
  }
}(this, function(Backbone) {

  var Cubone = {};

  Cubone.Handlers = {};

  Cubone.Handlers.hookFor = function(type) {
    var hooks = {
      'add': this.added,
      'remove': this.removed,
      'change': this.changed
    };

    return hooks[type];
  };

  Cubone.Handlers.add = function(model) {
    this.cacheCollection.push({
      model: model,
      view: new this.view({model: model}),
      dirty: true
    });
  };

  Cubone.Handlers.remove = function(model) {
    var cache = this.cacheCollection.findWhere({ model: model });
    cache.get('view').remove();
    this.cacheCollection.remove(cache)
  };

  Cubone.Handlers.change = function(model) {
    var cache = this.cacheCollection.findWhere({ model: model });
    if (cache) cache.set('dirty', true);
  };

  Cubone.CollectionView = function(options) {
    if(options === undefined) options = {};
    this.collection = options.collection || new Backbone.Collection([]);
    this.view = options.view || Backbone.View;

    var _this = this;

    _(['add', 'remove', 'change']).each(function(event) {
      _this.collection.on(event, _this._hook.bind(_this, { type: event }));
    });

    this.cacheCollection = new Backbone.Collection([]);

    this.collection.each(function(model) {
      _this.cacheCollection.push({
        dirty: true,
        model: model,
        view: new _this.view({ model: model })
      });
    });

    this.initialize.call(this, options);
  };

  _.extend(Cubone.CollectionView.prototype, Backbone.Events, {
    initialize: function(options) {},

    _hook: function(event, model) {
      Cubone.Handlers[event.type].call(this, model);
      var hook = Cubone.Handlers.hookFor.call(this, event.type);
      var method = hook || this.render;

      method.call(this, model);
    },

    render: function() {
      var _this = this;

      _(this.cacheCollection.where({ dirty: true })).each(function(cache) {
        cache.get('view').render(cache.get('model'));
        cache.set('dirty', false);
      });

      return this;
    },
    
    expire: function(model) {
      var cache;

      if (arguments.length === 0) {
        this.cacheCollection.each(function(model) { model.set('dirty', true) });
      } else if (model) {
        cache = this.cacheCollection.findWhere({ model: model });
        if (cache) cache.set('dirty', true);
      }

      this.render();
    }
  });

  Cubone.CollectionView.extend = Backbone.View.extend;

  Backbone.CollectionView = Cubone.CollectionView;

  return Backbone.CollectionView;
}));
