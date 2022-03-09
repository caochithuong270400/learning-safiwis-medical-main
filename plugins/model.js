export default (context, inject) => {
  const requireModels = require.context('@/models', true, /\.js$/)
  const models = {}

  requireModels.keys().forEach((fileName) => {
    const modelConfig = requireModels(fileName)
    const modelName = modelConfig.default.getModelName()
    models[modelName] = modelConfig.default
  })

  inject('models', (name) => models[name])
}
