(function($) {
    function getCharacterFromPosition(eventXPosition, highlightingParentElement, selectorType) {
        var listElements = $($(highlightingParentElement).selector + " > li");
        var listElementToConsider = listElements.get(0);
        for (var i = 0; i < listElements.size(); i++) {
            if (eventXPosition > $(listElements.get(i)).offset().left) {
                if (selectorType == "end") {
                    if (eventXPosition < ($(listElements.get(i)).offset().left + ($(listElements.get(i)).width() / 2))) {
                        break;
                    }
                }
                listElementToConsider = listElements.get(i);
            } else {
                if (selectorType == "start") {
                    if (eventXPosition + ($(listElementToConsider).width() / 2) > ($(listElements.get(i)).offset().left)) {
                        listElementToConsider = listElements.get(i);
                    }
                }
                break;
            }
        }
        return $(listElementToConsider);
    }

    function getStartImage(imageGUID) {
        return $("#startImage-" + imageGUID);
    }

    function getEndImage(imageGUID) {
        return $("#endImage-" + imageGUID);
    }

    function highlightSelections(highlightingParentElement, shouldTriggerChangeEvent) {
        var startElements = getStartElements(highlightingParentElement);
        var endElements = getEndElements(highlightingParentElement);
        var currentImageGUID;
        if (highlightingParentElement == null) {
            return;
        }

        var invalidSections = new Array();
        highlightingParentElement.children().each(function () {
            if (!$(this).is("li")) {
                return;
            }
            if (currentImageGUID == null) {
                for (var imageGUID in startElements) {
                    if (startElements[imageGUID] != null &&
                        endElements[imageGUID] != null &&
                        startElements[imageGUID].get(0) == $(this)[0] &&
                        $.inArray(imageGUID, invalidSections) == -1) {
                        currentImageGUID = imageGUID;
                    }
                }
            }
            for (var imageGUID in endElements) {
                if (currentImageGUID != imageGUID &&
                    endElements[imageGUID] != null &&
                    endElements[imageGUID].get(0) == $(this)[0]) {
                    invalidSections.push(imageGUID);
                }
            }

            if (currentImageGUID != null) {
                $(this).css("background-color", "rgb(255, 0, 0)");
            } else {
                $(this).css("background-color", "initial");
            }

            if (currentImageGUID != null && endElements[currentImageGUID].get(0) == $(this)[0]) {
                currentImageGUID = null;
            }
        });
        if (shouldTriggerChangeEvent) {
            highlightingParentElement.trigger("highlightedTextChanged", methods.getHighlightedSections.apply(this, arguments));
        }
    }

    function createImageMarkers(highlightingParentElement, firstLetterToHighlight, lastLetterToHighlight) {
        var startElements = getStartElements(highlightingParentElement);
        var endElements = getEndElements(highlightingParentElement);
        var imageGUID = Math.floor((Math.random()*10000)+1).toString();
        var startImage = $("<img></img>").attr({
            src: "images/righttrap.png",
            style: "position: absolute; z-index: 2147483647;",
            id: "startImage-" + imageGUID
        });
        var startImageHeight = 27;
        var startImageOffsetX = 0;
        startImage.draggable({
            axis: "x",
            start: function(event, ui) {
                startImageOffsetX = event.offsetX;
            },
            drag: function(event, ui) {
                var targetX = event.clientX - startImageOffsetX;
                var listElement = getCharacterFromPosition(targetX, highlightingParentElement, "start");
                startElements[imageGUID] = listElement;
                highlightSelections(highlightingParentElement, true);
            },
            stop: function(event, ui) {
                var targetX = event.clientX - startImageOffsetX;
                var listElement = getCharacterFromPosition(targetX, highlightingParentElement, "start");
                if (targetX >= getEndImage(imageGUID).get(0).x) {
                    startImage.remove();
                    getEndImage(imageGUID).remove();
                    delete startElements[imageGUID];
                    delete endElements[imageGUID];
                } else {
                    startElements[imageGUID] = listElement;
                    getStartImage(imageGUID).css("top", startElements[imageGUID].position().top - startImageHeight);
                    getStartImage(imageGUID).css("left", startElements[imageGUID].position().left
                            + startElements[imageGUID].offsetParent().get(0).scrollLeft);
                }
                highlightSelections(highlightingParentElement, true);
                startImageOffsetX = 0;
            }
        });
        highlightingParentElement.append(startImage);
        startImage.css("top", $(firstLetterToHighlight).position().top - startImageHeight);
        startImage.css("left", $(firstLetterToHighlight).position().left
                + $(firstLetterToHighlight).offsetParent().get(0).scrollLeft);
        startElements[imageGUID] = $(firstLetterToHighlight);

        var endImage = $("<img></img>").attr({
            src: "images/lefttrap.png",
            style: "position: absolute; z-index: 2147483647;",
            id: "endImage-" + imageGUID
        });
        var endImageHeight = 27;
        var endImageWidth = 14;
        var endImageOffsetX = 0;
        endImage.draggable({
            axis: "x",
            start: function(event, ui) {
                endImageOffsetX = event.offsetX;
            },
            drag: function(event, ui) {
                var targetX = event.clientX - endImageOffsetX + event.target.width;
                var listElement = getCharacterFromPosition(targetX, highlightingParentElement, "end");
                endElements[imageGUID] = listElement;
                highlightSelections(highlightingParentElement, true);
            },
            stop: function(event, ui) {
                var targetX = event.clientX - endImageOffsetX + event.target.width;
                var listElement = getCharacterFromPosition(targetX, highlightingParentElement, "end");
                if (targetX <= getStartImage(imageGUID).get(0).x) {
                    endImage.remove();
                    getStartImage(imageGUID).remove();
                    delete startElements[imageGUID];
                    delete endElements[imageGUID];
                } else {
                    endElements[imageGUID] = listElement;
                    getEndImage(imageGUID).css("top", endElements[imageGUID].position().top - endImageHeight);
                    getEndImage(imageGUID).css("left", endElements[imageGUID].position().left
                                                               + startElements[imageGUID].offsetParent().get(0).scrollLeft
                                                               + endElements[imageGUID].width()
                            - endImageWidth);
                }
                highlightSelections(highlightingParentElement, true);
            }
        });
        highlightingParentElement.append(endImage);
        endImage.css("top", $(lastLetterToHighlight).position().top - endImageHeight);
        endImage.css("left", $(lastLetterToHighlight).position().left
                                     + $(lastLetterToHighlight).offsetParent().get(0).scrollLeft
                                     + $(lastLetterToHighlight).width()
                - endImageWidth);
        endElements[imageGUID] = $(lastLetterToHighlight);
    }

    function getStartElements(highlightingParentElement) {
        return getTextHighlightingObject(highlightingParentElement).startElements;
    }

    function getEndElements(highlightingParentElement) {
        return getTextHighlightingObject(highlightingParentElement).endElements;
    }

    function getTextHighlightingObject(highlightingParentElement) {
        for (var i = 0; i < textHighlightsMasterList.length; i++) {
            if (highlightingParentElement.get(0).textHighlightGUID == textHighlightsMasterList[i].textHighlightGUID) {
                return textHighlightsMasterList[i];
            }
        }
        var newTextHighlightingObject = new Object();
        newTextHighlightingObject.startElements = new Object();
        newTextHighlightingObject.endElements = new Object();
        newTextHighlightingObject.textHighlightGUID = highlightingParentElement.get(0).textHighlightGUID;
        textHighlightsMasterList.push(newTextHighlightingObject);
        return newTextHighlightingObject;
    }

    var textHighlightsMasterList = new Array();

    var methods = {
        setText: function(text) {
            var highlightingParentElement = this;
            highlightingParentElement.html("");
            var n = text.split("");
            $.each(n, function (index, value) {
                var liElement = $("<li></li>")
                        .text(value)
                        .css("display", "inline")
                        .css("height", "25px");
                highlightingParentElement.append(liElement);
            });
        },
        getText: function(highlightingParentElement) {
            if (highlightingParentElement == null) {
                highlightingParentElement = this;
            }
            return highlightingParentElement.text();
        },
        getHighlightedSections: function(highlightingParentElement) {
            if (highlightingParentElement == null) {
                highlightingParentElement = this;
            }
            var characterElements = $($(highlightingParentElement).selector + " > li");
            var results = new Array();
            var currentResult = new Object();
            var isCurrentSectionHighlighted = false;
            for (var i = 0; i < characterElements.size(); i++) {
                if (!isCurrentSectionHighlighted && $(characterElements.get(i)).css("background-color") == "rgb(255, 0, 0)") {
                    currentResult.startIndex = i;
                    isCurrentSectionHighlighted = true;
                } else if (isCurrentSectionHighlighted && ($(characterElements.get(i)).css("background-color") != "rgb(255, 0, 0)")) {
                    currentResult.endIndex = i - 1;
                    currentResult.matchingSubstring = highlightingParentElement.text()
                            .substring(currentResult.startIndex, currentResult.endIndex + 1);
                    results.push(currentResult);
                    isCurrentSectionHighlighted = false;
                    currentResult = new Object();
                } else if (isCurrentSectionHighlighted && i + 1 == characterElements.size()) {
                    currentResult.endIndex = i;
                    currentResult.matchingSubstring = highlightingParentElement.text()
                            .substring(currentResult.startIndex);
                    results.push(currentResult);
                    isCurrentSectionHighlighted = false;
                    currentResult = new Object();
                }
            }
            return results;
        },
        addHighlightedSection: function(startIndex, endIndex) {
            var highlightingParentElement = this;
            var listElements = $($(highlightingParentElement).selector + " > li");
            createImageMarkers(highlightingParentElement, listElements[startIndex], listElements[endIndex - 1]);
            highlightSelections(highlightingParentElement, false);
        },
        setHighlightedSections: function(sectionsObject) {
            methods.clearHighlightedSections.apply(this);
            var highlightingParentElement = this;
            var listElements = $($(highlightingParentElement).selector + " > li");
            for (var i = 0; i < sectionsObject.length; i++) {
                createImageMarkers(highlightingParentElement, listElements[sectionsObject[i].startIndex], listElements[sectionsObject[i].endIndex - 1]);
            }
            highlightSelections(highlightingParentElement, false);
        },
        clearHighlightedSections: function() {
            var highlightingParentElement = this;
            var startElements = getStartElements(highlightingParentElement);
            for (var i in startElements) {
                getStartImage(i).remove();
                delete startElements[i];
            }
            var endElements = getEndElements(highlightingParentElement);
            for (var i in endElements) {
                getEndImage(i).remove();
                delete endElements[i];
            }
            var listElements = $($(highlightingParentElement).selector + " > li");
            for (var i = 0; i < listElements.length; i++) {
                $(listElements[i]).css("background-color", "initial");
            }
        },
        init: function() {
            var highlightingParentElement = this;
            highlightingParentElement.css("list-style", "none");
            highlightingParentElement.css("padding-left", "0px");
            highlightingParentElement.css("margin", "0px");
            highlightingParentElement.disableSelection();
            var textHighlightGUID = Math.floor((Math.random()*10000)+1).toString();
            highlightingParentElement.get(0).textHighlightGUID = textHighlightGUID;
            highlightingParentElement.click([highlightingParentElement], function (event) {
                var highlightingParentElement = event.data[0];
                var firstLetterToHighlight = getCharacterFromPosition(event.pageX, highlightingParentElement, "start");
                if (!$(firstLetterToHighlight).is("li") || $(firstLetterToHighlight).css("background-color") == "rgb(255, 0, 0)") {
                    return;
                }
                var lastLetterToHighlight = getCharacterFromPosition(event.pageX + 40, highlightingParentElement, "end");
                if (!$(firstLetterToHighlight).is("li")) {
                    return;
                }
                createImageMarkers(highlightingParentElement, firstLetterToHighlight, lastLetterToHighlight);
                highlightSelections(highlightingParentElement, true);
            });
        }
    };

    $.fn.extend({
        textHighlight: function(method, options) {
            if (!this.is("ul")) {
                console.log("The element isn't of tag type \"ul\".  Ignoring.");
                return;
            }
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof method === 'object' || !method) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('Method ' +  method + ' does not exist on jQuery.textHighlight');
            }
        }
    });
})(jQuery);