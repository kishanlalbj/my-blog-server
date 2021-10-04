const Article = require("../../models/Article");

const addNewArticle = async (article) => {
  const { title, subtitle, content } = article;

  try {
    let newArticle = new Article({
      title,
      subtitle,
      content,
    });

    let savedArticle = await newArticle.save();

    return savedArticle;
  } catch (error) {
    return error.message;
  }
};

const getAllArticles = async () => {
  try {
    let articles = await Article.find().sort({ createdOn: -1 });

    return articles;
  } catch (error) {
    return error.message;
  }
};

const getArticleById = async (id) => {
  try {
    let article = await Article.findById(id).sort({ "comments.createdOn": 1 });

    return article;
  } catch (error) {
    return error.message;
  }
};

const searchArticles = async (searchParams) => {
  try {
    const regex = new RegExp(searchParams, "ig");
    let articles = await Article.find({
      title: regex,
    });
    return articles;
  } catch (error) {
    return error.message;
  }
};

const addNewComment = async (articleId, comment) => {
  try {
    const article = await Article.findOneAndUpdate(
      { id: articleId },
      { $push: { comments: comment } },
      { new: true }
    ).sort({ "comments.createdOn": 1 });

    return article;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  addNewArticle,
  getAllArticles,
  getArticleById,
  searchArticles,
  addNewComment,
};
