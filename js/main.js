var context = {
  targets: targets,
  formChildren: formChildren,
  selectOptions: selectOptions,
  readableFormFields: readableFormFields,
  newTargetDefaults: newTargetDefaults
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
  maximize(index) {
    render("#detail-template", "#detail-container", index);
  },
  addTarget() {
    render("#add-target-template", "#add-target-container");
  }
}

function toggleExpand(expandRef) {
  var targetElement = document.querySelector("#additional-" + expandRef);
  if (targetElement.classList.contains("company-list__detail--show-additional")) {
    targetElement.classList.remove("company-list__detail--show-additional");
  } else {
    targetElement.classList.add("company-list__detail--show-additional");
  }
}

function processTargets() {
  context.processedTargets = context.targets.map(function(target) {
    var targetCopy = { ...target
    };
    var prettyTarget = prettifyNumbers(targetCopy);
    prettyTarget.statusColor = palette[colorAssignments[target.status]];
    return prettyTarget;
  });
}

function prettifyNumbers(targetObject) {
  Object.keys(targetObject).forEach(function(key) {
    var value = targetObject[key];
    if (typeof value === "number" && key !== "uid") {
      targetObject["pretty-" + key] = numeral(value).format('(0,0)');
    } else if (value === "unknown" && key !== "foundedYear") {
          targetObject["pretty-" + key] = "0";
    }
  });
  return targetObject;
}

function render(templateSelector, destinationSelector, targetIndex) {
  var chosenTemplate = document.querySelector(templateSelector).innerHTML;
  var destination = document.querySelector(destinationSelector);
  var template = Handlebars.compile(chosenTemplate);
  if (targetIndex >= 0) {
    var html = template(context.processedTargets[targetIndex]);
  } else {
    var html = template(context);
  }
  destination.innerHTML = html;
  if (templateSelector === "#list-template") {
    addListeners();
  } else if (templateSelector === "#detail-template") {
    document.querySelector(".detail-wrapper").classList.add("detail-wrapper--show");
  } else if (templateSelector === "#add-target-template") {
    document.querySelector(".add-target-wrapper").classList.add("add-target-wrapper--show");
  }
}

function addListeners() {
  var expandButtons = [].slice.call(document.querySelectorAll(".expand"));
  var maximizeButtons = [].slice.call(document.querySelectorAll(".li-body__view-full-button"));
  var fullViewCloser = document.querySelector(".detail-wrapper__closer");
  var detailWrapper = document.querySelector(".detail-wrapper");
  var deleteTargetButtons = [].slice.call(document.querySelectorAll(".li-body__delete-button"));

  expandButtons.forEach(function(button, i) {
    button.addEventListener("click",
      function() {
        toggleExpand(i);
      });
  });

  deleteTargetButtons.forEach(function(button, i) {
    button.addEventListener("click",
      function() {
        deleteTarget(i);
      });
  });

  maximizeButtons.forEach(function(button, i) {
    button.addEventListener("click",
      function() {
        window.location.hash = "!maximize-" + i;
      });
  });

  fullViewCloser.addEventListener("click", function() {
    detailWrapper.classList.remove("detail-wrapper--show");
    window.location.hash = "";
  });

}

function addFormListeners () {
  var addTargetCancelButton = document.querySelector("#cancel");
  var addTargetWrapper = document.querySelector(".add-target-wrapper");
  var addTargetForm = document.querySelector("#add-target-form");

  addTargetCancelButton.addEventListener("click", function() {
    addTargetWrapper.classList.remove("add-target-wrapper--show");
    window.location.hash = "";
  });

  addTargetForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var formInputs = [].slice.call(event.target);
    var keysAndValues = formInputs.map(function (input) {
      return ([input.name, input.value]);
    });
    var newTarget = {...context.newTargetDefaults};

    keysAndValues.forEach(function (keyAndValue) {
      if (parseInt(keyAndValue[1])) {
        keyAndValue[1] = parseInt(keyAndValue[1]);
      }
      newTarget[keyAndValue[0]] = keyAndValue[1] || "unknown";
    });

    newTarget.uid = context.targets.length;
    if (newTarget.lastYearEarnings && newTarget.lastYearExpenses) {
          newTarget.lastYearProfit = newTarget.lastYearEarnings - newTarget.lastYearExpenses;
    }

    context.targets.push(newTarget);
    processTargets();
    window.location.hash = "";
    render('#list-template', '#list');
  });
}


function onHashChange() {
  if (window.location.hash) {
    var hashContent = window.location.hash.substring(2);
    var methodAndRef = hashContent.split("-");
    var method = methodAndRef[0];
    var ref = methodAndRef[1] || ""; // to avoid passing "undefined" if no "-" in has;
    hashFunctions[method](ref);
  } else { // if hash is empty we want default view, remove any modals that might be open.
    if (document.querySelector(".detail-wrapper--show")) {
      document.querySelector(".detail-wrapper").classList.remove("detail-wrapper--show");
    } else if (document.querySelector(".add-target-wrapper--show")) {
      document.querySelector(".add-target-wrapper").classList.remove("add-target-wrapper--show");
    }
  }
}

function deleteTarget(index) {
  var targetBody = document.querySelector("#li-body" + index);
  var deleteConfirmation = document.querySelector("#delete-target" + index);
  targetBody.classList.add("li-body__pre-delete");
  deleteConfirmation.classList.add("li-body__delete-confirm--show");
}

function cancelDelete(index) {
  var targetBody = document.querySelector("#li-body" + index);
  var deleteConfirmation = document.querySelector("#delete-target" + index);
  targetBody.classList.remove("li-body__pre-delete");
  deleteConfirmation.classList.remove("li-body__delete-confirm--show");
}


(function init() {
  processTargets();
  addFormListeners();
  window.onhashchange = onHashChange;
  if (window.location.hash) {
    onHashChange();
  }
  render('#list-template', '#list');
})();
