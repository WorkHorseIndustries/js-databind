js-databind
===========

binds javascript objects and html input elements, so that a change to one will be reflect in the other.

Requirments
===========
jQuery


Summary
===========

Simply Add the data-bound="key:value" to the input element of the html. key is a unique identifier shared with the 
javascript object and value is the property of the javascript object. It is possible to bind multiple properties from the
same or different objects.  This is done by adding additional key value pairs seperating by a comma to the data bound
object. whether they reference they use the same key or not each reference to a property must come in the key:value format.
Note there is no spaces surrounding the ':'.


after the HTML markup is complete, call the DataBinder object

Example
============


''''
<!-- html markup -->
<input id="test" type="text" data-bound="12:t_prop"/>

var binder = DataBinder();

var to_bound_obj = {id: '12',  t_prop: "test"};
''''

var bound = binder(toBoundObj.id, toBoundObj);
Note: you don't have to pass in an object, you only need an ID.  if you don't pass in an object it will create an empty
Object and use that in the binder. 

now any changes to the html will be reflected in the toBoundObj.  By calling set on bound object with the property name
as a parameter you set both the toBoundObj and the html input. 


Methods
===========
After initializing the DataBinder object
var binder = DataBinder();
var inst = binder(id, optional obj);

inst has 4 methods available.

get (p_name)  
this retrieves the underling object property p_name

set (p_names, val)
p_name is either a string or an array of strings. 
if pnames is a string it will set the object property p_names to be value and update the html
if pnames is an array it will iterate over pnames and at each instance set that property to val after iteration
it updates the html


bind
binds the object to the html.  IMPORTANT this is called on construction and doesn't need to be called again unless 
the object is unbound

unbind 
unbinds the object. 





