const router = require("express").Router();
const { verifyJWT, checkRoles } = require("../../auth/middleware");
const {
  addNewArticle,
  getAllArticles,
  getArticleById,
  searchArticles,
  addNewComment,
} = require("./article-controller");

router.post("/", verifyJWT, checkRoles, async (req, res) => {
  try {
    const { title, subtitle, content } = req.body;
    if (!title || !subtitle || !content) {
      res.status(400).send({ message: "Required data missing" });
    }

    let savedArticle = await addNewArticle({ title, subtitle, content });

    res.send(savedArticle);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    let articles = [];

    if (search) {
      articles = await searchArticles(search);
    } else {
      articles = await getAllArticles();
    }

    results.results = articles.slice(startIndex, endIndex);

    if (endIndex < articles.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { search } = req.query;

    const articles = await searchArticles(search);
    res.send(articles);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const articles = await getArticleById(id);
    res.send(articles);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/comment", async (req, res) => {
  try {
    const { articleId, comment } = req.body;

    const article = await addNewComment(articleId, comment);

    res.send(article);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
