describe("Backbone.CollectionView", function() {

  describe(".constructor", function() {

    it("sets the given collection and view as properties", function() {
      var collection = new Backbone.Collection([]),

      view = Backbone.View,

      collection_view = new Backbone.CollectionView({
        collection: collection, 
        view: view
      })

      expect(collection_view.collection).toEqual(collection);
      expect(collection_view.view).toEqual(view);
    });

    it("calls initialize", function() {
      var CollView = Backbone.CollectionView.extend({
        initialize: function() {
        },
      });

      spyOn(CollView.prototype, 'initialize');

      var options = {};

      new CollView(options);

      expect(CollView.prototype.initialize).toHaveBeenCalledWith(options);
    });

  });

  describe("#render", function() {
    
    it("renders the view given for every model in the collection", function() {
      var modelCount = 4, models = [];

      for (var i = 0; i < modelCount; i++) {
        models.push(new Backbone.Model());
      }

      var collection = new Backbone.Collection(models)
      var col_view = new Backbone.CollectionView({
        collection: collection,
        view: Backbone.View
      });

      spyOn(Backbone.View.prototype, 'render');
      col_view.render();

      expect(Backbone.View.prototype.render.calls.count()).toEqual(modelCount);
    });

    it("returns this", function() {
      var col_view = new Backbone.CollectionView();
      expect(col_view.render().render().render()).toEqual(col_view);
    });

    describe("on add", function() {

      it("calls render", function() {
        var col_view = new Backbone.CollectionView();
        spyOn(col_view, 'render');

        col_view.collection.add(new Backbone.Model());

        expect(col_view.render).toHaveBeenCalled();
      });

      it("adds the given model to the collection cache and renders it", function() {
        var col_view = new Backbone.CollectionView({
          collection: new Backbone.Collection([{ foo: 'bar' }])
        });

        col_view.render();

        var render = spyOn(Backbone.View.prototype, 'render');

        col_view.collection.push(new Backbone.Model());

        expect(col_view.cacheCollection.length).toEqual(2);
        expect(render.calls.count()).toEqual(1);
      });

    }); // on add

    describe("on remove", function() {

      it("calls render", function() {
        var model = new Backbone.Model(),
            collection = new Backbone.Collection([model]),
            col_view = new Backbone.CollectionView({ collection: collection });

        spyOn(Backbone.CollectionView.prototype, 'render');
        col_view.collection.remove(model);

        expect(Backbone.CollectionView.prototype.render).toHaveBeenCalled();
      });

      it("removes the model from the collection cache", function() {
        var model = new Backbone.Model(),
            collection = new Backbone.Collection([model, new Backbone.Model(), new Backbone.Model()]),
            col_view = new Backbone.CollectionView({ collection: collection });

        spyOn(Backbone.View.prototype, 'remove');
        collection.remove(model);
        expect(col_view.cacheCollection.length).toEqual(2);
        expect(Backbone.View.prototype.remove.calls.count()).toEqual(1);
      });

    }); // on remove

    describe("on change", function() {

      it("calls render", function() {
        var model = new Backbone.Model({ foo: 'bar' }),
            collection = new Backbone.Collection([model]),
            col_view = new Backbone.CollectionView({ collection: collection });

        spyOn(Backbone.CollectionView.prototype, 'render');
        model.set('foo', 'baz');

        expect(Backbone.CollectionView.prototype.render).toHaveBeenCalled();
      });

      it("only re-renders the model that changed", function() {
        var model1 = new Backbone.Model({ foo: 'bar' }),
            model2 = new Backbone.Model(),
            collection = new Backbone.Collection([model1, model2]),
            collection_view = new Backbone.CollectionView({
              collection: collection
            });

        collection_view.render();

        spyOn(Backbone.View.prototype, 'render');

        model1.set('foo', 'baz');

        expect(Backbone.View.prototype.render.calls.count()).toEqual(1);
        expect(Backbone.View.prototype.render).toHaveBeenCalledWith(model1);
      });

    }); // on change

    describe("hook methods", function() {
      var Col = Backbone.CollectionView.extend({
        added: function(model) {
        },
        removed: function(model) {
        },
        changed: function(model) {
        }
      });

      var model = new Backbone.Model({ foo: 'baz' }),
          collection = new Backbone.Collection([model]),
          col = new Col({ collection: collection });

      it("supplies a hook method for add", function() {
        spyOn(col, 'added');
        spyOn(col, 'render');

        var model = new Backbone.Model();
        col.collection.add(model);

        expect(col.added).toHaveBeenCalledWith(model);
        expect(col.render).not.toHaveBeenCalled();
      });

      it("supplies a hook method for remove", function() {
        spyOn(col, 'removed');
        spyOn(col, 'render');

        col.collection.remove(model);

        expect(col.removed).toHaveBeenCalledWith(model);
        expect(col.render).not.toHaveBeenCalled();
      });

      it("supplies a hook method for change", function() {
        var model = new Backbone.Model();

        var col = new Col({
          collection: new Backbone.Collection([model])
        });

        spyOn(col, 'changed');
        spyOn(col, 'render');

        model.set('foo', 'bar');

        expect(col.changed).toHaveBeenCalledWith(model);
        expect(col.render).not.toHaveBeenCalled();
      });

    }); // describe hook methods

  }); // #render

  describe('#expire', function() {
    var model = new Backbone.Model(),
        collection = new Backbone.Collection([model]),
        col_view = new Backbone.CollectionView({
          collection: collection
        });

    it('expires the model given', function() {
      col_view.render();

      var render = spyOn(Backbone.View.prototype, 'render');

      col_view.expire(model);

      col_view.render();

      expect(render.calls.count()).toEqual(1);
    });

    it('expires the whole cache', function() {
      collection.push([
        { foo: 'bar' },
        { baz: 'qux' }
      ])

      col_view.render();

      var render = spyOn(Backbone.View.prototype, 'render');

      col_view.expire();

      col_view.render();

      expect(render.calls.count()).toEqual(collection.length);
    });

    it('does nothing when the model given does not exist', function() {
      col_view.render();

      col_view.expire(new Backbone.Model());

      var render = spyOn(Backbone.View.prototype, 'render');

      col_view.render();
      expect(render).not.toHaveBeenCalled();
    });

    it('calls render', function() {
      spyOn(col_view, 'render');

      col_view.expire();

      expect(col_view.render.calls.count()).toEqual(1);
    });

  }); // #expire

});
