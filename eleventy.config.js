import path from "node:path";
import { pathToFileURL } from "node:url";
import * as sass from "sass";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";


export default function (eleventyConfig) {
    eleventyConfig.addPlugin(syntaxHighlight);

	eleventyConfig.addExtension("sass", {
		outputFileExtension: "css",

		// opt-out of Eleventy Layouts
		useLayouts: false,

		compile: async function (inputContent, inputPath) {
			let parsed = path.parse(inputPath);
			// Don’t compile file names that start with an underscore
			if(parsed.name.startsWith("_")) {
				return;
			}

			let result = sass.compileString(inputContent, {
                syntax: "indented",

                // Resolve relative imports from the original file
                url: pathToFileURL(path.resolve(inputPath)),

				loadPaths: [
					parsed.dir || ".",
					this.config.dir.includes,
				]
			});

			// Map dependencies for incremental builds
			this.addDependencies(inputPath, result.loadedUrls);

			return async (data) => {
				return result.css;
			};
		},
	});

    eleventyConfig.addTemplateFormats("sass")

    eleventyConfig.ignores.add("README.md");
};
