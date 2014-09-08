#Cubone.js

Cubone is a module that adds the concept of collection views to Backbone.
Often in Backbone code you will iterate over a collection, rendering
a view for every model in that collection.

```js
myCollection.each(function(model) {
  new MyView(model).render();
});
```

Using Cubone, create a CollectionView supplied with your collection and the view
you would like it to render. This produces the same result with added benefit.

```js
new Backbone.CollectionView({
  collection: myCollection,
  view: MyView
}).render();
```

`view` needs to be a constructor function, while `collection` needs to be an instance of a Backbone collection.


##What's the benefit?

Cubone will re-render when your collection has changed or if any of the models inside the collection have changed.

When a model has changed, been added to or removed from your collection, Cubone is smart enough to only 
re-render the view for that model.

This reduces the amount of boiler plate and potential duplication of logic. Iterating over a collection,
rendering a view for each model and re-rendering when a change occurs is a fairly common pattern.

## #render

Calling `render` on a collection view will render the view you specified for every model in your collection.

After calling `render` once, all following calls to render will only render models that have been marked as
`dirty` in the collection view. A model is marked as dirty when:

* It has been added to the collection belonging to the collection view
* A property on it has changed
* A call to `#expire` has been made using it as an argument.

Any of these things happening will cause the collection view to re-render.

When a model is removed from the collection, its view will be removed from the dom and render will be called again.

## #expire

Calling expire, passing in a single model will cause the collection view to re-render that specific model's view.

```js
var model = new Backbone.Model();

var col_view = new Backbone.CollectionView({
  collection: new Backbone.Collection([model])
}).render();

col_view.expire(model);
// the collection view will re-render this model's view
```

Calling `expire` with no arguments will cause the collection view to re-render
every model in its collection.

##hook methods

By default, when a change is made to the collection or model, `render` will be called on the
collection view. However, hook methods have been provided in the event that you want
different functionality when a model is added, removed or changed. This keeps you from
having to overwrite the `render` function which would affect the behavior of all
change, add and remove events.

```js
var CustomAddCollection = Backbone.CollectionView.extend({
  added: function(model) {
  }
});

var CustomChangeCollection = Backbone.CollectionView.extend({
  changed: function(model) {
  },
  removed: function(model) {
  }
});

var add_collection = new CustomAddCollection({
  view: CustomView
});

var model = new Backbone.Model({ foo: 'bar' });
add_collection.collection.add(model);
// CustomAddCollection#added will get called instead of render

model.set('foo', 'baz');
// CustomAddCollection#render will get called

add_collection.collection.remove(model);
// CustomAddCollection#render will get called

change_collection = new CustomChangeCollection({
  view: CustomView
});

change_collection.collection.add(model);
// CustomChangeCollection#render will get called

model.set('foo', 'qux');
// CustomChangeCollection#changed will get called instead of render

change_collection.collection.remove(model);
// CustomChangeCollection#removed will get called instead of render

```

##defaults

Creating a `Backbone.CollectionView` with no arguments will set its `collection` property to
an empty `Backbone.Collection` instance and its `view` property to `Backbone.View`. Of course,
`Backbone.View` has an empty `render` function, so if you do not supply a view then the `CollectionView`
cannot render anything for you.

##Contributing

Fork it, `npm install`, open `spec/SpecRunner.html`, start writing tests and adding features!

##Licence

The MIT License

Copyright (c) 2014 Alex Williams

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
