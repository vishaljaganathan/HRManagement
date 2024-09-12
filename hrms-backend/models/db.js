var DB = require("./schemaconnection");

async function GetDocument(model, query, projection, extension, callback) {
  try {
    var query = DB[model].find(query, projection, extension.options);
    if (extension.populate) {
      query.populate(extension.populate);
    }
    if (extension.sort) {
      query.sort(extension.sort);
    }
    const docs = await query.exec();

    if (extension.count) {
      const count = await query.count();
      callback(null, { docs, count }); // Pass both docs and count
    } else {
      callback(null, docs);
    }
  } catch (error) {
    callback(error, null);
  }
}
async function GetOneDocument(model, query, projection, extension) {
  try {
    let docs; // Declare variable to hold the document

    // Build the query with chaining for clarity
    docs = DB[model].findOne(query, projection);

    if (extension.populate) {
      docs = docs.populate(extension.populate); // Chain populate
    }

    // Execute the query and await the result (Promise)
    docs = await docs.exec();

    return docs; // Return the document
  } catch (error) {
    // Handle errors appropriately (e.g., throw or log)
    throw error; // Re-throw for clearer error handling
  }
}

// async function GetOneDocument(model, query, projection, extension, callback) {
//   try {
//     var query = DB[model].findOne(query, projection, extension.options);
//     if (extension.populate) {
//       query.populate(extension.populate);
//     }
//     const docs = await query.exec();
//     callback(docs, null);
//   } catch (error) {
//     callback(null, docs);
//   }
// }

function GetRecentDocumet(model, sort, limit, extension, callback) {
  var query = DB[model].find().sort({ $natural: sort.sort }).limit(limit.limit);
  if (extension.populate) {
    query.populate(extension.populate);
  }
  query.exec(function (err, docs) {
    callback(err, docs);
  });
}

function GetAggregation(model, query, extension, callback) {
  DB[model].aggregate(query).exec(function (err, docs) {
    if (extension.populate) {
      DB[model].populate(docs, { path: extension.populate }, function (err, populatedTransactions) {
        callback(err, populatedTransactions);
      });
    } else {
      callback(err, docs);
    }
  });
}


async function InsertDocument(model, docs, callback) {
  try {
    var doc_obj = new DB[model](docs);
    let savedDocs = await doc_obj.save();
    callback(null, savedDocs);
  } catch (error) {
    callback(error, null);
  }
}

function DeleteDocument(model, criteria, callback) {
  DB[model].remove(criteria, function (err, docs) {
    callback(err, docs);
  });
}

function UpdateDocument(model, criteria, doc, options, callback) {
  DB[model].update(criteria, doc, options, function (err, docs) {
    callback(err, docs);
  });
}

function UpdateManyDocument(model, criteria, doc, options, callback) {
  DB[model].updateMany(criteria, doc, options, function (err, docs) {
    callback(err, docs);
  });
}

async function FindUpdateDocument(model, criteria, doc, options, callback) {
  try {
    const docs = await DB[model].findOneAndUpdate(criteria, doc, options);
    return docs;
  } catch (error) {
    throw error;
  }
  // DB[model].findOneAndUpdate(criteria, doc, options, function (err, docs) {
  //   if (err) {
  //     return callback(err, null);
  //   } else {
  //     return callback(null, result);
  //   }
  // });
}

function GetCount(model, conditions, callback) {
  DB[model].count(conditions, function (err, count) {
    callback(err, count);
  });
}

function PopulateDocument(model, docs, options, callback) {
  DB[model].populate(docs, options, function (err, docs) {
    callback(err, docs);
  });
}

module.exports = {
  GetDocument: GetDocument,
  GetOneDocument: GetOneDocument,
  InsertDocument: InsertDocument,
  DeleteDocument: DeleteDocument,
  UpdateDocument: UpdateDocument,
  FindUpdateDocument: FindUpdateDocument,
  GetAggregation: GetAggregation,
  PopulateDocument: PopulateDocument,
  GetCount: GetCount,
  UpdateManyDocument: UpdateManyDocument,
  GetRecentDocumet: GetRecentDocumet
};
