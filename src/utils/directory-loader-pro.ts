import { DirectoryLoader, UnknownHandling } from "langchain/document_loaders/fs/directory";

/**
 * `DirectoryLoaderPro` extends the `DirectoryLoader` class from
 * 'langchain/document_loaders/fs/directory' with additional functionality.
 *
 * @property {string[]} ignoredFolders - This is an array of folders which
 * are to be ignored during the loading process.
 */
export class DirectoryLoaderPro extends DirectoryLoader {
	ignoredFolders: string[];

	/**
	 * Creates a new instance of the `DirectoryLoaderPro` class, and can specify
	 * folders to be ignored.
	 *
	 * @param {string} directoryPath The path of the directory to load documents from.
	 * @param {any} loaders The loaders that are used for loading the documents.
	 * @param {string[]} ignoredFolders An array of folders that are to be ignored during the loading process.
	 * @param {boolean} recursive A boolean value representing whether sub-directories should be loaded recursively.
	 * @param {UnknownHandling} unknown An `UnknownHandling` enum value to specify the action to be taken when documents with unknown metadata are encountered.
	 */
	constructor(
		directoryPath: string,
		loaders: any,
		ignoredFolders: string[],
		recursive: boolean = true,
		unknown: UnknownHandling = UnknownHandling.Warn
	) {
		super(directoryPath, loaders, recursive, unknown);
		this.ignoredFolders = ignoredFolders;
	}

	/**
	 * Loads the documents from the directory and filters out the ignored folders.
	 *
	 * @returns {Promise<any>}
	 */
	async load(): Promise<any> {
		let documents = await super.load();

		// Get rid of files that are part of ignoredFolders
		documents = documents.filter(
			document =>
				!this.ignoredFolders.some(folder => document.metadata.source.includes(folder))
		);

		return documents;
	}
}
