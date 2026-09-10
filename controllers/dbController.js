const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");


async function openHome(req, res) {
  const categories = await db.getAllCategories();
  const items = await db.getAllItems();
  res.render("home", { categories: categories, items: items });
}


async function openCategory(req, res) {
  const catName = req.params.category_name;
  const category = await db.getCategory(catName);
  const catItems = await db.getCategoryItems(catName);
  res.render("category", { category: category, items: catItems });
}


async function openCategoryForm(req, res) {
  res.render("categoryForm");
}


const validateCategory = [
  body("name").trim()
    .notEmpty().withMessage("Category name should not be empty."),
  body("description").trim()
    .isLength({ min: 10 }).withMessage("Category description should be at least 10 characters long."),
];
async function submitCategory(req, res) {
  // validate inputs, reload page with error messages if invalid
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("categoryForm", {
      errors: errors.array(),
    });
  }

  // effectively "const name = req.body.name" and "const description = req.body.description"
  const { name, description } = matchedData(req);
  const postErrors = await db.postNewCategory(name, description);
  // check if any post errors (mainly if an entry with the same primary key, aka category name, already exists in the "categories" DB)
  if(postErrors.length === 0) {
    res.redirect("/");
  }
  else {
    return res.status(400).render("categoryForm", {
      errors: postErrors,
    });
  }
}


async function deleteCategory(req, res) {
  const catName = req.params.category_name;
  await db.deleteCategory(catName);
  res.redirect("/");
}


async function editCategory(req, res) {
  const catName = req.params.category_name;
  const catDescription = req.body.description;
  await db.updateCategory(catName, catDescription);
  res.redirect("/");
}


async function openItemDetails(req, res) {
  const catName = req.params.category_name;
  const itemName = req.params.item_name;
  const item = await db.getItem(itemName);
  const itemCategories = await db.getItemCategories(itemName);
  res.render("itemDetails", { category_name: catName, item: item, item_categories: itemCategories });
}


async function openItemForm(req, res) {
  const catName = req.params.category_name;
  res.render("itemForm", { category_name: catName });
}


const validateItem = [
  body("name").trim()
    .notEmpty().withMessage("Item name should not be empty."),
  body("description").trim()
    .isLength({ min: 10 }).withMessage("Item description should be at least 10 characters long."),
  body("stock").trim()
    .notEmpty().withMessage("Item stock should not be empty.")
    .isInt({ min: 0 }).withMessage("Item stock should be a non-negative number."),
];
async function submitItem(req, res) {
  // if item is created from homepage, then it just creates an item
  // if item is created from category page, then it both creates an item and adds it to the category
  const catName = req.params.category_name || null;
  const errors = validationResult(req);

  // display an error message on the page if input validation fails
  if (!errors.isEmpty()) {
    return res.status(400).render("itemForm", {
      // this works, apparently
      ...(catName ? { category_name: catName } : {}),
      errors: errors.array(),
    });
  }

  const { name, description, stock } = matchedData(req);
  const itemName = name;
  const postErrors = await db.postNewItem(catName, itemName, description, stock);

  // check if any post errors (mainly if an entry with the same primary keys, aka item.name, already exists in the "items" DB)
  if(postErrors.length > 0) {
    return res.status(400).render("itemForm", {
      category_name: catName,
      errors: postErrors,
    });
  }

  // redirect to category if category_name exists, otherwise redirect to homepage
  if(catName) {
    res.redirect(`/category/${catName}`);
  }
  else {
    res.redirect("/");
  }
}


async function deleteItem(req, res) {
  // category_name, if available, will be used to redirect to the category page
  const catName = req.params.category_name || null;
  const itemName = req.params.item_name;
  await db.deleteItem(itemName);

  if(catName) {
    res.redirect(`/category/${catName}`);
  }
  else {
    res.redirect(`/`);
  }
}


async function editItem(req, res) {
  const catName = req.params.category_name || null;
  const itemName = req.params.item_name;
  const itemDescription = req.body.description;
  const itemStock = req.body.stock;
  await db.updateItem(itemName, itemDescription, itemStock);

  if(catName) {
    res.redirect(`/category/${catName}`);
  }
  else {
    res.redirect(`/`);
  }
}


async function openCategoryItemForm(req, res) {
  const catName = req.params.category_name;
  const itemsList = await db.getValidItemsForCategory(catName);
  res.render("categoryItemForm", { category_name: catName, items: itemsList });
}


async function submitCategoryItem(req, res) {
  const catName = req.params.category_name;
  const itemName = req.body.categoryItem;

  if(itemName === "invalidOption") {
    const itemsList = await db.getValidItemsForCategory(catName);
    return res.status(400).render("categoryItemForm", {
      category_name: catName,
      items: itemsList,
      errors: [{ msg: "Please select a valid item." }],
    });
  }

  await db.postCategoryItem(catName, itemName);
  res.redirect(`/category/${catName}`);
}


async function deleteCategoryItem(req, res) {
  const catName = req.params.category_name;
  const itemName = req.params.item_name;
  await db.deleteCategoryItem(catName, itemName);
  res.redirect(`/category/${catName}`);
}


async function deleteItemCategory(req, res) {
  const catName = req.params.category_name;
  const itemName = req.params.item_name;
  await db.deleteCategoryItem(catName, itemName);
  res.redirect(`/item/${itemName}`);
}


module.exports = {
  openHome,
  openCategoryForm,
  validateCategory,
  submitCategory,
  openCategory,
  deleteCategory,
  editCategory,
  openItemDetails,
  openItemForm,
  validateItem,
  submitItem,
  deleteItem,
  editItem,
  openCategoryItemForm,
  submitCategoryItem,
  deleteCategoryItem,
  deleteItemCategory
};
