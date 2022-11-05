// Modified from https://github.com/liufeifeiholy/vite-plugin-zip to better suit needs
// - Zip in correct format (foo.zip/distFiles instead of foo.zip/foo/distFiles)

import * as path from 'path'
import * as fs from 'fs'
import { ZipFile } from 'yazl'

const zip = (options = { }) => {

  let {
    dir,
    outputName
  } = options

  let outputPath
  let config

  return {
    name: 'vite:zip',
    apply: 'build',
    enforce: 'post',
    configResolved(resolvedConfig) {
      config = resolvedConfig
      outputPath = path.isAbsolute(config.build.outDir)
        ? config.build.outDir
        : path.join(config.root, config.build.outDir)
    },

    closeBundle() {
      let arr = [] 
      dir = dir || outputPath
      outputName = outputName || `${new Date().getMonth() + 1}${new Date().getDate()}`

      deleteExistingArchive(dir, outputName);
      getFileList(dir, arr)
      generateZip(arr, dir, outputName)
    }
  }
}

const deleteExistingArchive = (dir, outputName) => {
  const outFile = path.resolve(process.cwd(), `${dir}/${outputName}.zip`);
  if (fs.existsSync(outFile))
    fs.rmSync(outFile);
}

const getFileList = function(dir, arr) {
  if (!dir) return

  try {
    const stat = fs.statSync(dir)
    if (stat.isFile()) {
      arr.push(dir)
      return
    } else if (stat.isDirectory()) {
      const files = fs.readdirSync(dir)
      while (files.length) {
        const file = files.pop()
        const filePath = `${dir}/${file}`
        if (filePath.indexOf('.zip') > -1) { // delete existing .zip file
          fs.rmSync(filePath)
          continue
        }
        getFileList(filePath, arr)
      }
    }
  } catch(e) {
    console.log(e)
  } 
}

const generateZip = (arr, dir, outputName) => {
  const zipfile = new ZipFile()
  const outFile = path.resolve(process.cwd(), `${dir}/${outputName}.zip`)
  arr.forEach(file => {
    zipfile.addFile(file, file.replace(dir + "/", ""))
  })
  zipfile.outputStream.pipe(fs.createWriteStream(outFile)).on("close", function() {
    console.log("done");
  });
  zipfile.end();
}

export default zip