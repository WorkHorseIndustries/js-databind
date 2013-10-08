if (jQuery !== undefined) {
    //Databinder
   DataBinder = (function ($) {
        'use strict';

        /*
            Goal:
            Provide two way binding between a javascript object and an associated 
            html object, such that changes in one are automatically reflected in the other.
    
            Implementation:
            This will use the publish/ subscriber data model.  Where a data object
            signal bound elements in HTML using the the data attribute under data-bound.
            The value of data-m-bound should be a list of colon sepereated key value pairs e.g.
            data-bound="<key> : <value>, <key> : <value>". The <key> reperesents and unique
            identifier for the object being bound to this element. The <value> represents the 
            property for that object, which the field is associated with. 
    
    
            The document will listen on the change event for all elements with data-bound.
            When a change event is captured, the value of data-m-bound will be parsed.
    
            for each key it will trigger an event bound<key>:change and the data passed to the event
            will be the new value, and prop name. If multiple <key>'s are
            equal then there associated values will be bundled together and passed as an array of 
            prop names to be updated with the new value. Both the object and the html element will 
            listen on the bound<key>:change event and will update accodingly. 
        */
       return function () {
           // pub is the publisher it takes care of listening for changes on either the dom or the subscriber data
            var pub = $({});

           // gets the event_name/message for a specific id.
            function get_msg(id) {
                return 'bound' + id + ':change';
            }

           // parses the attribute value from the data-m-bound attribute and converts it to an object of {key: prop_name  || [prop_name1, prop_name2 ...]}
            function parse_m_bound(data) {
                var kvps = data.split(','),
                    data_obj = {},
                    i, key, prop_name, kvp;

                for (i = 0; i < kvps.length; ++i) {
                    kvp = kvps[i].split(':');
                    key = kvp[0].trim();
                    prop_name = kvp[1].trim();
                    if (data_obj.hasOwnProperty(key)) {
                        prop_name = prop_name.split().concat(data_obj[key]);
                    }
                    data_obj[key] = prop_name;
                }
                return data_obj;
            }

           // listen to dom for changes of the data-m-bound elements
            $(document, '[data-bound]').on('change', '[data-m-bound]',  function (e) {
                // create an array of from the data-m-bound "<key>:<value>"
                var el = $(this),
                    data = parse_m_bound(el.data('bound')),
                    id, val;
                for (id in data) {
                    if (data.hasOwnProperty(id)){
                        val = el.is(':checkbox') ? el.is(':checked') : el.val();
                        pub.trigger(get_msg(id), [val, id, data[id]]);
                    }
                }
            });

           // attach a listener for a specific Id's message
            pub.subscribe = function (id) {
                pub.on(get_msg(id), function (evt, new_val, id, prop_name) {
                    var el;
                    $('[data-bound*="' + (id + ':' + prop_name) + '"]').each(function () {
                        el = $(this);
                        // html needs to be updated in different ways depending on what type of input it is.
                        if (el.is(":checkbox")){
                            el.prop('checked', new_val);
                        }else if (el.is("input, textarea, select")) {
                            el.val(new_val);
                        } else {
                            el.html(new_val);
                        }
                    });
                });
            };

           //turn off listener for a specific ID's message
            pub.unsubscribe = function (id) {
                pub.off(get_msg(id));
            };

            // registers different ids with the publisher.  on construction binds the object to change.  
            function Registrar(id, obj) {
                // the object that will be updated. 
                obj = obj || {};
                // createa new subsciber object that acts as an accessor for this object. 
                var subscriber = {
                    // set the property or properties of obj to new value
                    set: function (props, new_val) {
                        var i;
                        if ($.isArray(props)) {
                            for (i = 0; i < props.length; i++) {
                                obj[props[i]] = new_val;
                            }
                        } else {
                            obj[props] = new_val;
                        }
                        pub.trigger(get_msg(id), [new_val, id, props, subscriber]);
                    },
                    // gets a property of obj.
                    get: function (prop) {
                        return obj[prop];
                    },
                    // subscribes to the pub object and attaches it's own listener to update obj.
                    bind: function () {
                        pub.on(get_msg(id), function (evt, new_val, id, prop_names, caller) {
                            if (caller !== subscriber) {
                                subscriber.set(prop_names, new_val);
                            }
                        });
                        pub.subscribe(id);
                    },
                    // unbind obj.
                    unbind: function () {
                        pub.unsubscribe(id);
                    }
                };

                subscriber.bind();
                return subscriber;
            }

            return Registrar;
        };
    })(jQuery);
}