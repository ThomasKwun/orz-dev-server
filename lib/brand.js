const chalk = require("chalk")
const fielet = require("figlet")
const printBrand = (brand) => {
  console.log(
    chalk.yellow(
      fielet.textSync(brand, {
        horizontalLayout: "full"
      })
    )
  )
}
module.exports = printBrand
