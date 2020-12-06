import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

export function generate(options: Options) {
  const resolvedInputPath = path.resolve(process.cwd(), options.jsonFile);
  const resolvedOutputPath = path.resolve(process.cwd(), options.output);
  const jsonReport = readJsonReport(resolvedInputPath);
  writeHtmlReport(jsonReport, resolvedOutputPath);
}



function readJsonReport(filePath: string): JSON {
  const resolvedPath = path.resolve(__dirname, filePath);
  const rawData = fs.readFileSync(resolvedPath);
  return JSON.parse(rawData.toString());
}

function writeHtmlReport(content: JSON, filePath: string): void {
  const template = `
  <!DOCTYPE html>
  <html>

  <head>
      <title>K6 Summary Report</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
          integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
  </head>

  <body>
      <div class="container">
          <div class="jumbotron jumbotron-fluid bg-white">
              <div class="container">
                  <h1 class="display-4">K6 Summary Report</h1>
                  <p class="lead">Powered by k6-html-reporter</p>
              </div>
          </div>
      </div>
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
          integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
          crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx"
          crossorigin="anonymous"></script>
  </body>

  </html>
  `

  let html = ejs.render(template, { jsonReport: content });
  fs.writeFile(`${filePath}/report.html`, html, function (err) {
    if (err) throw err;
    console.log(`Report is created at ${filePath}`);
  });
}