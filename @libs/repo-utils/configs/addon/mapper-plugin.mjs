/**
 * This is a rollup plugin to move route template files from "routes" to "templates" directory.
 */
export function moveRouteTemplatesPlugin() {
  return {
    name: 'move-route-templates',
    generateBundle(options, bundle) {
      const filesToRename = [];

      // Find all files matching the pattern (both .js and .js.map)
      for (const [fileName, file] of Object.entries(bundle)) {
        if (fileName.startsWith('routes/') && fileName.includes('-template.js')) {
          const newFileName = fileName
            .replace('routes/', 'templates/')
            .replace('-template.js', '.js');
          filesToRename.push({ oldName: fileName, newName: newFileName, file });
        }
      }

      // Rename the files in the bundle and update sourcemap references
      for (const { oldName, newName, file } of filesToRename) {
        // Extract the base filename for sourcemap reference update
        const oldBaseName = oldName.split('/').pop();
        const newBaseName = newName.split('/').pop();

        // Update sourcemap reference in .js files
        if (oldName.endsWith('.js') && !oldName.endsWith('.js.map') && file.code) {
          file.code = file.code.replace(
            `//# sourceMappingURL=${oldBaseName}.map`,
            `//# sourceMappingURL=${newBaseName}.map`
          );
        }

        delete bundle[oldName];
        bundle[newName] = file;
        file.fileName = newName;
      }
    },
  };
}

export function fileNameMapper(path) {
    // routes/dashboard/users/index-template.js -> templates/dashboard/users/index.js
    if (path.endsWith('-template.js')) {
        return path.replace('routes/', 'templates/').replace('-template.js', '.js');
    }
    return path;
}