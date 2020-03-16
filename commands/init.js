const { prompt } = require('inquirer');
const program = require('commander');
const chalk = require('chalk');
const download = require('download-git-repo');
const ora = require('ora');
const fs = require('fs');

const option =  program.parse(process.argv).args[0];
const defaultName = typeof option === 'string' ? option : 'vue-ts-default';
const tplList = require(`${__dirname}/../templates`)
const tplLists = Object.keys(tplList) || [];
const question = [{
  type: 'input',
  name: 'name',
  message: 'Project name',
  default: defaultName,
  filter(val) {
    return val.trim()
  },
  validate(val) {
    const validate = (val.trim().split(" ")).length === 1
    return validate || 'Project name is not allowed to have spaces';
  },
  transformer(val) {
    return val;
  }
}, {
  type: 'list',
  name: 'template',
  message: 'Project template',
  choices: tplLists,
  default: tplLists[0],
  validate(val) {
    return true;
  },
  transformer(val) {
    return val;
  }
}, {
  type: 'input',
  name: 'description',
  message: 'Project description',
  default: 'Vue project',
  validate (val) {
    return true;
  },
  transformer(val) {
    return val;
  }
}, {
  type: 'input',
  name: 'author',
  message: 'Author',
  default: 'project author',
  validate (val) {
    return true;
  },
  transformer(val) {
    return val;
  }
}];

module.exports = prompt(question).then(({ name, template, description, author }) => {
  const gitPlace = tplList[template]['place'];
  const gitBranch = tplList[template]['branch'];
  const spinner = ora('Downloading please wait...');
  spinner.start();
  download(`${gitPlace}${gitBranch}`, `./${name}`, (err) => {
    if (err) {
      console.log(chalk.red(err))
      process.exit()
    }
    fs.readFile(`./${name}/package.json`, 'utf8', (err, data) => {
      if (err) {
        spinner.stop();
        console.error(err);
        return;
      }
      const packageJson = JSON.parse(data);
      packageJson.name = name;
      packageJson.description = description;
      packageJson.author = author;
      fs.writeFile(`./${name}/package.json`, JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
        if (err) {
          spinner.stop();
          console.error(err);
          return;
        }
        spinner.stop();
        console.log(chalk.green('project init successfully!'))
        console.log(`
          ${chalk.bgWhite.black('   Run Application  ')}
          ${chalk.yellow(`cd ${name}`)}
          ${chalk.yellow('npm install')}
          ${chalk.yellow('npm start')}
        `);
      });
    });
  });
});
