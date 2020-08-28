const path = require("path");

function getAbsolutePath(filename) {
  let normalizedFilename = path.normalize(filename); // removes dot slash
  let hasDotSlash = filename.startsWith("./");
  return hasDotSlash ? path.join(path.resolve("."), normalizedFilename) : normalizedFilename;
}

function getRelativePath(filename) {
  let normalizedFilename = path.normalize(filename); // removes dot slash
  let workingDirectory = path.resolve(".");
  let result = "./" + (normalizedFilename.startsWith(workingDirectory) ? normalizedFilename.substr(workingDirectory.length + 1) : normalizedFilename);
  return result;
}

/* unordered */
function getDependenciesFor(filename, avoidCircular, allowNotFound = false) {
  let absoluteFilename = getAbsolutePath(filename)

  try {
    require(absoluteFilename);
  } catch(e) {
    if(e.code === "MODULE_NOT_FOUND" && allowNotFound) {
      // do nothing
    } else {
      throw e;
    }
  }


  let mod;
  for(let entry in require.cache) {
    if(entry === absoluteFilename) {
      mod = require.cache[entry];
      break;
    }
  }

  let dependencies = new Set();

  if(!mod) {
    if(!allowNotFound) {
      throw new Error(`Could not find ${filename} in @11ty/dependency-tree`);
    }
  } else {
    let relativeFilename = getRelativePath(mod.filename);
    if(!avoidCircular) {
      avoidCircular = {};
    } else {
      dependencies.add(relativeFilename);
    }

    avoidCircular[relativeFilename] = true;

    if(mod.children) {
      for(let child of mod.children) {
        let relativeChildFilename = getRelativePath(child.filename);
        if(relativeChildFilename.indexOf("node_modules") === -1 && // filter out node_modules
          !dependencies.has(relativeChildFilename) && // avoid infinite looping with circular deps
          !avoidCircular[relativeChildFilename] ) {
          for(let dependency of getDependenciesFor(relativeChildFilename, avoidCircular, allowNotFound)) {
            dependencies.add(dependency);
          }
        }
      }
    }
  }

  return dependencies;
}

function getCleanDependencyListFor(filename, options = {}) {
  return Array.from( getDependenciesFor(filename, null, options.allowNotFound) );
}

module.exports = getCleanDependencyListFor;
