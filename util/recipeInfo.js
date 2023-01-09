import getTransactionItemList from '~/util/getList'
import { getInventory, unmeasured } from '~/util/getInventory'
import { clean } from '~/util/getDifferences'

export function getRecipeInfo(recipe, $store) {
  const ingredients = getTransactionItemList(recipe.ingredients, {
    removeCount: true,
    removeEuroString: true,
    removeMeasurements: true,
    forceList: true,
  })

  // Find missing ingredients

  // Find the products the user is lacking after `requirementsAsList`
  const inventory = getInventory($store)

  //
  const requirements = []
  for (const product of ingredients) {
    const name = clean(product.description)
    const measurementUnit = product?.weight?.measurement ?? unmeasured
    const productInInventory = inventory[name]?.weights[measurementUnit]

    const inStockCount = productInInventory?.count ?? 0
    const requiredCount = product?.weight?.totalValue ?? product.itemCount

    const missing = Math.max(requiredCount - inStockCount, 0)

    requirements.push({
      measurementUnit,
      description: product.description,
      requiredTotal: requiredCount,
      inStock: inStockCount,
      missing,
    })
  }

  // Calculate total required ingredients percentage
  const totalRequirements = requirements.length
  let requirementsInStock = 0
  for (const requirement of requirements) {
    requirementsInStock += Math.min(
      requirement.inStock / requirement.requiredTotal,
      1
    )
  }
  const requirementsPossesedPercentage = Math.round(
    (requirementsInStock / totalRequirements) * 100
  )

  return {
    ingredients,
    requirements,
    approximatePriceInCents: 1599,
    requirementsPossesedPercentage,
  }
}

export function getPercentageColor(percentage) {
  if (percentage < 30) return 'rgb(255, 45, 85)'
  if (percentage < 50) return 'rgb(255, 149, 0)'
  if (percentage < 80) return 'rgb(255, 204, 0)'
  return 'rgb(52, 199, 89)'
}
