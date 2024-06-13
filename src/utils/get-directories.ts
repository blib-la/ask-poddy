import fs from "node:fs/promises";

function removeNonAlphabeticalCharacters(inputStr: string) {
	let outputStr = inputStr.replace(/[^a-zA-Z]/g, "");
	return outputStr;
}

function firstCharToUpperCase(inputStr: string) {
	let outputStr = inputStr.charAt(0).toUpperCase() + inputStr.slice(1);
	return outputStr;
}

/**
 * Get the list of all directories from the given path.
 * It also formats the name by removing any non-alphabetical characters and making the first character to uppercase.
 *
 * @param {string} pathname - The path from which to get the directories
 *
 * @returns {Promise<Array<{name: string, className: string}>>} - Returns a Promise that resolves to an array of objects.
 * Each object has a `name` property which is the actual name of the directory, and a `className` property
 * which is name of the directory but with the first character in uppercase and any non-alphabetical characters removed.
 *
 * @example
 *  getDirectories("/home/user/documents")
 *    .then(directories => console.log(directories))
 *    .catch(err => console.error(err));
 *
 * @throws {NodeJS.ErrnoException} - Throws an error if something went wrong while reading the directory
 */
export async function getDirectories(pathname: string) {
	let dirs = [];
	try {
		const files = await fs.readdir(pathname, { withFileTypes: true });
		for (let file of files) {
			if (file.isDirectory()) {
				dirs.push({
					name: file.name,
					className: firstCharToUpperCase(removeNonAlphabeticalCharacters(file.name)),
				});
			}
		}
	} catch (err) {
		console.error(err);
	}
	return dirs;
}
