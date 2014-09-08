#Cubone.js

Cubone is a module that adds the concept of collection views to Backbone.
Often in Backbone code you'll have a collection, loop over it and render
a view for every model in that collection.

```js
myCollection.each(function(model) {
  new MyView(model).render();
});
```

Using Cubone, create a CollectionView supplied with your collection and the view
you would like it to render and the same functionality is given to you.

```js
new Backbone.CollectionView({
  collection: myCollection,
  view: MyView
}).render();
```

`view` needs to be a constructor function, while `collection` needs to be an instance of a collection.


##What's the benefit?

The benefit is that Cubone will automatically listen for `add`, `remove` and `change` events on the collection and models,
re-rendering itself.

However, it's only going to re-render the specific model that was added, removed or changed so your entire collection
doesn't re-render when something changes.

This keeps you from having to write a lot of boiler plate code or duplication of logic as it's fairly common
to loop over a collection and render a view and to want it to re-render when that collection updates.

##render

Calling `render` on a collection view will render the view you specified for every model in your collection.
After calling `render` once, all following calls to render will only render models that have been marked as
`dirty` in the collection view. A model is marked as dirty when it has newly been added to the collection belonging
to the collection view, if a property on an existing model in the collection has changed, or if a call to `#expire`
is made. This will cause the collection view to re-render.

When a model is removed from the collection, it's view will be removed from the dom and render will be called again.

##expire

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
