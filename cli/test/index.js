const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const chalk = require('chalk');

const testFile = {};

main();

async function main() {
  fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
      );
    })
    .forEach((file) => {
      testFile[file.replace('.js', '')] = require('./' + file);
    });

  if (process.argv.length === 2) {
    console.log(chalk.blue.bold('-- Tests Disponibles --'));
    Object.keys(testFile).forEach((k) => {
      console.log(`  * ${chalk.underline(k + ':')} ${testFile[k].description}`);
    });
  } else {
    if (Object.keys(testFile).includes(process.argv[2])) {
      console.log(
        chalk.green(
          'Démarrage du test sur ' + chalk.bold(process.argv[2]) + '!'
        )
      );

      let testerObj = new TesterObj(process.argv[2]);
      await testFile[process.argv[2]].test(testerObj);

      testerObj.final();
    } else if (process.argv[2] === 'all') {
      console.log(
        chalk.green('Démarrage de ' + chalk.bold('tous les tests') + '!')
      );

      for (let key in testFile) {
        let testerObj = new TesterObj(key);
        await testFile[key].test(testerObj);

        testerObj.final();
      }
    } else {
      console.log(chalk.red('Test non valide!'));
    }
  }
}

function TesterObj(testId) {
  this.testId = testId;
  this.testPassed = true;
  this.nbError = 0;
  this.nbOk = 0;

  this.assertEquals = (val1, val2, desc = '') => {
    if (val1 === val2) {
      console.log(
        chalk.green(this.testId + ' [' + desc + ']: ✓ ' + val1 + ' === ' + val2)
      );
      this.nbOk++;
    } else {
      console.log(
        chalk.red(this.testId + ' [' + desc + ']: ❌ ' + val1 + ' !== ' + val2)
      );
      this.testPassed = false;
      this.nbError++;
    }
  };

  this.assertTrue = (val, desc = '') => {
    if (val) {
      console.log(
        chalk.green(this.testId + ' [' + desc + ']: ✓ ' + val + ' est vraie')
      );
      this.nbOk++;
    } else {
      console.log(
        chalk.red(this.testId + ' [' + desc + ']: ❌ ' + val + ' est fausse')
      );
      this.testPassed = false;
      this.nbError++;
    }
  };

  this.assertFalse = (val, desc = '') => {
    if (!val) {
      console.log(
        chalk.green(this.testId + ' [' + desc + ']: ✓ ' + val + ' est fausse')
      );
      this.nbOk++;
    } else {
      console.log(
        chalk.red(this.testId + ' [' + desc + ']: ❌ ' + val + ' est vraie')
      );
      this.testPassed = false;
      this.nbError++;
    }
  };

  this.final = () => {
    console.log(chalk.blue.bold('-- Rapport du test ' + this.testId + ' --'));

    console.log(
      chalk.green(chalk.bold(this.nbOk) + ' ✓') +
        ' - ' +
        chalk.red(chalk.bold(this.nbError) + ' ❌')
    );

    if (this.testPassed) {
      console.log(chalk.green('\n> Test réalisé sans soucis!'));
    } else {
      console.log(chalk.red('\n> Il y a une c***lle dans le potage...'));
    }
  };
}
