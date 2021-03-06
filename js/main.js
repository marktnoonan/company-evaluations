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

var urlFunctions = {
  maximize(index) {
    render("#detail-template", "#detail-container", index);
    if (document.querySelector(".edit-target-wrapper--show")) {
      document.querySelector(".edit-target-wrapper").classList.remove("edit-target-wrapper--show");
    }
  },
  addTarget() {
    render("#add-target-template", "#add-target-container");
  },
  editTarget(index){
    context.nowEditing = index;
    render("#add-target-template", "#edit-target-container");
    populateEditForm();
  }
}

function populateEditForm() {
  var objectToEdit = context.targets[context.nowEditing];
  var formInputs = arrayFromCollection(document.querySelector("#edit-target-form"));

  formInputs.forEach(function (input) {
    if (input.name === "mainContactName") {
      input.value = objectToEdit.targetMainContact.name;
    } else if (input.name === "mainContactEmail") {
      input.value = objectToEdit.targetMainContact.email;
    } else if (input.name === "mainContactPhone") {
      input.value = objectToEdit.targetMainContact.phone;
    } else {
      input.value = objectToEdit[input.name] || "";
    }
  });
}

function saveEdits(event) {
  event.preventDefault();
  var objectToEdit = context.targets[context.nowEditing];
  var formInputs = arrayFromCollection(document.querySelector("#edit-target-form"));

  formInputs.forEach(function (input) {

    if (parseInt(input.value)) {
      objectToEdit[input.name] = parseInt(input.value);
    } else if (input.name === "mainContactName") {
        objectToEdit.targetMainContact.name = input.value;
      } else if (input.name === "mainContactEmail") {
        objectToEdit.targetMainContact.email = input.value;
      } else if (input.name === "mainContactPhone") {
        objectToEdit.targetMainContact.phone - input.value;
      } else {
      objectToEdit[input.name] = input.value || "";
    }
  });

  calculateFinancials(objectToEdit);
  processTargets();
  setHash("!maximize-" + context.nowEditing).then(function () {
    render('#list-template', '#list');
  });
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
    var targetCopy = spreadObject(target);
    var prettyTarget = prettifyNumbers(targetCopy);
    prettyTarget.statusColor = palette[colorAssignments[target.status]];
    return prettyTarget;
  });
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
  } else if (destinationSelector === "#detail-container") {
    document.querySelector(".detail-wrapper").classList.add("detail-wrapper--show");
  } else if (destinationSelector === "#add-target-container") {
    document.querySelector(".add-target-wrapper").classList.add("add-target-wrapper--show");
  } else if (destinationSelector === "#edit-target-container") {
    document.querySelector(".edit-target-wrapper").classList.add("edit-target-wrapper--show");
  } // these blocks are so similar we can combine them, but lets settle on the CSS structure first
}

function addListeners() {
  var expandButtons = arrayFromCollection(document.querySelectorAll(".expand"));
  var maximizeButtons = arrayFromCollection(document.querySelectorAll(".li-body__view-full-button"));
  var fullViewCloser = document.querySelector(".detail-wrapper__closer");
  var detailWrapper = document.querySelector(".detail-wrapper");
  var deleteTargetButtons = arrayFromCollection(document.querySelectorAll(".li-body__delete-button"));
  var cancelDeleteButtons = arrayFromCollection(document.querySelectorAll(".cancel-delete-button"));
  var confirmDeleteButtons = arrayFromCollection(document.querySelectorAll(".confirm-delete-button"));
  var editTargetForm = document.querySelector("#edit-target-form");

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

  cancelDeleteButtons.forEach(function(button, i) {
    button.addEventListener("click",
      function() {
        cancelDelete(i);
      });
  });

  confirmDeleteButtons.forEach(function(button, i) {
    button.addEventListener("click",
      function() {
        confirmDelete(i);
      });
  });

  maximizeButtons.forEach(function(button, i) {
    button.addEventListener("click",
      function() {
        setHash("!maximize-" + i);
      });
  });

  fullViewCloser.addEventListener("click", function() {
    detailWrapper.classList.remove("detail-wrapper--show");
    setHash("");
  });

  editTargetForm.addEventListener("submit", function (event) {
    saveEdits(event);
  });
}

function addFormListeners () {
  //TODO: split some of this out and add debt ratio calculation to the process

  var editCancelButton = document.querySelector("#cancel-edit");
  var editTargetWrapper = document.querySelector(".edit-target-wrapper");
  var addTargetCancelButton = document.querySelector("#cancel");
  var addTargetWrapper = document.querySelector(".add-target-wrapper");
  var addTargetForm = document.querySelector("#add-target-form");

  editCancelButton.addEventListener("click", function() {
    editTargetWrapper.classList.remove("edit-target-wrapper--show");
    setHash("!maximize-" + context.nowEditing);
  });

  addTargetCancelButton.addEventListener("click", function() {
    addTargetWrapper.classList.remove("add-target-wrapper--show");
    setHash("");
  });

  addTargetForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitTarget();
  });
}

function submitTarget() {
  var formInputs = arrayFromCollection(event.target);
  var newTarget = spreadObject(context.newTargetDefaults);
  var keysAndValues = formInputs.map(function (input) {
    return ([input.name, input.value]);
  });

  keysAndValues.forEach(function (keyAndValue) {
    if (parseInt(keyAndValue[1])) {
      keyAndValue[1] = parseInt(keyAndValue[1]);
    }
    newTarget[keyAndValue[0]] = keyAndValue[1] || "";
  });

  newTarget.uid = context.targets.length;
  calculateFinancials(newTarget);
  context.targets.push(newTarget);
  processTargets();
  setHash("");
  render('#list-template', '#list');
}


function calculateFinancials(targetObject) {

  if (targetObject.lastYearEarnings && targetObject.lastYearExpenses) {
        targetObject.lastYearProfit = targetObject.lastYearEarnings - targetObject.lastYearExpenses;
        targetObject.profitable =  targetObject.lastYearProfit > 0;
  }

  if (targetObject.totalAssets && targetObject.liabilities) {
        targetObject.debtRatio = (targetObject.liabilities / targetObject.totalAssets).toFixed(1);
  }
}

function onHashChange() {

  if (window.location.hash) {
    var hashContent = window.location.hash.substring(2);
    var methodAndRef = hashContent.split("-");
    var method = methodAndRef[0];
    var ref = methodAndRef[1] || ""; // to avoid passing "undefined" if no "-" in has;

    // checks if refreshed on the full view of a newly-added target ... we are not persisting data so it won't be there on refresh, we shouldn't load a weird empty full view
    if (ref < context.targets.length){
      urlFunctions[method](ref);
      window.scrollTo(0, 0);

    } else {
      setHash("");
    }

  } else { // if hash is empty we want default view, remove any modals that might be open.

    if (document.querySelector(".edit-target-wrapper--show")) {
      document.querySelector(".edit-target-wrapper").classList.remove("edit-target-wrapper--show");
    }else if (document.querySelector(".detail-wrapper--show")) {
      document.querySelector(".detail-wrapper").classList.remove("detail-wrapper--show");
    }

    if (document.querySelector(".add-target-wrapper--show")) {
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

function confirmDelete(index){
  var liForElement = document.querySelector("#li" + index);
  context.targets[index].display = false;
  context.processedTargets[index].display = false;
  liForElement.style.display = "none";
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
