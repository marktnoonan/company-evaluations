Handlebars.registerHelper('option', function(selectName) {
  var htmlBuffer = '';
  context.selectOptions[selectName].forEach(function (option) {
    htmlBuffer += '<option value="' + option +'">' + option + '</option>';
  });
  return new Handlebars.SafeString(htmlBuffer);
});

Handlebars.registerHelper('readable', function(text) {
  return new Handlebars.SafeString(context.readableFormFields[text]);
});
