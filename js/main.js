var context = {
  targets: targets
};

var palette = {
  yellow: "#EFE455",
  green: "#8AB755",
  red: "#FC7455",
  blue: "#00BBE5",
  orange: "#F79044"
}

var colorAssignments = {
  "Researching": "yellow",
  "Pending Approval": "blue",
  "Approved": "green",
  "Declined": "orange"
}

var hashFunctions = {

}

function toggleExpand(expandRef) {
  var targetElement = document.querySelector("#additional-" + expandRef);
  targetElement.style.display === "block" ? targetElement.style.display = "none" : targetElement.style.display = "block";
}


function processTargets() {
  context.processedTargets = context.targets.map(function(target) {
    var targetCopy = { ...target};
    var prettyTarget = prettifyNumbers(targetCopy);
    prettyTarget.statusColor = palette[colorAssignments[target.status]];
    return prettyTarget;
  });
}

function prettifyNumbers(targetObject) {
  Object.keys(targetObject).forEach(function (key) {
  var value = targetObject[key];
  if (typeof value === "number" && key !== "uid"){
    targetObject["pretty-" + key] = numeral(value).format('0,0');
  }
});
  return targetObject;
}

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
  if (templateSelector === "#list-template") {
    addListListeners();
  }
}

function showDetail(index) {
  render("#detail-template", "#detail-container", index);
}

function addListListeners() {
  var listItems = [].slice.call(document.querySelectorAll(".company-list__item"));
  var expandButtons = [].slice.call(document.querySelectorAll(".expand"));

  listItems.forEach(function(listItem, i) {
    listItem.addEventListener("click",
      function() {
        showDetail(i);
      });
  });
  expandButtons.forEach(function(button, i) {
    button.addEventListener("click",
      function() {
        toggleExpand(i);
      });
  });
}

function onHashChange() {
  if (window.location.hash) {
    var hashContent = window.location.hash.substring(2);
    var methodAndRef = hashContent.split("-");
    var method = methodAndRef[0];
    var ref = methodAndRef[1];
    hashFunctions[method](ref);
    console.log(method, ref);
  } else {
    console.log("no hash??");
  }
}


(function init() {
  processTargets();
  render('#list-template', '#list');
  window.onhashchange = onHashChange;
})();
