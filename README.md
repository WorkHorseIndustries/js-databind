js-databind
===========

binds javascript objects and html input elements, so that a change to one will be reflect in the other.


This will use the publish/ subscriber data model.  Where a data object
signal bound elements in HTML using the the data attribute under data-bound.
The value of data-m-bound should be a list of colon sepereated key value pairs e.g.
data-bound="'key':'value', 'key':'value'". The 'key' reperesents the unique
identifier for the object being bound to this element. The 'value' represents the 
property of that object which the field is associated with. 

The document will listen on the change event for all elements with data-bound.
When a change event is captured, the value of data-bound will be parsed.

for each key it will trigger an event bound'key':change and the data passed to the event
will be the new value, and prop name. If multiple 'key's are
equal then there associated values will be bundled together and passed as an array of 
prop names to be updated with the new value. Both the object and the html element will 
listen on the bound'key':change event and will update accodingly. 
