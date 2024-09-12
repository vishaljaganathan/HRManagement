function Capitalize(text) {
  // Check if text is defined and is a string
  if (typeof text !== 'string' || text.length === 0) {
    return ''; // Return empty string if text is not valid
  }

  const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
  return capitalizedText;
}


function UpperCase(text){
  const alteredText   = text.toUpperCase()
  return alteredText
}

function CreateSlug(text){
  var slug = text;
  slug = slug.replace(/[^\w\-]+/g, "-");
  slug = slug.toLowerCase();
  return slug
}

module.exports = {
  Capitalize : Capitalize,
  UpperCase  : UpperCase,
  CreateSlug : CreateSlug
};
