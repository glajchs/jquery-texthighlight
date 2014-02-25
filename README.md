jquery-texthighlight
====================

A JQuery plugin to allow the user to highlight sections of text, similar to how you would on a phone.

See the [demo page](http://glajchs.github.io/jquery-texthighlight/demo.html) for an example of how to use it.

![jquery-textHighlight-example](https://raw.github.com/glajchs/jquery-texthighlight/master/jquery-textHighlight-example.png "jquery-textHighlight-example")

All you need to do is provide a \<ul\> node and use the setText function to set the text into the \<ul\>.  It looks something like this:

`$("ul#myIdHere").textHighlight("setText", "http://glajchs.github.io/jquery-texthighlight/demo.html");`

You can then use the same .textHighlight() API to get/set the text and get/set/clear the highlighted sections.
