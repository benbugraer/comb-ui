import fs from "fs";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
// import rehypeStringify from "rehype-stringify";
// import remarkParse from "remark-parse";
// import remarkRehype from "remark-rehype";
// import { unified } from "unified";
import matter from "gray-matter";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import { transformerNotationDiff } from "@shikijs/transformers";
import { serialize } from "next-mdx-remote/serialize";

// type Metadata = {
//   title: string;
//   description: string;
//   image?: string;
// };

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

// export async function markdownToHTML(markdown: string) {
//     const p = await unified()
//         .use(remarkParse)
//         .use(remarkRehype)
//         .use(rehypePrettyCode, {
//             transformers: [
//                 transformerNotationDiff(),
//                 transformerCopyButton({
//                     visibility: "hover",
//                     feedbackDuration: 1500,
//                 }),
//             ],
//             theme: "one-light",
//             filterMetaString: (string) => string.replace(/filename="[^"]*"/, ""),
//         })
//         .use(rehypeStringify)
//         .process(markdown);
//
//     return p.toString();
// }

export async function getRecipes(slug: string) {
  const filePath = path.join("content", "recipes", `${slug}.mdx`);
  let source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data: metadata } = matter(source);

  const mdxSource = await serialize(rawContent, {
    parseFrontmatter: false,
    scope: metadata,
    mdxOptions: {
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            transformers: [
              transformerNotationDiff(),
              transformerCopyButton({
                visibility: "hover",
                feedbackDuration: 1500,
              }),
            ],
            theme: "one-light",
            filterMetaString: (string: any) =>
              string.replace(/filename="[^"]*"/, ""),
          },
        ],
      ],
    },
  });

  return {
    source: mdxSource,
    metadata,
    slug,
  };
}

async function getAllRecipes(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return Promise.all(
    mdxFiles.map(async (file) => {
      let slug = path.basename(file, path.extname(file));
      let { metadata, source } = await getRecipes(slug);
      return {
        metadata,
        slug,
        source,
      };
    })
  );
}

export async function getRecipePosts() {
  return getAllRecipes(path.join(process.cwd(), "content", "recipes"));
}
