const chalk = require('chalk')
const log = console.log.bind(console)

exports.trimLeft = function(value, reg) {
  reg = reg || /^[\s|\*]*/g
  return String(value).replace(reg, '')
}

exports.isTodo = function(value) {
  return String(value).toLowerCase().startsWith('todo')
}

exports.getCommentValue = function(comments = []) {
  const outputs = []
  comments.forEach(comment => {
    const value = this.trimLeft(comment.value)
    if (this.isTodo(value)) {
      outputs.push(value.split(/\s+/g).slice(1).join(' '))
    }
  })
  return outputs
}

module.exports = ({ types: t }) => {
  return {
    visitor: {
      Program(path) {
        const file = path.hub.file
        const { sourceFileName, root } = file.opts
        const comments = exports.getCommentValue(path.parent.comments)

        comments.forEach(comment => {
          log(chalk.green(exports.trimLeft(sourceFileName, root)), ' : ', chalk.red(comment))
        })
      }
    }
  }
}