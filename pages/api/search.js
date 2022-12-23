import { getSortedPostsData } from "../../utils/posts";

const posts =
  process.env.NODE_ENV === "production"
    ? require("../../cache/data").posts
    : getSortedPostsData();

export default (req, res) => {
  const results = req.query.q
    ? posts.filter((post) => post.fileName.includes(req.query.q))
    : [];
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ results }));
};
