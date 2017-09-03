var context = {targets: targets};

function render(templateSelector, destinationSelector) {
  var chosenTemplate = document.querySelector(templateSelector).innerHTML;
  var destination = document.querySelector(destinationSelector);
  var template = Handlebars.compile(chosenTemplate);
  var html = template(context);
  destination.innerHTML = html;
}

render('#list-template', '#list-container');
