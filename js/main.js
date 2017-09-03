var context = {
  targets: targets
};

function render(templateSelector, destinationSelector, targetIndex) {
  var chosenTemplate = document.querySelector(templateSelector).innerHTML;
  var destination = document.querySelector(destinationSelector);
  var template = Handlebars.compile(chosenTemplate);
  if (targetIndex >= 0) {
    var html = template(context.targets[targetIndex]);
  } else {
    var html = template(context);
  }
  destination.innerHTML = html;
  if (templateSelector === "#list-template"){
    addListListeners();
  }
}

render('#list-template', '#list');

function showDetail(index) {
  console.log("detail");
  render("#detail-template", "#detail-container", index);
}

function addListListeners(){
  var listItems = [].slice.call(document.querySelectorAll(".company-list__item"));
  console.log(listItems);

  listItems.forEach(function(listItem, i){
    listItem.addEventListener("mouseover",
      function () {
        showDetail(i);
      });
    });
  }
